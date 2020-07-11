import React, { useState, useEffect } from 'react';
import './bracket.css';

const messenger = new NotificationCenter();

function Bracket(props) {

  const generateBracket = () => {
    let numGames = props.games.length;
    let numTeams = (props.games.length + 1) * 2;
    let rounds = logBase(numGames + 1, 2);

    if (rounds !== Math.floor(rounds)) {
      console.error('Number of games not consistent with a symmetric bracket');
      return null;
    }

    let bracket = [];
    let nextRoundGameId = numGames;
    let columnGames = [];
    let roundNum = 1;

    for (var i = 0; i < props.games.length; i++) {
      if (props.games[i].gameId == nextRoundGameId) {
        console.log('next round');
        console.log(nextRoundGameId);
        nextRoundGameId = numGames;
        bracket.push(<BracketColumn games={columnGames} key={roundNum} />);
        columnGames = [];

        bracket.push(<BracketColumnDivider key={`${roundNum}-d`} />);

        roundNum++;
      }

      if (props.games[i].nextGameId == null) {
        nextRoundGameId = null;
      } else {
        nextRoundGameId = props.games[i].nextGameId < nextRoundGameId ? props.games[i].nextGameId : nextRoundGameId;
      }

      columnGames.push({
        key: props.games[i].gameId,
        team1: {
          name: props.games[i].team1Name,
          score: props.games[i].team1Score,
          id: props.games[i].team1Id
        },
        team2: {
          name: props.games[i].team2Name,
          score: props.games[i].team2Score,
          id: props.games[i].team2Id
        }
      });
    }

    // adding final round to the DOM
    bracket.push(<BracketColumn games={columnGames} key={roundNum} />);

    return bracket;
  }

  return (
    <div className='bracket-wrapper'>
      {generateBracket()}
    </div>
  );
}

function BracketColumn(props) {

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

function BracketColumnDivider() {
  return (
    <div className='bracket-column-divider'></div>
  );
}

function BracketGame(props) {

  return (
    <div className='bracket-game'>
      <BracketTeam pos='top' name={props.team1Name} score={props.team1Score} highlightId={props.team1Id} />
      <BracketTeam pos='bot' name={props.team2Name} score={props.team2Score} highlightId={props.team2Id} />
    </div>
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