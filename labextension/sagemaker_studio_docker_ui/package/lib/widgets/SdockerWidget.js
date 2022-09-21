import { ReactWidget } from '@jupyterlab/apputils';
import * as React from 'react';
import { SdockerPanel } from '../components/SdockerPanel';
import { sdockerWidgetStyle } from '../style/SdockerWidgetStyle';
/**
 * A class that exposes the Sdocker server plugin Widget.
 */
export class SdockerWidget extends ReactWidget {
    constructor(stateDB, options) {
        super(options);
        this.node.id = 'SdockerSession-root';
        this.addClass(sdockerWidgetStyle);
        this.stateDB = stateDB;
        console.log('Sdocker widget created');
    }
    render() {
        return (React.createElement(SdockerPanel, { stateDB: this.stateDB }));
    }
}
