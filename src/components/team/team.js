import React from 'react';

const defaultStyle = {
  textAlign: 'center',
  fontSize: 32,
  fontWeight: 500
};

const defaultImgStyle = {
  height: 'auto',
  width: 'auto'
};

/**
 * @typedef TeamProps
 * @property {Object} style - React style prop; for the top-level div
 * @property {Object} imgStyle - React style prop; for the logo div
 * @property {String} imgSrc - url for the team logo
 * @property {String} name - team name
 */

/**
 * @component Team
 * @param {TeamProps} props 
 */
function Team(props) {

  return (
    <div style={{...defaultStyle, ...props.style}}>
      <div
        style={{ width: props.imgStyle?.maxWidth ? props.imgStyle.maxWidth + 10 : '100%', textAlign: 'center', display: 'inline-block' }}
        hidden={!props.imgSrc}
      >
        <img src={props.imageSrc} style={{...defaultImgStyle, ...props.imgStyle}} />
      </div>
      <div style={{ marginLeft: 8, display: 'inline-block' }}>
        <span>{props.name}</span>
      </div>
    </div>
  );
}

export default Team;