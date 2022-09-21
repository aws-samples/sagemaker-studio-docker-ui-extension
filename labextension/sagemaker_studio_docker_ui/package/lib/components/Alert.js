import * as React from "react";
import { alert, alertDanger, alertWarning, alertInfo, alertSuccess, } from "../style/Alert";
export class Alert extends React.Component {
    render() {
        return (React.createElement("div", { className: `${alert} ${this.alertClass(this.props.type)}` }, this.props.message));
    }
    alertClass(type) {
        const classes = {
            error: alertDanger,
            alert: alertWarning,
            notice: alertInfo,
            success: alertSuccess,
        };
        return classes[type] || classes.success;
    }
}
