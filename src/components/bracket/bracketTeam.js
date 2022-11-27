import React, { useState, useEffect } from 'react';
import { Popover } from 'antd';
import { useTournamentDispatch, useTournamentState } from '../../context/tournamentContext';
import BracketTeamPopover from './bracketTeamPopover';
import { teamDisplayName } from '../../utilities/helper';
import Team from '../team/team';
import { useBracketState } from '../../context/bracketContext';
import RectClipped from './rectClipped';

function BracketTeam(props) {

  const [hover, setHover] = useState(false);
  const [bracketUserHover, setBracketUserHover] = useState(false);

  const { bracketUserSelected, hoverHighlightId } = useTournamentState();
  const { gameWidth, scoreWidth } = useBracketState();
  const tournamentDispatch = useTournamentDispatch();

  useEffect(() => {
    if (props.ownerId && props.ownerId == bracketUserSelected) {
      setBracketUserHover(true);
    } else {
      setBracketUserHover(false);
    }
  }, [bracketUserSelected]);

  useEffect(() => {
    if (props.id != undefined && hoverHighlightId == props.id) {
      setHover(true);
    } else {
      setHover(false);
    }
  }, [hoverHighlightId]);

  const sendHoverMsg = (hover) => {
    if (props.id != null) {
      if (hover) {
        tournamentDispatch({ type: 'update', key: 'hoverHighlightId', value: props.id });
      } else {
        tournamentDispatch({ type: 'update', key: 'hoverHighlightId', value: null });
      }
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
    <Popover 
      title={
        <Team
          imageSrc={props.team.logoUrl}
          style={{ fontSize: 18 }}
          imgStyle={{ maxWidth: 25 }}
          name={teamDisplayName(props.team.teamName, props.team.seed)}
        />
      }
      content={<BracketTeamPopover team={props.team} />}
    >
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

export default BracketTeam;