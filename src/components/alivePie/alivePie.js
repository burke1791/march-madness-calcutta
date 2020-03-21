import React from 'react';
import './alivePie.css';
import { THEME_COLORS } from '../../utilities/constants';

function AlivePie(props) {

  const pieColor = (function(percent) {
    if (percent >= 0.7) {
      return THEME_COLORS.GREEN;
    } else if (percent >= 0.35) {
      return THEME_COLORS.YELLOW;
    } else {
      return THEME_COLORS.RED;
    }
  })(props.percent);

  const style = {
    backgroundImage: `conic-gradient(
      rgb(255, 255, 255) ${Math.floor(360 * (1 - props.percent))}deg,
      ${pieColor} 0 
    )`
  };

  return (
    <div className='alivePie' style={style}></div>
  );
}

export default AlivePie;