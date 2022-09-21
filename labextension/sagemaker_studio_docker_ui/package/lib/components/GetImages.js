import * as React from 'react';
import { requestAPIServer } from "../sagemaker-studio-docker-ui";
import { 
  defaultHeight,
  itemIconSpan,
  instanceDescriptionDiv,
  imageIconStyle
} from '../style/getContextsStyle';

export async function getImages(instance){
  // console.log("Checking images list");
  var images= [];
  try {
    const reply = await requestAPIServer("images", {
      method: "GET",
    });
    images = reply
  }
  catch (reason) {
    console.error(`Error on GET /docker-host/images.\n${reason}`);
    instance.addAlert({
        type: "error",
        message: `Error checking images list! "`,
    });
    images = []
  };
  return images;
}

function getItem(
  image,
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
      { 
        className: "jp-RunningSessions-sectionList" 
      }, 
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
          image
        )
      )
    )
  );
}

export function getImageList(instance, turnOffHeightStyle = false){
  const ItemList = getImages(instance)
    .then(res => {
      const ItemList = res.length > 0 ? res.map(images => {
      return getItem(
          images['RepoTags'],
          imageIconStyle,
          turnOffHeightStyle
        )}
      ) : null;
      return ItemList
    });
  return ItemList;
}