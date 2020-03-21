export const ENDPOINTS = {
  TOURNAMENT_OPTIONS: '/getTournamentOptions',
  NEW_LEAGUE: '/createLeague',
  JOIN_LEAGUE: '/joinLeague',
  LEAGUE_SUMMARIES: '/getLeagueSummaries',
  LEAGUE_USER_SUMMARIES: '/getLeagueUserSummaries',
  UPCOMING_GAMES: '/getUpcomingGames',
  LEAGUE_USER_TEAMS: '/getLeagueUserTeams',
  SERVER_TIMESTAMP: '/getServerTime',
  FETCH_CHAT: '/getAllChatMessages',
  FETCH_AUCTION_STATUS: '/getAuctionStatus',
  FETCH_AUCTION_TEAMS: '/getAuctionTeams',
  FETCH_AUCTION_BUYINS: '/getAuctionMemberBuyIns',
  START_AUCTION: '/startAuction'
};

export const THEME_COLORS = {
  RED: '#ff5356',
  YELLOW: '#faad14',
  GREEN: '#52c41a'
}

export const SOCKETS = {
  AUCTION: 'wss://m5q6i9kma9.execute-api.us-east-1.amazonaws.com/dev'
}

export const AUTH_FORM_TYPE = {
  SIGN_IN: 'Sign In',
  SIGN_UP: 'Create an Account',
  CONFIRM: 'confirm'
};

export const LEAGUE_FORM_TYPE = {
  CREATE: 'Start a League',
  JOIN: 'Join a League'
};

export const MESSAGE_BOARD_FORM_TYPE = {
  NEW_TOPIC: 'New Topic'
};

export const AUCTION_STATUS = {
  INITIAL: 'initial',
  BIDDING: 'bidding',
  SOLD: 'sold',
  END: 'end'
}

export const NOTIF = {
  AUTH_MODAL_SHOW: 'auth_modal_show',
  AUTH_FORM_TOGGLE: 'auth_form_toggle',
  AUTH_ERROR: 'auth_error',
  TOURNAMENT_OPTIONS_DOWNLOADED: 'tournament_options_downloaded',
  LEAGUE_MODAL_SHOW: 'league_modal_show',
  LEAGUE_FORM_TOGGLE: 'league_form_toggle',
  LEAGUE_CREATED: 'league_created',
  LEAGUE_JOINED: 'league_joined',
  LEAGUE_MENU_TOGGLE: 'league_menu_toggle',
  LEAGUE_SUMMARIES_FETCHED: 'league_summaries_fetched',
  LEAGUE_USER_SUMMARIES_FETCHED: 'league_user_summaries_fetched',
  UPCOMING_GAMES_DOWNLOADED: 'upcoming_games_downloaded',
  LEAGUE_USER_TEAMS_FETCHED: 'league_user_teams_fetched',
  MESSAGE_BOARD_TOPICS_DOWNLOADED: 'message_board_topics_downloaded',
  MESSAGE_BOARD_MODAL_SHOW: 'message_board_modal_show',
  MESSAGE_THREAD_DOWNLOADED: 'message_thread_downloaded',
  NEW_MESSAGE_POSTED: 'new_message_posted',
  SERVER_SYNCED: 'server_synced',
  AUCTION_TEAMS_DOWNLOADED: 'auction_teams_downloaded',
  AUCTION_BUYINS_DOWNLOADED: 'auction_buyins_downloaded',
  AUCTION_ERROR: 'auction_error',
  SIGN_IN: 'sign_in',
  SIGN_OUT: 'sign_out',
  NEW_CHAT_MESSAGE: 'new_chat_message',
  NEW_AUCTION_DATA: 'new_auction_data',
  NEW_AUCTION_DATA_AVAILABLE: 'new_auction_data_available',
  TIMER_EXPIRED: 'timer_expired',
  MM_RESULTS_DOWNLOADED: 'mm_results_downloaded',
  MM_SCORE_SET: 'mm_score_set',
  MM_SCORE_SET_ERR: 'mm_score_set_err'
};

export const ERROR_MESSAGES = {
  GENERAL: 'Error',
  INVALID_CREDENTIALS: 'Invalid Credentials'
}