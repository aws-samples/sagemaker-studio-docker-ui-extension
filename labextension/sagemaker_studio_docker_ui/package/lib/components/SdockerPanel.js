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
            try {
                const reply = await requestAPIServer("create_host", {
                    body: JSON.stringify(dataToSend),
                    method: "POST",
                });
                console.log(reply);
                this.addAlert({ message: `Creating new docker host - instance will appear once it is healthy, might take few minutes`, wait: 15000 });
            }
            catch (reason) {
                console.error(`Error on POST /docker-host/create_host ${dataToSend}.\n${reason}`);
                this.addAlert({
                    type: "error",
                    message: `Error creating new docker host! "`,
                    wait: 5000
                });
            }
        };
        this.alertKey = 0;
        this.state = {
            INSTANCE_TYPE: "m5.large",
            alerts: [],
        };
        this.loadState();
        this.instanceTypes = [
          "t2.xlarge",
          "t2.medium",
          "t2.large",
          "t2.2xlarge",
          "m6gd.xlarge",
          "m6gd.large",
          "m6gd.8xlarge",
          "m6gd.4xlarge",
          "m6gd.2xlarge",
          "m6gd.16xlarge",
          "m6g.xlarge",
          "m6g.large",
          "m6g.8xlarge",
          "m6g.4xlarge",
          "m6g.2xlarge",
          "m6g.16xlarge",
          "m6gd.12xlarge",
          "m6g.12xlarge",
          "m5d.xlarge",
          "m5d.large",
          "m5d.4xlarge",
          "m5d.2xlarge",
          "m5d.24xlarge",
          "m5d.12xlarge",
          "m5.xlarge",
          "m5.large",
          "m5.4xlarge",
          "m5.2xlarge",
          "m5.24xlarge",
          "m5.12xlarge",
          "m4.xlarge",
          "m4.4xlarge",
          "m4.2xlarge",
          "m4.16xlarge",
          "m4.10xlarge",
          "r6gd.xlarge",
          "r6gd.large",
          "r6gd.8xlarge",
          "r6gd.4xlarge",
          "r6gd.2xlarge",
          "r6gd.16xlarge",
          "r6gd.12xlarge",
          "r6g.xlarge",
          "r6g.large",
          "r6g.8xlarge",
          "r6g.4xlarge",
          "r6g.2xlarge",
          "r6g.16xlarge",
          "r6g.12xlarge",
          "r5d.xlarge",
          "r5d.large",
          "r5d.4xlarge",
          "r5d.2xlarge",
          "r5d.24xlarge",
          "r5d.12xlarge",
          "r5.xlarge",
          "r5.large",
          "r5.4xlarge",
          "r5.2xlarge",
          "r5.24xlarge",
          "r5.12xlarge",
          "c7g.xlarge",
          "c7g.large",
          "c7g.8xlarge",
          "c7g.4xlarge",
          "c7g.2xlarge",
          "c7g.16xlarge",
          "c7g.12xlarge",
          "c6i.xlarge",
          "c6i.large",
          "c6i.8xlarge",
          "c6i.4xlarge",
          "c6i.32xlarge",
          "c6i.2xlarge",
          "c6i.24xlarge",
          "c6i.16xlarge",
          "c6i.12xlarge",
          "c6gn.xlarge",
          "c6gn.large",
          "c6gn.8xlarge",
          "c6gn.4xlarge",
          "c6gn.2xlarge",
          "c6gn.16xlarge",
          "c6gn.12xlarge",
          "c6gd.xlarge",
          "c6gd.large",
          "c6gd.8xlarge",
          "c6gd.4xlarge",
          "c6gd.2xlarge",
          "c6gd.16xlarge",
          "c6gd.12xlarge",
          "c6g.xlarge",
          "c6g.large",
          "c6g.8xlarge",
          "c6g.4xlarge",
          "c6g.2xlarge",
          "c6g.16xlarge",
          "c6g.12xlarge",
          "c5d.xlarge",
          "c5d.large",
          "c5d.9xlarge",
          "c5d.4xlarge",
          "c5d.2xlarge",
          "c5d.18xlarge",
          "c5.xlarge",
          "c5.large",
          "c5.9xlarge",
          "c5.4xlarge",
          "c5.2xlarge",
          "c5.18xlarge",
          "c4.xlarge",
          "c4.large",
          "c4.8xlarge",
          "c4.4xlarge",
          "c4.2xlarge",
          "trn1.32xlarge",
          "trn1.2xlarge",
          "p4de.24xlarge",
          "p4d.24xlarge",
          "p3.8xlarge",
          "p3.2xlarge",
          "p3.16xlarge",
          "p2.xlarge",
          "p2.8xlarge",
          "p2.16xlarge",
          "inf1.xlarge",
          "inf1.6xlarge",
          "inf1.2xlarge",
          "inf1.24xlarge",
          "g5.xlarge",
          "g5.8xlarge",
          "g5.4xlarge",
          "g5.48xlarge",
          "g5.2xlarge",
          "g5.24xlarge",
          "g5.16xlarge",
          "g5.12xlarge",
          "g4dn.xlarge",
          "g4dn.8xlarge",
          "g4dn.4xlarge",
          "g4dn.2xlarge",
          "g4dn.16xlarge",
          "g4dn.12xlarge"
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
        setTimeout(() => { this.setState({ alerts: [] }) }, alert.wait );
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
