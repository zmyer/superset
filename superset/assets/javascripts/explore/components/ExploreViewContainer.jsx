/* eslint camelcase: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ChartContainer from './ChartContainer';
import ControlPanelsContainer from './ControlPanelsContainer';
import SaveModal from './SaveModal';
import QueryAndSaveBtns from './QueryAndSaveBtns';
import { getExploreUrl } from '../exploreUtils';
import * as actions from '../actions/exploreActions';
import { getFormDataFromControls } from '../stores/store';

const propTypes = {
  actions: PropTypes.object.isRequired,
  datasource_type: PropTypes.string.isRequired,
  chartStatus: PropTypes.string,
  controls: PropTypes.object.isRequired,
  forcedHeight: PropTypes.string,
  form_data: PropTypes.object.isRequired,
  standalone: PropTypes.bool.isRequired,
  triggerQuery: PropTypes.bool.isRequired,
  queryRequest: PropTypes.object,
};

class ExploreViewContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      height: this.getHeight(),
      width: this.getWidth(),
      showModal: false,
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleResize.bind(this));
    this.triggerQueryIfNeeded();
  }

  componentWillReceiveProps(np) {
    if (np.controls.viz_type.value !== this.props.controls.viz_type.value) {
      this.props.actions.resetControls();
      this.props.actions.triggerQuery();
    }
    if (np.controls.datasource.value !== this.props.controls.datasource.value) {
      this.props.actions.fetchDatasourceMetadata(np.form_data.datasource, true);
    }
  }

  componentDidUpdate() {
    this.triggerQueryIfNeeded();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize.bind(this));
  }

  onQuery() {
    // remove alerts when query
    this.props.actions.removeControlPanelAlert();
    this.props.actions.removeChartAlert();

    this.props.actions.triggerQuery();

    history.pushState(
      {},
      document.title,
      getExploreUrl(this.props.form_data));
  }

  onStop() {
    this.props.actions.chartUpdateStopped(this.props.queryRequest);
  }

  getWidth() {
    return `${window.innerWidth}px`;
  }

  getHeight() {
    if (this.props.forcedHeight) {
      return this.props.forcedHeight + 'px';
    }
    const navHeight = this.props.standalone ? 0 : 90;
    return `${window.innerHeight - navHeight}px`;
  }


  triggerQueryIfNeeded() {
    if (this.props.triggerQuery && !this.hasErrors()) {
      this.props.actions.runQuery(this.props.form_data);
    }
  }

  handleResize() {
    clearTimeout(this.resizeTimer);
    this.resizeTimer = setTimeout(() => {
      this.setState({ height: this.getHeight(), width: this.getWidth() });
    }, 250);
  }

  toggleModal() {
    this.setState({ showModal: !this.state.showModal });
  }
  hasErrors() {
    const ctrls = this.props.controls;
    return Object.keys(ctrls).some(
      k => ctrls[k].validationErrors && ctrls[k].validationErrors.length > 0);
  }
  renderErrorMessage() {
    // Returns an error message as a node if any errors are in the store
    const errors = [];
    for (const controlName in this.props.controls) {
      const control = this.props.controls[controlName];
      if (control.validationErrors && control.validationErrors.length > 0) {
        errors.push(
          <div key={controlName}>
            <strong>{`[ ${control.label} ] `}</strong>
            {control.validationErrors.join('. ')}
          </div>,
        );
      }
    }
    let errorMessage;
    if (errors.length > 0) {
      errorMessage = (
        <div style={{ textAlign: 'left' }}>{errors}</div>
      );
    }
    return errorMessage;
  }
  renderChartContainer() {
    return (
      <ChartContainer
        actions={this.props.actions}
        width={this.state.width}
        height={this.state.height}
      />);
  }

  render() {
    if (this.props.standalone) {
      return this.renderChartContainer();
    }
    return (
      <div
        id="explore-container"
        className="container-fluid"
        style={{
          height: this.state.height,
          overflow: 'hidden',
        }}
      >
        {this.state.showModal &&
        <SaveModal
          onHide={this.toggleModal.bind(this)}
          actions={this.props.actions}
          form_data={this.props.form_data}
        />
      }
        <div className="row">
          <div className="col-sm-4">
            <QueryAndSaveBtns
              canAdd="True"
              onQuery={this.onQuery.bind(this)}
              onSave={this.toggleModal.bind(this)}
              onStop={this.onStop.bind(this)}
              loading={this.props.chartStatus === 'loading'}
              errorMessage={this.renderErrorMessage()}
            />
            <br />
            <ControlPanelsContainer
              actions={this.props.actions}
              form_data={this.props.form_data}
              datasource_type={this.props.datasource_type}
            />
          </div>
          <div className="col-sm-8">
            {this.renderChartContainer()}
          </div>
        </div>
      </div>
    );
  }
}

ExploreViewContainer.propTypes = propTypes;

function mapStateToProps(state) {
  const form_data = getFormDataFromControls(state.controls);
  return {
    chartStatus: state.chartStatus,
    datasource_type: state.datasource.type,
    controls: state.controls,
    form_data,
    standalone: state.standalone,
    triggerQuery: state.triggerQuery,
    forcedHeight: state.forced_height,
    queryRequest: state.queryRequest,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export { ExploreViewContainer };
export default connect(mapStateToProps, mapDispatchToProps)(ExploreViewContainer);
