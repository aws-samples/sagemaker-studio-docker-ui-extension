import * as React from "react";
import { requestAPIServer } from "../sagemaker-studio-docker-ui";
import {
  jpRunningSectionClass,
  jpRunningSectionHeader,
  runSidebarSectionClass,
  sidebarButtonClass,
  alertAreaClass
} from "../style/SettingsPanel";
import { SelectColumn, LabeledTextInput } from "./SelectColumn";
import { getItemList } from "./GetContexts";
import { getImageList } from "./GetImages";
import { getContainerList } from "./GetContainers";
import { Alert } from "./Alert";
const KEY = "sagemaker-studio-docker-ui:settings:data";
function isPromise(p) {
  if (p === null) { return false; };
  if (typeof p === 'object' && typeof p.then === 'function') {
    return true;
  }
  return false;
}
/** A React component for the sagemaker_studio_docker_ui extension's main display */
export class SdockerPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          contextList: null,
          imageList: null,
          containerList: null,
        };
        /**
         * Renders the component.
         *
         * @returns React element
         */
        this.render = () => {
            const notebookIndependent = React.createElement("div", null, this.renderViewButtons());
            return React.createElement("div", null, notebookIndependent);
        };
        this.onInstanceTypeChange = (event) => {
            this.setState({ INSTANCE_TYPE: event.target.value }, () => this.saveState());
        };
        this.handleSubmit = async () => {
            console.log("Creating new docker host");
            const dataToSend = { instance_type: this.state.INSTANCE_TYPE };
            this.clearAlerts();
            try {
                const reply = await requestAPIServer("create_host", {
                    body: JSON.stringify(dataToSend),
                    method: "POST",
                });
                console.log(reply);
                this.addAlert({ message: `Creating new docker host - instance will appear once it is healthy, might take few minutes` });
            }
            catch (reason) {
                console.error(`Error on POST /docker-host/create_host ${dataToSend}.\n${reason}`);
                this.addAlert({
                    type: "error",
                    message: `Error creating new docker host! "`,
                });
            }
            setInterval(() => this.clearAlerts(), 5000);
        };
        this.alertKey = 0;
        this.state = {
            INSTANCE_TYPE: "m5.large",
            alerts: [],
        };
        this.loadState();
        this.instanceTypes = [
          "m5.large",
          "m5.xlarge",
          "m5.2xlarge",
          "m5.4xlarge",
          "m5.12xlarge",
          "m5.24xlarge",
          "m4.xlarge",
          "m4.2xlarge",
          "m4.4xlarge",
          "m4.10xlarge",
          "m4.16xlarge",
          "c4.2xlarge",
          "c4.4xlarge",
          "c4.8xlarge",
          "c4.xlarge",
          "c5.18xlarge",
          "c5.2xlarge",
          "c5.4xlarge",
          "c5.9xlarge",
          "c5.xlarge",
          "c5n.18xlarge",
          "c5n.2xlarge",
          "c5n.4xlarge",
          "c5n.9xlarge",
          "c5n.xlarge",
          "p3.2xlarge",
          "p3.8xlarge",
          "p3.16xlarge",
          "p2.xlarge",
          "p2.8xlarge",
          "p2.16xlarge",
          "g4dn.xlarge",
          "g4dn.2xlarge",
          "g4dn.4xlarge",
          "g4dn.8xlarge",
          "g4dn.12xlarge",
          "g4dn.16xlarge"
        ];
    }
    tick() {
      try {
        getItemList(this, false).then(
          contextsRes => getImageList(this, false).then(
            imagesRes => getContainerList(this, false).then(
              containerRes => {
                this.setState({
                  contextList: contextsRes,
                  imageList: imagesRes,
                  containerList: containerRes,
                });
              }
            )
          )
        )      
      } catch (err){
        console.log(err);
      }      
    }        
    componentDidMount() {
      this.tick();
      this.interval = setInterval(() => this.tick(), 1000);
    }
    componentWillUnmount() {
      clearInterval(this.interval);
    }
    renderViewButtons() {
      return (React.createElement("form", { onSubmit: this.handleSubmit },
                React.createElement("div", { 
                    className: runSidebarSectionClass 
                },
                React.createElement("tr", null,
                React.createElement("td", null,
                React.createElement("span"),
                React.createElement(LabeledTextInput,
                    {
                      label: "Instance type:",
                      value: this.state.INSTANCE_TYPE,
                      options: this.instanceTypes,
                      onChange: this.onInstanceTypeChange
                    })),
                    React.createElement("td", null,
                  React.createElement(SelectColumn, null)),
                React.createElement("td", null,
                  React.createElement("input", { 
                    className: sidebarButtonClass, 
                    type: "button", 
                    title: "Start new docker host", 
                    value: "Start Host", 
                    onClick: this.handleSubmit 
                })),
                )),
              React.createElement(
                "div", 
                { 
                  className: runSidebarSectionClass 
                }, 
                null
              ),
              React.createElement(
                "header", 
                { 
                  className: jpRunningSectionClass
                },
                React.createElement(
                  "h2", 
                  { 
                    className: jpRunningSectionHeader
                  }, 
                  'Docker Hosts'
                ), 
              ),
              React.createElement(
                "div", 
                { 
                  className: 'jp-RunningSessions-sectionContainer'      
                },
                React.createElement("ul", { className: "jp-RunningSessions-sectionList" }, isPromise(this.state.contextList)?null:this.state.contextList)
              ),
              React.createElement("header", { className: jpRunningSectionClass},
                React.createElement("h2", { className: jpRunningSectionHeader}, 'Images')),this.state.imageList?this.state.imageList:null,
              React.createElement("header", { className: jpRunningSectionClass},
                React.createElement("h2", { className: jpRunningSectionHeader}, 'Containers')),this.state.containerList?this.state.containerList:null,
              React.createElement("div", { className: alertAreaClass }, this.state.alerts.map((alert) => (React.createElement(Alert, { key: `alert-${alert.key}`, type: alert.type, message: alert.message }))))))
    }
    addAlert(alert) {
        const key = this.alertKey++;
        const keyedAlert = Object.assign(Object.assign({}, alert), { key: `alert-${key}` });
        this.setState({ alerts: [keyedAlert] });
    }
    clearAlerts() {
        this.setState({ alerts: [] });
    }
    saveState() {
        const state = {
            INSTANCE_TYPE: this.state.INSTANCE_TYPE
        };
        console.log('save state', state);
        this.props.stateDB.save(KEY, state);
    }
    loadState() {
        this.props.stateDB.fetch(KEY).then((s) => {
            const state = s;
            console.log('load state: ', state);
            if (state) {
                this.setState({
                    INSTANCE_TYPE: state["INSTANCE_TYPE"]
                });
            }
        });
    }
}
