import React from 'react';
import './alivePie.css';
import { THEME_COLORS } from '../../utilities/constants';
import { Tooltip } from 'antd';

function AlivePie(props) {

  const pieColor = (function(alive, total) {
    let percent = total == 0 ? 0 : alive / total;

    if (percent >= 0.7) {
      return THEME_COLORS.GREEN;
    } else if (percent >= 0.35) {
      return THEME_COLORS.YELLOW;
    } else {
      return THEME_COLORS.RED;
    }
  })(props.numTeamsAlive, props.numTeams);

  const style = {
    backgroundImage: `conic-gradient(
      rgb(255, 255, 255) ${Math.floor(360 * (1 - (props.numTeams == 0 ? 0 : props.numTeamsAlive / props.numTeams)))}deg,
      ${pieColor} 0 
    )`
  };

  return (
    <Tooltip placement='topRight' title={`${props.numTeamsAlive} of ${props.numTeams} teams still alive`}>
      <div className='alivePie' style={style}></div>
    </Tooltip>
  );
}

export default AlivePie;