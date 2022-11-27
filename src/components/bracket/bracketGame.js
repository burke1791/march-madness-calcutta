import React from 'react';
import { useBracketState } from '../../context/bracketContext';
import BracketTeam from './bracketTeam';

function BracketGame(props) {

  const { gameWidth } = useBracketState();

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

export default BracketGame;