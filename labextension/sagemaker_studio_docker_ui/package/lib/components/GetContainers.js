import * as React from 'react';
import { requestAPIServer } from "../sagemaker-studio-docker-ui";
import { 
  defaultHeight,
  itemIconSpan,
  instanceDescriptionDiv,
  containerIconStyle
} from '../style/getContextsStyle';

export async function getContainers(instance){
  // console.log("Checking containers list");
  var contexts = [];
  try {
    const reply = await requestAPIServer("containers", {
      method: "GET",
    });
    contexts = reply
  }
  catch (reason) {
    console.error(`Error on GET /docker-host/containers.\n${reason}`);
    instance.addAlert({
        type: "error",
        message: `Error checking containers list! "`,
    });
    contexts = []
  };
  return contexts;
}

function getItem(
  container,
  iconClass = '', 
  turnOffHeightStyle = false
  ){
  const ITEM_CLASS = 'jp-RunningSessions-item';
  const SHUTDOWN_BUTTON_CLASS = 'jp-RunningSessions-itemShutdown';
  return React.createElement(
    "div", 
    { 
      className: 'jp-RunningSessions-sectionContainer'      
    },
    React.createElement(
      "ul", 
      { className: "jp-RunningSessions-sectionList" },
      React.createElement(
        "li",
        { 
          className: `${ITEM_CLASS} ${turnOffHeightStyle ? defaultHeight : ''}` 
        },
        React.createElement(
          "span", 
          { 
            className: `${itemIconSpan} jp-RunningSessions-itemIcon ${iconClass}`
          }
        ),
        React.createElement(
          "span", 
          { 
            className: instanceDescriptionDiv 
          }, 
          container
        )
      )
    )
  );
}

export function getContainerList(instance, turnOffHeightStyle = false){
  const ItemList = getContainers(instance)
    .then(res => {
      const ItemList = res.length > 0 ? res.map(containers => {
      return getItem(
          containers['Names'][0].slice(1),
          containerIconStyle,
          turnOffHeightStyle
        )}
      ) : null;
      return ItemList
    });
  return ItemList;
}