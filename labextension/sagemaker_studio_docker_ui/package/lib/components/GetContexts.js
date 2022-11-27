import * as React from 'react';
import { requestAPIServer } from "../sagemaker-studio-docker-ui";
import { ToolbarButtonComponent } from '@jupyterlab/apputils';
import { 
  defaultHeight,
  itemIconSpan,
  instanceDescriptionDiv,
  runningHostStyle,
  idleHostStyle
} from '../style/getContextsStyle';
import { ContextSwitcher } from './SwitchContext';
import { HostTerminator } from './TerminateHost';

export async function getContexts(instance){
  //console.log("Checking contexts list");
  var contexts = [];
  try {
    const reply = await requestAPIServer("contexts", {
      method: "GET",
    });
    contexts = reply
  }
  catch (reason) {
    console.error(`Error on GET /docker-host/contexts.\n${reason}`);
    instance.addAlert({
        type: "error",
        message: `Error checking contexts list! "`,
        wait: 5000
    });
    contexts = []
  };
  return contexts;
}

function getItem(
  instance,
  instanceId, 
  instanceType,
  turnOffHeightStyle = false, 
  children, 
  tooltip,
  current = false
  ){
    const ITEM_CLASS = 'jp-RunningSessions-item';
    const SHUTDOWN_BUTTON_CLASS = 'jp-RunningSessions-itemShutdown';
    const switcherInstance = new ContextSwitcher(instance, instanceType, instanceId);
    const terminatorInstance = new HostTerminator(instance, instanceId);
    const secondCol = current?
    React.createElement(
        "span", 
        { 
          className: `${itemIconSpan} jp-RunningSessions-itemIcon ${runningHostStyle}`
        }
      ):
      React.createElement(
        ToolbarButtonComponent,
        {
          className: SHUTDOWN_BUTTON_CLASS,
          tooltip: 'Set as default docker host',
          iconClassName: idleHostStyle,
          onClick: switcherInstance.switcher
        }
      );
    return (
      React.createElement(
        "li",
        { 
          className: `${ITEM_CLASS} ${turnOffHeightStyle ? defaultHeight : ''}` 
        },
        secondCol,
        children,
        React.createElement(
          "span", 
          { 
            className: instanceDescriptionDiv 
          }, 
          instanceId
        ),
        React.createElement(
          "span", 
          { 
            className: instanceDescriptionDiv 
          }, 
          instanceType
        ),
        React.createElement(
          ToolbarButtonComponent,
          {
            className: SHUTDOWN_BUTTON_CLASS,
            tooltip: tooltip,
            iconClassName: "jp-CodeQuitIcon",
            onClick: terminatorInstance.terminator
          }
        )
      )
    );
  }

export function getItemList(instance, turnOffHeightStyle = false){
  const ItemList = getContexts(instance)
  .then( res => {
    const ItemList = res.length > 0 ? res.map(context => {
    return getItem(
        instance,
        context['InstanceId'],
        context['InstanceType'],
        turnOffHeightStyle,
        null,
        'Shutdown docker host',
        context['Current']==='true'?true:false
      )}
    ) : null;
    return ItemList
  });
  return ItemList
}