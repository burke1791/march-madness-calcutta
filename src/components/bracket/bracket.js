import React, { useState, useEffect } from 'react';

import { geekblue, orange } from '@ant-design/colors';

const messenger = new NotificationCenter();

function Bracket(props) {

  return (
    <BracketGame />
  );
}


function BracketGame(props) {

  console.log(orange);

  return (
    <svg width='200' height='82' viewBox='0 0 204 82'>
      {/* game time */}
      {/* <text x='100' y='8' textAnchor='middle' style={gameTimeStyle}>
        {topText(game)}
      </text> */}

      {/* base background */}
      <rect x='2' y='12' width='150' height='30' fill='rgba(0,0,0,0)' rx='3' ry='3' />

      {/* teams */}
      <BracketTeam x={0} y={10} displayName='1 Illinois' score={169} id={28} winner />

      <BracketTeam x={0} y={25.5} displayName='16 Eastern Washington' score={130} id={20} />

      {/* game name */}
      {/* <text x='100' y='68' textAnchor='middle' style={gameNameStyle}>
        {bottomText(game)}
      </text> */}
    </svg>
  );
}


function BracketTeam(props) {

  const [hover, setHover] = useState(false);

  useEffect(() => {
    messenger.listen('HOVER', BracketTeam, toggleHover);

    return (() => {
      messenger.ignore('HOVER', BracketTeam);
    });
  }, []);

  const sendHoverMsg = (hover) => {
    if (props.id != null) {
      messenger.send('HOVER', { 
        highlightId: props.id,
        hover: hover
      });
    }
  }

  const toggleHover = (obj) => {
    if (obj.highlightId == props.id) {
      setHover(obj.hover);
    }
  }

  const getTeamBackground = () => {
    return hover ? '#03314e' : '#fff';
  }
  
  const getTeamColor = () => {
    return hover ? '#fff' : null;
  }

  const getScoreBackground = () => {
    return props.winner ? '#e77822' : '#e6f7ff';
  }

  const getScoreColor = () => {
    return props.winner ? '#fff' : null;
  }

  return (
    <g
      onMouseEnter={() => sendHoverMsg(true)}
      onMouseLeave={() => sendHoverMsg(false)}
    >
      <rect
        x={props.x + 2}
        y={props.y + 2}
        width={150}
        height={15}
        fill={getTeamBackground()}
        rx={3}
        ry={3}
        style={{ stroke: '#dedede', strokeWidth: 1 }}
      />

      <RectClipped x={props.x} y={props.y} height={16.5} width={115} id={props.id}>
        <text x={props.x + 5} y={props.y + 14} style={{ fontSize: 10 }} fill={getTeamColor()}>
          {props.displayName}
        </text>
      </RectClipped>

      <path d={`m${props.x + 122},${props.y + 2.5} h27 a2.5,2.5 0 0 1 2.5,2.5 v9 a2.5,2.5 0 0 1 -2.5,2.5 h-27 z`} fill={getScoreBackground()} />
      <line x1={props.x + 122} y1={props.y + 2.5} x2={props.x + 122} y2={props.y + 16.5} style={{ stroke: '#dedede', strokeWidth: 1 }} />

      <text x={props.x + 135} y={props.y + 14} textAnchor='middle' style={{ fontSize: 10 }} fill={getScoreColor()}>
        {props.score}
      </text>
    </g>
  );
}

function Clipped(props) {

  const { id, path, children } = props;

  return (
    <g>
      <defs>
        <clipPath id={id}>
          {path}
        </clipPath>
      </defs>

      <g clipPath={`url(#${id})`}>
        {children}
      </g>
    </g>
  );
}

function RectClipped(props) {
  const { id, x, y, width, height, children } = props;

  return (
    <Clipped id={id} path={<rect x={x} y={y} width={width} height={height}/>}>
      {children}
    </Clipped>
  );
}

function NotificationCenter() {
  this.obs = {};

  this.listen = function(msg, sub, cb) {
    if (!this.obs[msg]) {
      this.obs[msg] = [];
    }

    this.obs[msg].push({
      observer: sub,
      callback: cb
    });
  }

  this.send = function(msg, data) {
    if (!this.obs[msg]) {
      throw new Error('unhandled message type: ' + msg);
    }

    let subs = this.obs[msg];

    for (var sub of subs) {
      sub.callback(data);
    }
  }

  this.ignore = function(msg, sub) {
    let subs = this.obs[msg];

    for (var i in subs) {
      if (subs[i].observer === sub) {
        subs.splice(i, 1);
        this.obs[msg] = subs;
        return;
      }
    }
  }
}


export default Bracket;










// Legacy below

function BracketColumn_(props) {

  const generateColumn = () => {
    return props.games.map(game => {
      return (
        <BracketGame
          key={game.key}
          team1Name={game.team1.name}
          team1Score={game.team1.score}
          team1Id={game.team1.id}
          team2Name={game.team2.name}
          team2Score={game.team2.score}
          team2Id={game.team2.id}
        />
      );
    });
  }

  return (
    <div className='bracket-column'>
      {generateColumn()}
    </div>
  );
}

function BracketColumnDivider_() {
  return (
    <div className='bracket-column-divider'></div>
  );
}

function BracketGame_(props) {

  return (
    <div className='bracket-game'>
      <BracketTeam pos='top' name={props.team1Name} score={props.team1Score} highlightId={props.team1Id} />
      <BracketTeam pos='bot' name={props.team2Name} score={props.team2Score} highlightId={props.team2Id} />
    </div>
  );
}

function BracketTeam_(props) {

  const [hover, setHover] = useState(false);

  useEffect(() => {
    messenger.listen('HOVER', BracketTeam, toggleHover);

    return (() => {
      messenger.ignore('HOVER', BracketTeam);
    });
  }, []);

  let bracketClass = hover ? `bracket-team bracket-team-${props.pos} bracket-hover` : `bracket-team bracket-team-${props.pos}`;

  const sendHoverMsg = (hover) => {
    if (props.highlightId != null) {
      messenger.send('HOVER', { 
        highlightId: props.highlightId,
        hover: hover
      });
    }
  }

  const toggleHover = (obj) => {
    if (obj.highlightId == props.highlightId) {
      setHover(obj.hover);
    }
  }

  return (
    <div
      className={bracketClass}
      onMouseEnter={() => sendHoverMsg(true)}
      onMouseLeave={() => sendHoverMsg(false)}
    >
      <div className='bracket-team-name'>
        <span className='bracket-team-name-text'>{props.name}</span>
      </div>
      <div className='score'>
        <span className='score-text'>{props.score}</span>
      </div>
    </div>
  );
}



function logBase(val, base) {
  return Math.log(val) / Math.log(base);
}