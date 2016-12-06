import React, { PropTypes } from 'react';

const NUM_COLUMNS = 12;

const propTypes = {
  fields: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default class FieldSetRow extends React.Component {
  render() {
    const colSize = NUM_COLUMNS / this.props.fields.length;
    return (
      <div className="row space-2">
        {this.props.fields.map((field, i) => (
            <div className={`col-lg-${colSize} col-xs-12`} key={i} >
              {field}
            </div>
          )
        )}
      </div>
    );
  }
}

FieldSetRow.propTypes = propTypes;
