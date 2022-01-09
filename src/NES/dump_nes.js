// dump_nes.js
import log from './logger';
// 定数
const DUMP_Level = 1; // 1 is short message, 2 is long message
// const DUMP_Level = 2; // 1 is short message, 2 is long message
//
/**
 * dump methods
 */
class dump_nes {
  constructor (area) {
    this.area = area;
    this.clrMessage();
    this.putMessage('add dump console..');
  }
  putMessage(str) {
    this.area.value += str + '\n';
    this.area.scrollTop = this.area.scrollHeight;
  }
  clrMessage() {
    this.area.value = '';
  }
}
export { dump_nes };