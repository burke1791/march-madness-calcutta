import { Popover } from 'antd';
import React, { useState, useEffect, Fragment } from 'react';
import { v4 } from 'uuid';
import { useTournamentState } from '../../context/tournamentContext';
import { teamDisplayName } from '../../utilities/helper';
import Team from '../team/team';
import BracketTeamPopover from './bracketTeam';

const messenger = new NotificationCenter();

const bracketWrapperStyle = {
  margin: '0 12px',
  height: '100%'
}

const gameWidth = 115;
const scoreWidth = 20;

function BracketFactory(props) {

  const [leftGames, setLeftGames] = useState([]);
  const [rightGames, setRightGames] = useState([]);

  const getSubBracketGames = (anchor) => {
    if (props.games && props.games.length) {
      let root = props.games.find(game => game.childMatchupId == null);
      let leftRootMatchupId = root.parentMatchupIds[0];
      let rightRootMatchupId = root.parentMatchupIds[1];

      let subTree = [];

      if (anchor == 'left') {
        subTree = constructBinarySubTree(leftRootMatchupId, props.games);
      } else if (anchor == 'right') {
        subTree = constructBinarySubTree(rightRootMatchupId, props.games);
      }

      return subTree;
    }

    return [];
  }

  const constructBinarySubTree = (rootMatchupId, games) => {
    return games.filter(game => {
      return isPartOfSubTree(rootMatchupId, game, games);
    });
  }

  const isPartOfSubTree = (rootMatchupId, game, games) => {
    if (game.childMatchupId == rootMatchupId || game.matchupId == rootMatchupId) {
      return true;
    } else if (game.childMatchupId == null && game.matchupId != rootMatchupId) {
      return false;
    } else {
      let child = games.find(gameObj => gameObj.matchupId == game.childMatchupId);
      return isPartOfSubTree(rootMatchupId, child, games);
    }
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
    return (verticalSplit ? round * 2 - 2 : round) * (gameWidth + 14);
  }

  return (
    <div style={bracketWrapperStyle}>
      <svg height={getVerticalSize(props.games, true)} width={getHorizontalSize(props.games, true)}>
        <Bracket anchor='left' games={getSubBracketGames('left')} maxX={getHorizontalSize(props.games, true)} maxY={getVerticalSize(props.games, true)} />
        <Bracket anchor='right' games={getSubBracketGames('right')} maxX={getHorizontalSize(props.games, true)} maxY={getVerticalSize(props.games, true)} />
      </svg>
    </div>
  );
}

function Bracket(props) {

  const getBracketGamePosition = (matchupId, roundNum) => {
    let gameNum = getGameNum(matchupId);

    return {
      x: getX(roundNum),
      y: getY(roundNum, gameNum) 
    };
  }

  const getX = (round) => {
    if (props.anchor == 'left') {
      return (round - 1) * (gameWidth + 14);
    } else if (props.anchor == 'right') {
      return props.maxX - (round - 1) * (gameWidth + 14) - gameWidth;
    }
  }

  const getY = (round, game) => {
    if (round == 1) {
      return (game - 1) * 45;
    } else {
      return (getY(round - 1, game * 2) + getY(round - 1, game * 2 - 1)) / 2;
    }
  }

  const getGameNum = (matchupId) => {
    let currentGame = props.games.find(game => game.matchupId == matchupId);

    let matchupNums = props.games.filter(game => game.roundNum == currentGame.roundNum).map(game => game.matchupNum);
    matchupNums.sort((a, b) => a - b);

    let gameNum = matchupNums.indexOf(currentGame.matchupNum) + 1;

    return gameNum;
  }

  const getVerticalDistanceForNextGamePath = (round) => {
    // vertical distance between games in the current round
    let dy = getY(round, 2) - getY(round, 1);

    // 26 is a hard-coded value for now - can change when we refactor to adjustable bracket sizes
    return Math.ceil((dy - 26) / 2);
  }

  const drawLineToNextGame = (matchupId, nextGameId, roundNum) => {
    if (nextGameId == null || nextGameId == undefined || props.games.find(game => game.matchupId == nextGameId) == undefined) return null;

    let gameNum = getGameNum(matchupId);
    let x = props.anchor == 'left' ? getX(roundNum + 1) - 12 : getX(roundNum + 1) + gameWidth + 12;
    let y = getY(roundNum, gameNum) + 23;
    let v = getVerticalDistanceForNextGamePath(roundNum);

    if (props.anchor == 'left') {
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
    } else if (props.anchor == 'right') {
      if (gameNum % 2 == 0) {
        // path curving upward for even numbered games
        return (
          <path d={`m${x},${y} h-3 a2,2 0 0 1 -2,-2 v-${v} a2,2 0 0 0 -2,-2 h-3`} fill='transparent' stroke='#000' />
        )
      } else {
        // path curving downward for odd numbered games
        return (
          <path d={`m${x},${y} h-3 a2,2 0 0 0 -2,2 v${v} a2,2 0 0 1 -2,2 h-3`} fill='transparent' stroke='#000' />
        )
      }
    }
  }

  // I hate this
  const getTeamsInDisplayOrder = (game) => {
    // lower seed goes on top
    if (game.roundNum == 1) {
      return game.teams[0].seed < game.teams[1].seed ? [game.teams[0], game.teams[1]] : [game.teams[1], game.teams[0]];
    } else if (game.parentMatchupIds.length == 2) {
      let parentGame1 = props.games.find(gameObj => gameObj.matchupId == game.parentMatchupIds[0]);
      let parentGame2 = props.games.find(gameObj => gameObj.matchupId == game.parentMatchupIds[1]);
      let parentGame1GameNum = getGameNum(parentGame1.matchupId);
      let parentGame2GameNum = getGameNum(parentGame2.matchupId);

      if (parentGame1GameNum < parentGame2GameNum) {
        if (parentGame1.teams[0].teamId == game.teams[0].teamId || parentGame1.teams[1].teamId == game.teams[0].teamId) {
          return [game.teams[0], game.teams[1]];
        } else {
          return [game.teams[1], game.teams[0]];
        }
      } else {
        if (parentGame1.teams[0].teamId == game.teams[0].teamId || parentGame1.teams[1].teamId == game.teams[0].teamId) {
          return [game.teams[1], game.teams[0]];
        } else {
          return [game.teams[0], game.teams[1]];
        }
      }
    }
  }

  const generateBracket = () => {
    if (props.games && props.games.length) {
      let numGames = props.games.length;
      let rounds = logBase(numGames + 1, 2);

      if (rounds !== Math.floor(rounds)) {
        console.error('Number of games not consistent with a symmetric bracket');
        return null;
      }

      return props.games.map(game => {
        let [team1, team2] = getTeamsInDisplayOrder(game);

        return (
          <Fragment key={game.matchupId}>
            <BracketGame
              team1={team1}
              team2={team2}
              anchor={props.anchor}
              pos={getBracketGamePosition(game.matchupId, game.roundNum)}
            />
            {drawLineToNextGame(game.matchupId, game.childMatchupId, game.roundNum)}
          </Fragment>
        );
      });
    }

    return null;
  }

  return (
    <>
      {generateBracket()}
    </>
  );
}


function BracketGame(props) {

  const isWinner = (teamId) => {
    // if one or both teams don't have a score entry, return false
    if (props.team1.score == null || props.team2.score == null) return false;

    if (props.team1.teamId == teamId && props.team1.score > props.team2.score) {
      return true;
    } else if (props.team2.teamId == teamId && props.team2.score > props.team1.score) {
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

  const getTeamDisplayName = (seed, teamName) => {
    if (props.anchor == 'right') {
      return seed != undefined ? `${teamName} ${seed}` : teamName;
    }

    return seed != undefined ? `${seed} ${teamName}` : teamName;
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
      <BracketTeam
        x={0}
        y={3}
        anchor={props.anchor}
        displayName={getTeamDisplayName(props.team1.seed, props.team1.teamName)}
        score={props.team1.score}
        id={props.team1.teamId}
        ownerId={props.team1.userId}
        winner={isWinner(props.team1.teamId)}
        team={props.team1}
      />

      <BracketTeam
        x={0}
        y={18.5}
        anchor={props.anchor}
        displayName={getTeamDisplayName(props.team2.seed, props.team2.teamName)}
        score={props.team2.score}
        id={props.team2.teamId}
        ownerId={props.team2.userId}
        winner={isWinner(props.team2.teamId)}
        team={props.team2}
      />

      {/* game name */}
      {/* <text x='100' y='68' textAnchor='middle' style={gameNameStyle}>
        {bottomText(game)}
      </text> */}
    </svg>
  );
}

function BracketTeam(props) {

  const [hover, setHover] = useState(false);
  const [bracketUserHover, setBracketUserHover] = useState(false);

  const { bracketUserSelected } = useTournamentState();

  useEffect(() => {
    messenger.listen('HOVER', BracketTeam, toggleHover);

    return (() => {
      messenger.ignore('HOVER', BracketTeam);
    });
  }, []);

  useEffect(() => {
    if (props.ownerId && props.ownerId == bracketUserSelected) {
      setBracketUserHover(true);
    } else {
      setBracketUserHover(false);
    }
  }, [bracketUserSelected])

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
    return (hover || bracketUserHover) ? '#03314e' : '#fff';
  }
  
  const getTeamColor = () => {
    return (hover || bracketUserHover) ? '#fff' : null;
  }

  const getTeamTextStyle = () => {
    let style = { fontSize: 9 };
    return props.winner ? { fontWeight: 'bold', ...style } : style;
  }

  const getScoreBackground = () => {
    return props.winner ? '#e77822' : '#e6f7ff';
  }

  const getScoreColor = () => {
    return props.winner ? '#fff' : null;
  }

  const getScoreTextStyle = () => {
    let style = { fontSize: 9 };

    return props.winner ? { fontWeight: 'bold', ...style } : style;
  }

  const generateScoreBackgroundPath = () => {
    if (props.anchor == 'left') {
      return <path d={`m${props.x + (gameWidth - scoreWidth)},${props.y + 2.5} h${scoreWidth - 1} a2.5,2.5 0 0 1 2.5,2.5 v9 a2.5,2.5 0 0 1 -2.5,2.5 h-${scoreWidth - 1} z`} fill={getScoreBackground()} />;
    } else if (props.anchor == 'right') {
      return <path d={`m${props.x + (scoreWidth + 4)},${props.y + 2.5} h-${scoreWidth - 1} a2.5,2.5 0 0 0 -2.5,2.5 v9 a2.5,2.5 0 0 0 2.5,2.5 h${scoreWidth - 1} z`} fill={getScoreBackground()} />;
    }
  }

  return (
    <Popover title={<Team imageSrc={props.team.logoUrl} style={{ fontSize: 18 }} imgStyle={{ maxWidth: 25 }} name={teamDisplayName(props.team.teamName, props.team.seed)} />} content={<BracketTeamPopover team={props.team} />}>
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
          <text x={props.x + (props.anchor == 'left' ? 5 : gameWidth - 5)} y={props.y + 14} textAnchor={props.anchor == 'left' ? 'start' : 'end'} style={getTeamTextStyle()} fill={getTeamColor()}>
            {props.displayName}
          </text>
        </RectClipped>

        {generateScoreBackgroundPath()}
        <line x1={props.x + (props.anchor == 'left' ? gameWidth - scoreWidth : scoreWidth + 4)} y1={props.y + 2.5} x2={props.x + (props.anchor == 'left' ? gameWidth - scoreWidth : scoreWidth + 4)} y2={props.y + 16.5} style={{ stroke: '#dedede', strokeWidth: 1 }} />

        <text x={props.x + (props.anchor == 'left' ? (gameWidth - (scoreWidth / 2)) : (scoreWidth + 4) / 2)} y={props.y + 14} textAnchor='middle' style={getScoreTextStyle()} fill={getScoreColor()}>
          {props.score}
        </text>
      </g>
    </Popover>
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


export default BracketFactory;