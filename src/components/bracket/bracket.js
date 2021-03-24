import React, { useState, useEffect, Fragment } from 'react';
import { v4 } from 'uuid';

const messenger = new NotificationCenter();

const bracketWrapperStyle = {
  margin: '0 12px',
  height: '100%'
}

const testGames = [
  {
    gameId: 1,
    roundNum: 1,
    gameNum: 1,
    parentGameIds: null,
    nextGameId: 5,
    team1Id: 28,
    team1DisplayName: '1 Illinois',
    team1Score: 69,
    team2Id: 20,
    team2DisplayName: '16 Drexel',
    team2Score: 30
  },
  {
    gameId: 2,
    roundNum: 1,
    gameNum: 2,
    parentGameIds: null,
    nextGameId: 5,
    team1Id: 32,
    team1DisplayName: '8 Loyola Chicago',
    team1Score: 71,
    team2Id: 33,
    team2DisplayName: '9 Georgia Tech',
    team2Score: 60
  },
  {
    gameId: 5,
    roundNum: 2,
    gameNum: 1,
    parentGameIds: [1, 2],
    nextGameId: 7,
    team1Id: 28,
    team1DisplayName: '1 Illinois',
    team1Score: 58,
    team2Id: 32,
    team2DisplayName: '8 Loyola Chicago',
    team2Score: 71
  },
  {
    gameId: 3,
    roundNum: 1,
    gameNum: 3,
    parentGameIds: null,
    nextGameId: 6,
    team1Id: 29,
    team1DisplayName: '5 Tennessee',
    team1Score: 56,
    team2Id: 30,
    team2DisplayName: '12 Oregon State',
    team2Score: 70
  },
  {
    gameId: 4,
    roundNum: 1,
    gameNum: 4,
    parentGameIds: null,
    nextGameId: 6,
    team1Id: 31,
    team1DisplayName: '4 Oklahoma State',
    team1Score: 69,
    team2Id: 34,
    team2DisplayName: '13 Liberty',
    team2Score: 60
  },
  {
    gameId: 6,
    roundNum: 2,
    gameNum: 2,
    parentGameIds: [4, 5],
    nextGameId: 7,
    team1Id: 30,
    team1DisplayName: '12 Oregon State',
    team1Score: null,
    team2Id: 31,
    team2DisplayName: '4 Oklahoma State',
    team2Score: null
  },
  {
    gameId: 7,
    roundNum: 3,
    gameNum: 1,
    parentGameIds: [5, 6],
    nextGameId: null,
    team1Id: 32,
    team1DisplayName: '8 Loyola Chicago',
    team1Score: null,
    team2Id: null,
    team2DisplayName: null,
    team2Score: null
  }
];

const gameWidth = 130;

// traverses the games tree to identify which round the provided gameId takes place in
// Currently makes a HUGE assumption that the tree is binary and symmetric
const getRoundNum = (gameId, games, roundNum = 0) => {
  let parentGameIds = games.find(game => game.gameId == gameId).parentGameIds;

  if (parentGameIds == undefined || parentGameIds == null) {
    return roundNum += 1;
  } else {
    return getRoundNum(parentGameIds[0], games, roundNum += 1);
  }
}

function BracketFactory(props) {



  return (
    <>
      <Bracket anchor='left' />
      <Bracket anchor='right' />
    </>
  );
}

function Bracket(props) {

  const [games, setGames] = useState(testGames);

  const getBracketGamePosition = (roundNum, gameNum) => {
    return {
      x: getX(roundNum),
      y: getY(roundNum, gameNum) 
    };
  }

  const getX = (round) => {
    return (round - 1) * (gameWidth + 14);
  }

  const getY = (round, game) => {
    if (round == 1) {
      return (game - 1) * 45;
    } else {
      return (getY(round - 1, game * 2) + getY(round - 1, game * 2 - 1)) / 2;
    }
  }

  const getVerticalDistanceForNextGamePath = (round) => {
    // vertical distance between games in the current round
    let dy = getY(round, 2) - getY(round, 1);

    // 26 is a hard-coded value for now - can change when we refactor to adjustable bracket sizes
    return Math.ceil((dy - 26) / 2);
  }

  // assumes the first round will have the most games
  const getVerticalSize = (games, verticalSplit) => {
    if (!games || !games.length) return 0;

    let numGames = 0;

    games.forEach(game => {
      if (game.roundNum == 1) numGames += 1;
    });

    // if we split the bracket vertically, the vertical height is half
    return (verticalSplit ? numGames / 2 : numGames) * 45;
  }

  const getHorizontalSize = (games, verticalSplit) => {
    let numGames = 0;
    let round = 0;

    games.forEach(game => {
      if (game.roundNum > round) round = game.roundNum;
    });

    // if we split the bracket vertically, the horizontal size is doubled minus one (final game is shared with both halves)
    return (verticalSplit ? round * 2 / 1 : round) * 164;
  }

  const drawLineToNextGame = (nextGameId, roundNum, gameNum) => {
    if (nextGameId == null || nextGameId == undefined) return null;

    let x = getX(roundNum + 1) - 12;
    let y = getY(roundNum, gameNum) + 23;
    let v = getVerticalDistanceForNextGamePath(roundNum);

    if (gameNum % 2 == 0) {
      // path curving upward for even numbered games
      return (
        <path d={`m${x},${y} h3 a2,2 0 0 0 2,-2 v-${v} a2,2 0 0 1 2,-2 h3`} fill='transparent' stroke='#000' />
      )
    } else {
      // path curving downward for odd numbered games
      return (
        <path d={`m${x},${y} h3 a2,2 0 0 1 2,2 v${v} a2,2 0 0 0 2,2 h3`} fill='transparent' stroke='#000' />
      )
    }
  }

  const generateBracket = () => {
    let numGames = games.length;
    let rounds = logBase(numGames + 1, 2);

    if (rounds !== Math.floor(rounds)) {
      console.error('Number of games not consistent with a symmetric bracket');
      return null;
    }

    return games.map(game => {
      return (
        <Fragment key={game.gameId}>
          <BracketGame
            team1Id={game.team1Id}
            team1DisplayName={game.team1DisplayName}
            team1Score={game.team1Score}
            team2Id={game.team2Id}
            team2DisplayName={game.team2DisplayName}
            team2Score={game.team2Score}
            pos={getBracketGamePosition(game.roundNum, game.gameNum)}
          />
          {drawLineToNextGame(game.nextGameId, game.roundNum, game.gameNum)}
        </Fragment>
      );
    });
  }

  return (
    <div style={bracketWrapperStyle}>
      <svg height={getVerticalSize(games, false)} width='100%'>
        {generateBracket()}
      </svg>
    </div>
  );
}


function BracketGame(props) {

  const isWinner = (teamId) => {
    // if one or both teams don't have a score entry, return false
    if (props.team1Score == null || props.team2Score == null) return false;

    if (props.team1Id == teamId && props.team1Score > props.team2Score) {
      return true;
    } else if (props.team2Id == teamId && props.team2Score > props.team1Score) {
      return true;
    }

    return false;
  }

  const getX = () => {
    return props?.pos.x || 0;
  }

  const getY = () => {
    return props?.pos.y || 0;
  }

  return (
    <svg width={gameWidth} height='45' viewBox={`0 0 ${gameWidth + 4} 40`} x={getX()} y={getY()}>
      {/* game time */}
      {/* <text x='100' y='8' textAnchor='middle' style={gameTimeStyle}>
        {topText(game)}
      </text> */}

      {/* base background */}
      <rect x='2' y='5' width={gameWidth} height='30' fill='rgba(0,0,0,0)' rx='3' ry='3' />

      {/* teams */}
      <BracketTeam x={0} y={3} displayName={props.team1DisplayName} score={props.team1Score} id={props.team1Id} winner={isWinner(props.team1Id)} />

      <BracketTeam x={0} y={18.5} displayName={props.team2DisplayName} score={props.team2Score} id={props.team2Id} winner={isWinner(props.team2Id)} />

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
        width={gameWidth}
        height={15}
        fill={getTeamBackground()}
        rx={3}
        ry={3}
        style={{ stroke: '#dedede', strokeWidth: 1 }}
      />

      <RectClipped x={props.x} y={props.y} height={16.5} width={115}>
        <text x={props.x + 5} y={props.y + 14} style={{ fontSize: 10 }} fill={getTeamColor()}>
          {props.displayName}
        </text>
      </RectClipped>

      <path d={`m${props.x + (gameWidth - 28)},${props.y + 2.5} h27 a2.5,2.5 0 0 1 2.5,2.5 v9 a2.5,2.5 0 0 1 -2.5,2.5 h-27 z`} fill={getScoreBackground()} />
      <line x1={props.x + (gameWidth - 28)} y1={props.y + 2.5} x2={props.x + (gameWidth - 28)} y2={props.y + 16.5} style={{ stroke: '#dedede', strokeWidth: 1 }} />

      <text x={props.x + (gameWidth - 15)} y={props.y + 14} textAnchor='middle' style={{ fontSize: 10 }} fill={getScoreColor()}>
        {props.score}
      </text>
    </g>
  );
}

// copied from https://github.com/moodysalem/react-tournament-bracket/blob/master/src/components/Clipped.tsx
function Clipped(props) {

  const { path, children } = props;
  const id = v4();

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

// copied from https://github.com/moodysalem/react-tournament-bracket/blob/master/src/components/Clipped.tsx
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

function logBase(val, base) {
  return Math.log(val) / Math.log(base);
}


export default Bracket;