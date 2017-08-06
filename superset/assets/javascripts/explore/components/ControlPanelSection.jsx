import React from 'react';
import PropTypes from 'prop-types';
import { Panel } from 'react-bootstrap';
import InfoTooltipWithTrigger from '../../components/InfoTooltipWithTrigger';

const propTypes = {
  label: PropTypes.string,
  description: PropTypes.string,
  tooltip: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const defaultProps = {
  label: null,
  description: null,
  tooltip: null,
};

export default class ControlPanelSection extends React.Component {
  renderHeader() {
    const { label, tooltip } = this.props;
    let header;
    if (label) {
      header = (
        <div>
          {label} &nbsp;
          {tooltip && <InfoTooltipWithTrigger label={label} tooltip={tooltip} />}
        </div>
      );
    }
    return header;
  }

  render() {
    return (
      <Panel
        className="control-panel-section"
        header={this.renderHeader()}
      >
        {this.props.children}
      </Panel>
    );
  }
}

ControlPanelSection.propTypes = propTypes;
ControlPanelSection.defaultProps = defaultProps;
