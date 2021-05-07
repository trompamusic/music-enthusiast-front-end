import React from 'react';

/*
  ImgLang: React hook module used for rendering language dependant images.
  props:
    image: image path string.
    lng: current language.
*/
export default function ImgLang(props) {
  const images = require.context("../../images", true);
  let src = '';
  try {
    src = images('./' + props.lng + '/' + props.image);
  } catch (e) {
    src = images('./en/' + props.image);
  }
  return <img alt={props.alt} src={src} {...props} />;
}