"""Package's main module!"""
from __future__ import absolute_import
from __future__ import division
from __future__ import print_function
from __future__ import unicode_literals

import logging
from logging.handlers import TimedRotatingFileHandler

import json
import os

from flask import Flask, redirect
from flask_appbuilder import SQLA, AppBuilder, IndexView
from flask_appbuilder.baseviews import expose
from flask_migrate import Migrate
from flask_wtf.csrf import CSRFProtect
from werkzeug.contrib.fixers import ProxyFix

from superset.connectors.connector_registry import ConnectorRegistry
from superset import utils, config  # noqa


APP_DIR = os.path.dirname(__file__)
CONFIG_MODULE = os.environ.get('SUPERSET_CONFIG', 'superset.config')

with open(APP_DIR + '/static/assets/backendSync.json', 'r') as f:
    frontend_config = json.load(f)


app = Flask(__name__)
app.config.from_object(CONFIG_MODULE)
conf = app.config


@app.context_processor
def get_js_manifest():
    manifest = {}
    try:
        with open(APP_DIR + '/static/assets/dist/manifest.json', 'r') as f:
            manifest = json.load(f)
    except Exception as e:
        print(
            "no manifest file found at " +
            APP_DIR + "/static/assets/dist/manifest.json"
        )
    return dict(js_manifest=manifest)


for bp in conf.get('BLUEPRINTS'):
    try:
        print("Registering blueprint: '{}'".format(bp.name))
        app.register_blueprint(bp)
    except Exception as e:
        print("blueprint registration failed")
        logging.exception(e)

if conf.get('SILENCE_FAB'):
    logging.getLogger('flask_appbuilder').setLevel(logging.ERROR)

if not app.debug:
    # In production mode, add log handler to sys.stderr.
    app.logger.addHandler(logging.StreamHandler())
    app.logger.setLevel(logging.INFO)
logging.getLogger('pyhive.presto').setLevel(logging.INFO)

db = SQLA(app)

if conf.get('WTF_CSRF_ENABLED'):
    csrf = CSRFProtect(app)

utils.pessimistic_connection_handling(db.engine.pool)

cache = utils.setup_cache(app, conf.get('CACHE_CONFIG'))
tables_cache = utils.setup_cache(app, conf.get('TABLE_NAMES_CACHE_CONFIG'))

migrate = Migrate(app, db, directory=APP_DIR + "/migrations")

# Logging configuration
logging.basicConfig(format=app.config.get('LOG_FORMAT'))
logging.getLogger().setLevel(app.config.get('LOG_LEVEL'))

if app.config.get('ENABLE_TIME_ROTATE'):
    logging.getLogger().setLevel(app.config.get('TIME_ROTATE_LOG_LEVEL'))
    handler = TimedRotatingFileHandler(app.config.get('FILENAME'),
                                       when=app.config.get('ROLLOVER'),
                                       interval=app.config.get('INTERVAL'),
                                       backupCount=app.config.get('BACKUP_COUNT'))
    logging.getLogger().addHandler(handler)

if app.config.get('ENABLE_CORS'):
    from flask_cors import CORS
    CORS(app, **app.config.get('CORS_OPTIONS'))

if app.config.get('ENABLE_PROXY_FIX'):
    app.wsgi_app = ProxyFix(app.wsgi_app)

if app.config.get('ENABLE_CHUNK_ENCODING'):
    class ChunkedEncodingFix(object):

        def __init__(self, app):
            self.app = app

        def __call__(self, environ, start_response):
            # Setting wsgi.input_terminated tells werkzeug.wsgi to ignore
            # content-length and read the stream till the end.
            if 'chunked' == environ.get('HTTP_TRANSFER_ENCODING', '').lower():
                environ['wsgi.input_terminated'] = True
            return self.app(environ, start_response)
    app.wsgi_app = ChunkedEncodingFix(app.wsgi_app)

if app.config.get('UPLOAD_FOLDER'):
    try:
        os.makedirs(app.config.get('UPLOAD_FOLDER'))
    except OSError:
        pass

for middleware in app.config.get('ADDITIONAL_MIDDLEWARE'):
    app.wsgi_app = middleware(app.wsgi_app)


class MyIndexView(IndexView):
    @expose('/')
    def index(self):
        return redirect('/superset/welcome')

appbuilder = AppBuilder(
    app, db.session,
    base_template='superset/base.html',
    indexview=MyIndexView,
    security_manager_class=app.config.get("CUSTOM_SECURITY_MANAGER"))

sm = appbuilder.sm

get_session = appbuilder.get_session
results_backend = app.config.get("RESULTS_BACKEND")

# Registering sources
module_datasource_map = app.config.get("DEFAULT_MODULE_DS_MAP")
module_datasource_map.update(app.config.get("ADDITIONAL_MODULE_DS_MAP"))
ConnectorRegistry.register_sources(module_datasource_map)

from superset import views  # noqa
