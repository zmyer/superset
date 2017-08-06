/* eslint-disable no-unused-expressions */
import { it, describe } from 'mocha';
import { expect } from 'chai';
import sinon from 'sinon';
import $ from 'jquery';
import * as actions from '../../../javascripts/explore/actions/exploreActions';
import * as exploreUtils from '../../../javascripts/explore/exploreUtils';
import { defaultState } from '../../../javascripts/explore/stores/store';
import { exploreReducer } from '../../../javascripts/explore/reducers/exploreReducer';

describe('reducers', () => {
  it('sets correct control value given a key and value', () => {
    const newState = exploreReducer(
      defaultState, actions.setControlValue('x_axis_label', 'x', []));
    expect(newState.controls.x_axis_label.value).to.equal('x');
  });
  it('setControlValue works as expected with a checkbox', () => {
    const newState = exploreReducer(defaultState,
      actions.setControlValue('show_legend', true, []));
    expect(newState.controls.show_legend.value).to.equal(true);
  });
});

describe('fetching actions', () => {
  let dispatch;
  let request;
  let ajaxStub;

  beforeEach(() => {
    dispatch = sinon.spy();
    ajaxStub = sinon.stub($, 'ajax');
  });
  afterEach(() => {
    ajaxStub.restore();
  });

  describe('fetchDatasourceMetadata', () => {
    const datasourceKey = '1__table';

    const makeRequest = (alsoTriggerQuery = false) => {
      request = actions.fetchDatasourceMetadata(datasourceKey, alsoTriggerQuery);
      request(dispatch);
    };

    it('calls fetchDatasourceStarted', () => {
      makeRequest();
      expect(dispatch.args[0][0].type).to.equal(actions.FETCH_DATASOURCE_STARTED);
    });

    it('makes the ajax request', () => {
      makeRequest();
      expect(ajaxStub.calledOnce).to.be.true;
    });

    it('calls correct url', () => {
      const url = `/superset/fetch_datasource_metadata?datasourceKey=${datasourceKey}`;
      makeRequest();
      expect(ajaxStub.getCall(0).args[0].url).to.equal(url);
    });

    it('calls correct actions on error', () => {
      ajaxStub.yieldsTo('error', { responseJSON: { error: 'error text' } });
      makeRequest();
      expect(dispatch.callCount).to.equal(2);
      expect(dispatch.getCall(1).args[0].type).to.equal(actions.FETCH_DATASOURCE_FAILED);
    });

    it('calls correct actions on success', () => {
      ajaxStub.yieldsTo('success', { data: '' });
      makeRequest();
      expect(dispatch.callCount).to.equal(4);
      expect(dispatch.getCall(1).args[0].type).to.equal(actions.SET_DATASOURCE);
      expect(dispatch.getCall(2).args[0].type).to.equal(actions.FETCH_DATASOURCE_SUCCEEDED);
      expect(dispatch.getCall(3).args[0].type).to.equal(actions.RESET_FIELDS);
    });

    it('triggers query if flag is set', () => {
      ajaxStub.yieldsTo('success', { data: '' });
      makeRequest(true);
      expect(dispatch.callCount).to.equal(5);
      expect(dispatch.getCall(4).args[0].type).to.equal(actions.TRIGGER_QUERY);
    });
  });

  describe('fetchDashboards', () => {
    const userID = 1;
    const mockDashboardData = {
      pks: ['value'],
      result: [
        { dashboard_title: 'dashboard title' },
      ],
    };
    const makeRequest = () => {
      request = actions.fetchDashboards(userID);
      request(dispatch);
    };

    it('makes the ajax request', () => {
      makeRequest();
      expect(ajaxStub.calledOnce).to.be.true;
    });

    it('calls correct url', () => {
      const url = '/dashboardmodelviewasync/api/read?_flt_0_owners=' + userID;
      makeRequest();
      expect(ajaxStub.getCall(0).args[0].url).to.equal(url);
    });

    it('calls correct actions on error', () => {
      ajaxStub.yieldsTo('error', { responseJSON: { error: 'error text' } });
      makeRequest();
      expect(dispatch.callCount).to.equal(1);
      expect(dispatch.getCall(0).args[0].type).to.equal(actions.FETCH_DASHBOARDS_FAILED);
    });

    it('calls correct actions on success', () => {
      ajaxStub.yieldsTo('success', mockDashboardData);
      makeRequest();
      expect(dispatch.callCount).to.equal(1);
      expect(dispatch.getCall(0).args[0].type).to.equal(actions.FETCH_DASHBOARDS_SUCCEEDED);
    });
  });
});

describe('runQuery', () => {
  let dispatch;
  let urlStub;
  let ajaxStub;
  let request;

  beforeEach(() => {
    dispatch = sinon.spy();
    urlStub = sinon.stub(exploreUtils, 'getExploreUrl').callsFake(() => ('mockURL'));
    ajaxStub = sinon.stub($, 'ajax');
  });

  afterEach(() => {
    urlStub.restore();
    ajaxStub.restore();
  });

  it('should handle query timeout', () => {
    ajaxStub.yieldsTo('error', { statusText: 'timeout' });
    request = actions.runQuery({});
    request(dispatch);
    expect(dispatch.callCount).to.equal(2);
    expect(dispatch.args[0][0].type).to.equal(actions.CHART_UPDATE_TIMEOUT);
  });
});
