import os
import subprocess
import json
from setuptools import setup, find_packages

BASE_DIR = os.path.abspath(os.path.dirname(__file__))
PACKAGE_DIR = os.path.join(BASE_DIR, 'superset', 'static', 'assets')
PACKAGE_FILE = os.path.join(PACKAGE_DIR, 'package.json')
with open(PACKAGE_FILE) as package_file:
    version_string = json.load(package_file)['version']


def get_git_sha():
    try:
        s = str(subprocess.check_output(['git', 'rev-parse', 'HEAD']))
        return s.strip()
    except:
        return ""

GIT_SHA = get_git_sha()
version_info = {
    'GIT_SHA': GIT_SHA,
    'version': version_string,
}
print("-==-" * 15)
print("VERSION: " + version_string)
print("GIT SHA: " + GIT_SHA)
print("-==-" * 15)

with open(os.path.join(PACKAGE_DIR, 'version_info.json'), 'w') as version_file:
    json.dump(version_info, version_file)


setup(
    name='superset',
    description=(
        "A interactive data visualization platform build on SqlAlchemy "
        "and druid.io"),
    version=version_string,
    packages=find_packages(),
    include_package_data=True,
    zip_safe=False,
    scripts=['superset/bin/superset'],
    install_requires=[
        'boto3==1.4.4',
        'celery==3.1.25',
        'colorama==0.3.9',
        'cryptography==1.9',
        'flask-appbuilder==1.9.1',
        'flask-cache==0.13.1',
        'flask-migrate==2.0.3',
        'flask-script==2.0.5',
        'flask-sqlalchemy==2.1',
        'flask-testing==0.6.2',
        'flask-wtf==0.14.2',
        'flower==0.9.1',
        'future>=0.16.0, <0.17',
        'humanize==0.5.1',
        'gunicorn==19.7.1',
        'markdown==2.6.8',
        'pandas==0.20.2',
        'parsedatetime==2.0.0',
        'pydruid==0.3.1',
        'PyHive>=0.4.0',
        'python-dateutil==2.6.0',
        'requests==2.17.3',
        'simplejson==3.10.0',
        'six==1.10.0',
        'sqlalchemy==1.1.9',
        'sqlalchemy-utils==0.32.14',
        'sqlparse==0.2.3',
        'thrift>=0.9.3',
        'thrift-sasl>=0.2.1',
    ],
    extras_require={
        'cors': ['Flask-Cors>=2.0.0'],
    },
    tests_require=[
        'codeclimate-test-reporter',
        'coverage',
        'mock',
        'nose',
        'redis',
    ],
    author='Maxime Beauchemin',
    author_email='maximebeauchemin@gmail.com',
    url='https://github.com/airbnb/superset',
    download_url=(
        'https://github.com/airbnb/superset/tarball/' + version_string),
    classifiers=[
        'Programming Language :: Python :: 2.7',
        'Programming Language :: Python :: 3.4',
        'Programming Language :: Python :: 3.5',
    ],
)
