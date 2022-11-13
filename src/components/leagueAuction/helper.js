import * as Types from '../../utilities/types';

/**
 * @typedef RawSettings
 * @property {Array<LeagueSetting>} settings
 * @property {Array<LeagueSettingAllowed>} allowed
 */

/**
 * @typedef AuctionSettings
 * @property {Number} auctionInterval
 * @property {Number} minBid
 * @property {Number} minBuyin
 * @property {Number} maxBuyin
 * @property {Boolean} allowUnsoldTeams
 */

/**
 * @function
 * @param {RawSettings} data 
 * @returns {AuctionSettings}
 */
export function parseAuctionSettings(data) {
  if (data.settings && data.settings.length > 0) {
    const auctionSettings = {};

    data.settings.forEach(setting => {
      switch (setting.Code) {
        case 'AUCTION_INTERVAL':
          auctionSettings.auctionInterval = Number(setting.SettingValue);
          break;
        case 'MIN_BID':
          auctionSettings.minBid = +setting.SettingValue;
          break;
        case 'MIN_BUYIN':
          auctionSettings.minBuyin = +setting.SettingValue;
          break;
        case 'MAX_BUYIN':
          auctionSettings.maxBuyin = setting.SettingValue == null ? null : +setting.SettingValue;
          break;
        case 'UNCLAIMED_ALLOWED':
          auctionSettings.allowUnsoldTeams = setting.SettingValue.toLowerCase() === 'true' ? true : false;
          break;
        default:
          console.log('Unhandled auction setting');
      }
    });

    return auctionSettings;
  }

  return null;
}