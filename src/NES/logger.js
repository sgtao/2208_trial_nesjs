/* logger.js */

/**
 * バイト配列を16進数表記文字列に変換する
 */
function toHEX(num) {
  return num < 16 ? '0' + num.toString(16).toUpperCase() : num.toString(16).toUpperCase();
}
function strHEXarray(buf) {
  let hex_str = '';
  for (let i in buf) { hex_str += toHEX(buf[i]) + ' '; }
  return hex_str;
}
export const log = {
  toHex(num) { return toHEX(num); },
  toHexarray(buf) { return strHEXarray(buf); },
  logHex(num) { console.log(toHEX(num)); },
  logHexarray(buf) { console.log(strHEXarray(buf)); },
};

export default log;
