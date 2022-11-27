import { ILayoutRestorer } from '@jupyterlab/application';
import { IStateDB } from '@jupyterlab/coreutils';
import { requestAPIServer } from './sagemaker-studio-docker-ui';
import { SdockerWidget } from './widgets/SdockerWidget';
/**
 * Initialization data for the sagemaker_studio_docker_ui extension.
 */
const extension = {
    id: 'sagemaker-studio-docker-ui',
    autoStart: true,
    requires: [ILayoutRestorer, IStateDB],
    activate: async (app, restorer, stateDB) => {
        console.log('JupyterLab extension sagemaker-studio-docker-ui is activated!');
        let INSTANCE_TYPE = 'm5.large';
        const KEY = 'sagemaker-studio-docker-ui:settings:data';
        // Create sdocker widget sidebar
        const sdockerWidget = new SdockerWidget(stateDB);
        sdockerWidget.id = 'jp-sdocker';
        sdockerWidget.title.iconClass = 'jp-SideBar-tabIcon jp-dockerIcon sdocker-sidebar-icon';
        sdockerWidget.title.caption = 'Sagemaker Studio Docker UI';
        // Let the application restorer track the running panel for restoration of
        // application state (e.g. setting the running panel as the current side bar
        // widget).
        restorer.add(sdockerWidget, 'sagemaker-studio-docker-ui-sidebar');
        // Rank has been chosen somewhat arbitrarily to give priority to the running
        // sessions widget in the sidebar.
        app.shell.add(sdockerWidget, 'left', { rank: 220 });
        // POST request
        app.restored.then(() => stateDB.fetch(KEY)).then((s) => {
            const state = s;
            if (state) {
                if (state['INSTANCE_TYPE']) {
                    console.log(state['INSTANCE_TYPE']);
                    INSTANCE_TYPE = state['INSTANCE_TYPE'];
                }
            }
        }).then(async () => {
            const dataToSend = {
                instance_type: INSTANCE_TYPE
            };
            try {
                const reply = await requestAPIServer('contexts', {
                    body: JSON.stringify(dataToSend),
                    method: 'POST'
                });
                console.log(reply);
            }
            catch (reason) {
                console.error(`Error on POST /docker-host/contexts ${JSON.stringify(dataToSend)}.\n${reason}`);
            }
        });
    }
};
export default extension;
