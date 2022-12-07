export const API_CONFIG = {
  AUCTION_SERVICE_BASE_URL: process.env.REACT_APP_BUILD_ENV == 'dev' ? process.env.REACT_APP_DEV_AUCTION_SERVICE_API_URL : process.env.REACT_APP_AUCTION_SERVICE_API_URL,
  LEAGUE_SERVICE_BASE_URL: process.env.REACT_APP_BUILD_ENV == 'dev' ? process.env.REACT_APP_DEV_LEAGUE_SERVICE_API_URL : process.env.REACT_APP_LEAGUE_SERVICE_API_URL,
  USER_SERVICE_BASE_URL: process.env.REACT_APP_BUILD_ENV == 'dev' ? process.env.REACT_APP_DEV_USER_SERVICE_API_URL : process.env.REACT_APP_USER_SERVICE_API_URL,
  TOURNAMENT_SERVICE_BASE_URL: process.env.REACT_APP_BUILD_ENV == 'dev' ? process.env.REACT_APP_DEV_TOURNAMENT_SERVICE_API_URL : process.env.REACT_APP_TOURNAMENT_SERVICE_API_URL
}

export const SERVICES = {
  LEAGUE_SERVICE: 'league_service',
  AUCTION_SERVICE: 'auction_service',
  USER_SERVICE: 'user_service'
}

export const LEAGUE_SERVICE_ENDPOINTS = {
  TOURNAMENT_OPTIONS: '/getTournamentOptions',
  LEAGUE_SUMMARIES: '/getLeagueSummaries',
  LEAGUE_METADATA: '/getLeagueMetadata',
  NEW_LEAGUE: '/createLeague',
  JOIN_LEAGUE: '/joinLeague',
  LEAGUE_USER_SUMMARIES: '/getLeagueUserSummaries',
  UPCOMING_GAMES: '/getUpcomingGames',
  REMAINING_TEAMS_COUNT: '/getRemainingTeamsCount',
  TOURNAMENT_BRACKET_GAMES: '/getTournamentGamesForBracket',
  LEAGUE_USER_TEAMS: '/getLeagueUserTeams',
  GET_LEAGUE_USER_METADATA: '/getLeagueUserMetadata',
  GET_LEAGUE_SETTINGS: '/getLeagueSettings',
  UPDATE_LEAGUE_SETTINGS: '/updateLeagueSettings',
  GET_LEAGUE_PAYOUT_SETTINGS: '/getLeaguePayoutSettings',
  UPDATE_LEAGUE_PAYOUT_SETTINGS: '/updateLeaguePayoutSettings',
  GET_LEAGUE_SEED_GROUPS: '/getLeagueSeedGroups',
  NEW_LEAGUE_SEED_GROUP: '/newLeagueSeedGroup',
  DELETE_LEAGUE_SEED_GROUP: '/deleteLeagueSeedGroup',
  KICK_LEAGUE_MEMBER: '/kickLeagueMember',
  UPDATE_LEAGUE_NAME: '/updateLeagueName',
  GET_AUCTION_BID_RULES: '/getAuctionBidRules',
  SET_AUCTION_BID_RULES: '/setAuctionBidRules',
  AUCTION_TAX_RULE: '/auctionTaxRule',
  GET_SUPPLEMENTAL_PAGES: '/getLeagueSupplementalPages',
  GET_MANUAL_PAYOUT_INFO: '/getManualPayoutInfo',
  SET_MANUAL_PAYOUT_INFO: '/setManualPayoutInfo',
  GET_LEAGUE_TEAM_PAYOUTS: '/getLeagueTeamPayouts',
  SET_LEAGUE_TEAM_PAYOUTS: '/setLeagueTeamPayouts',
  GET_LEAGUE_ROSTER: '/getLeagueRoster',
  SET_LEAGUE_MEMBER_ROLES: '/setLeagueMemberRoles'
}

export const AUCTION_SERVICE_ENDPOINTS = {
  SERVER_TIMESTAMP: '/getServerTime',
  FETCH_CHAT: '/getAllChatMessages',
  FETCH_AUCTION_STATUS: '/getAuctionStatus',
  FETCH_AUCTION_TEAMS: '/getAuctionTeams',
  FETCH_AUCTION_BUYINS: '/getAuctionMemberBuyIns',
  START_AUCTION: '/startAuction'
}

export const USER_SERVICE_ENDPOINTS = {
  GET_USER_METADATA: '/getUserMetadata',
  GET_USER_UPCOMING_GAMES: '/getUserUpcomingGames'
}

export const TOURNAMENT_SERVICE_ENDPOINTS = {
  GET_TOURNAMENT_TREE: '/getTournamentTree',
  GET_WORLD_CUP_TABLES: '/getWorldCupTables',
  GET_WORLD_CUP_BRACKET: '/getWorldCupBracket',
  GET_MARCH_MADNESS_BRACKET: '/getMarchMadnessBracket'
}

export const THEME_COLORS = {
  RED: '#ff5356',
  YELLOW: '#faad14',
  GREEN: '#52c41a'
}

export const SOCKETS = {
  AUCTION: process.env.REACT_APP_BUILD_ENV == 'dev' ? process.env.REACT_APP_DEV_AUCTION_SERVICE_WEBSOCKET_ENDPOINT : process.env.REACT_APP_AUCTION_SERVICE_WEBSOCKET_ENDPOINT
}

export const AUTH_FORM_TYPE = {
  SIGN_IN: 'Sign In',
  SIGN_UP: 'Create an Account',
  CONFIRM: 'confirm',
  PASSWORD_RESET: 'Password Reset',
  FORGOT_PASSWORD: 'Forgot Password'
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
  CONFIRMED_SOLD: 'confirmed-sold',
  END: 'end'
}

export const NOTIF = {
  AUTH: 'auth',
  LEAGUE_SERVICE: 'league_service',
  AUTH_MODAL_SHOW: 'auth_modal_show',
  AUTH_MODAL_DISMISS: 'auth_modal_dismiss',
  AUTH_FORM_TOGGLE: 'auth_form_toggle',
  AUTH_ERROR: 'auth_error',
  SEED_GROUP_MODAL_SHOW: 'seed_group_modal_show',
  SEED_GROUP_MODAL_DISMISS: 'seed_group_modal_dismiss',
  TOURNAMENT_OPTIONS_DOWNLOADED: 'tournament_options_downloaded',
  LEAGUE_MODAL_SHOW: 'league_modal_show',
  LEAGUE_FORM_TOGGLE: 'league_form_toggle',
  LEAGUE_CREATED: 'league_created',
  LEAGUE_JOINED: 'league_joined',
  LEAGUE_SUMMARIES_FETCHED: 'league_summaries_fetched',
  LEAGUE_USER_SUMMARIES_FETCHED: 'league_user_summaries_fetched',
  UPCOMING_GAMES_DOWNLOADED: 'upcoming_games_downloaded',
  REMAINING_GAMES_COUNT_DOWNLOADED: 'remaining_games_count_downloaded',
  REMAINING_TEAMS_COUNT_DOWNLOADED: 'remaining_teams_count_downloaded',
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
  CHAT_MESSAGES: 'chat_messages',
  NEW_AUCTION_DATA: 'new_auction_data',
  NEW_AUCTION_DATA_AVAILABLE: 'new_auction_data_available',
  TIMER_EXPIRED: 'timer_expired',
  TOURNAMENT_BRACKET_GAMES: 'tournament_bracket_games',
  MM_RESULTS_DOWNLOADED: 'mm_results_downloaded',
  MM_SCORE_SET: 'mm_score_set',
  MM_SCORE_SET_ERR: 'mm_score_set_err',
  USER_ID: 'user_id',
  AUCTION_MODAL_SHOW: 'auction_modal_show',
  AUCTION_MODAL_DISMISS: 'auction_modal_dismiss',
  AUCTION_SERVICE_RECONNECT: 'auction_service_reconnect'
};

export const ERROR_MESSAGES = {
  GENERAL: 'Error',
  INVALID_CREDENTIALS: 'Invalid Credentials',
  EMAIL_EXISTS: 'Email address already in use'
}

export const SETTING_TYPES = {
  INPUT_NUMBER: 'Number',
  BOOLEAN: 'Boolean',
  TEXT: 'Text'
};

export const SETTING_CLASS = {
  GROUPS: 'groups'
};

export const SETTINGS_TOOLTIPS = {
  GROUPS_HEADER: 'Put two or more tournament teams into a single item to be auctioned off',
  INVITE_CODE: 'Your friends can use this code when they click the "Join League" button on the main page',
  INVITE_URL: 'This Url can be used to navigate directly to a "Join League" page'
};

export const SUPPLEMENTAL_PAGES = [
  'world-cup-group-stage',
  'world-cup-knockout',
  'march-madness-bracket'
];