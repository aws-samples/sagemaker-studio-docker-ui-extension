import React from 'react';
import { selectColumnClass, selectDorpDownClass } from '../style/SelectColumn';
export class SelectColumn extends React.Component {
    render() {
        return (React.createElement("table", { className: selectColumnClass + ' selectColumnMarker' },
            React.createElement("tbody", null, this.props.children)));
    }
}
export class LabeledTextInput extends React.Component {
  render() {
    return (React.createElement(
      "tr",
      null,
      React.createElement(
        "td",
        null,
        this.props.label
        ),
        React.createElement(
          "td",
          null,
          React.createElement(
            'select',
            {
              className: selectDorpDownClass,
              name: "pick an instance",
              onChange: this.props.onChange,
              value: this.props.value
            },
            this.props.options.map((item, i)=> React.createElement("option", {key:i}, item))
          )
        )
    ));
  }
}
