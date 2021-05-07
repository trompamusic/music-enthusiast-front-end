import React from "react";

/*
  Popup: React Hook that renders a popup over the screen.
  props:
    title: title of the popup.
    content: Content of the popup. It can be a React Component or text.
    buttons: Content for the footer section of the popup. It should be a React Component with buttons to perform
    actions, including popup closing.
    visible: Flag that indicates if popup should be visible or not.
    size: String that indicates the width of the popup. It can be in % or px. Units must be specified in string.
*/
export default function Popup({ title = '', content = '', buttons = '', visible, size }) {
  const style = size? { width: size } : {};
  return [
    <div key="popup-container" id="popup-container" className={visible? "visible" : "hidden"}>
      <div id="popup-dialog" style={style}>
        <div id="popup-title"><b>{title}</b></div>
        <div id="popup-title">{content}</div>
        <div className="button-container">
          {buttons}
        </div>
      </div>
    </div>,
    <div key="screenmask" id="screen-mask" className={visible? "screen-mask-visible": "screen-mask-hidden"}/>
  ];
}
