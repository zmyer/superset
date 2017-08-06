/* eslint camelcase: 0 */
import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Alert } from 'react-bootstrap';
import { sectionsToRender, visTypes } from '../stores/visTypes';
import ControlPanelSection from './ControlPanelSection';
import ControlRow from './ControlRow';
import Control from './Control';
import controls from '../stores/controls';
import * as actions from '../actions/exploreActions';

const propTypes = {
  actions: PropTypes.object.isRequired,
  alert: PropTypes.string,
  datasource_type: PropTypes.string.isRequired,
  exploreState: PropTypes.object.isRequired,
  controls: PropTypes.object.isRequired,
  form_data: PropTypes.object.isRequired,
  isDatasourceMetaLoading: PropTypes.bool.isRequired,
};

class ControlPanelsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.removeAlert = this.removeAlert.bind(this);
    this.getControlData = this.getControlData.bind(this);
  }
  getControlData(controlName) {
    const control = this.props.controls[controlName];
    // Identifying mapStateToProps function to apply (logic can't be in store)
    let mapF = controls[controlName].mapStateToProps;

    // Looking to find mapStateToProps override for this viz type
    const controlOverrides = visTypes[this.props.controls.viz_type.value].controlOverrides || {};
    if (controlOverrides[controlName] && controlOverrides[controlName].mapStateToProps) {
      mapF = controlOverrides[controlName].mapStateToProps;
    }
    // Applying mapStateToProps if needed
    if (mapF) {
      return Object.assign({}, control, mapF(this.props.exploreState, control));
    }
    return control;
  }
  sectionsToRender() {
    return sectionsToRender(this.props.form_data.viz_type, this.props.datasource_type);
  }
  removeAlert() {
    this.props.actions.removeControlPanelAlert();
  }
  render() {
    return (
      <div className="scrollbar-container">
        <div className="scrollbar-content">
          {this.props.alert &&
            <Alert bsStyle="warning">
              {this.props.alert}
              <i
                className="fa fa-close pull-right"
                onClick={this.removeAlert}
                style={{ cursor: 'pointer' }}
              />
            </Alert>
          }
          {this.sectionsToRender().map(section => (
            <ControlPanelSection
              key={section.label}
              label={section.label}
              tooltip={section.description}
            >
              {section.controlSetRows.map((controlSets, i) => (
                <ControlRow
                  key={`controlsetrow-${i}`}
                  controls={controlSets.map(controlName => (
                    controlName &&
                    this.props.controls[controlName] &&
                      <Control
                        name={controlName}
                        key={`control-${controlName}`}
                        value={this.props.form_data[controlName]}
                        validationErrors={this.props.controls[controlName].validationErrors}
                        actions={this.props.actions}
                        {...this.getControlData(controlName)}
                      />
                  ))}
                />
              ))}
            </ControlPanelSection>
          ))}
        </div>
      </div>
    );
  }
}

ControlPanelsContainer.propTypes = propTypes;

function mapStateToProps(state) {
  return {
    alert: state.controlPanelAlert,
    isDatasourceMetaLoading: state.isDatasourceMetaLoading,
    controls: state.controls,
    exploreState: state,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
}

export { ControlPanelsContainer };

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanelsContainer);
