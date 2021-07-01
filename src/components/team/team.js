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

function Team(props) {

  return (
    <div style={{...defaultStyle, ...props.style}}>
      <div style={{ width: props.imgStyle?.maxWidth ? props.imgStyle.maxWidth + 10 : '100%', textAlign: 'center', display: 'inline-block' }}>
        <img src={props.imageSrc} style={{...defaultImgStyle, ...props.imgStyle}} />
      </div>
      <div style={{ marginLeft: 8, display: 'inline-block' }}>
        <span>{props.name}</span>
      </div>
    </div>
  );
}

export default Team;