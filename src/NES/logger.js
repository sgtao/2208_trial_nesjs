/* logger.js */

/**
 *
 */
function convertDecToHexString(num, width, noPrefix = false) {
  let str = num.toString(16);
  let prefix = '';
  if (num < 0)
    prefix += '-';

  if (noPrefix !== true)
    prefix += '0x';

  if (width === undefined)
    return prefix + str;

  let base = '';

  for (var i = 0; i < width; i++)
    base += '0';

  return prefix + (base + str).substr(-1 * width);
};
/**
 * バイト配列を16進数表記文字列に変換する
 */
function toHEX(num) {
  return num < 16 ? '0' + num.toString(16).toUpperCase() : num.toString(16).toUpperCase();
}
function strHEXarray(buf) {
  let hex_str = '\n';
  for (let i in buf) { 
    if ((i % 16) === 0) { hex_str += convertDecToHexString(i, 8, false) + ': '; }
    hex_str += toHEX(buf[i]) + ' ';
    if ((i % 16) === 0xF) { hex_str += '\n'; }
  }
  return hex_str;
}
export const log = {
  toHex(num) { return toHEX(num); },
  toHexarray(buf) { return strHEXarray(buf); },
  logHex(num) { console.log(toHEX(num)); },
  logHexarray(buf) { console.log(strHEXarray(buf)); },
  DecToHexString(num, width, noPrefix) {
    return convertDecToHexString(num, width, noPrefix);
  },
};

export default log;
