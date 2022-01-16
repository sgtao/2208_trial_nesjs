// Memory.js
import { log } from './logger.js';
/**
 * Generic 8bit-word Memory.
 */
/**
 * @param {ArrayBuffer|integer} arrayBuffer -
 */
class Memory {
  constructor(arrayBuffer) {
    this.isMemory = true;
    // console.dir(arrayBuffer);
    this.data = new Uint8Array(arrayBuffer);
  }
  /**
   *  class methods
   */
  clear(){
    for (var i = 0, il = this.getCapacity(); i < il; i++)
      this.storeWithoutMapping(i, 0);
  }
  getCapacity() {
    return this.data.byteLength;
  }
  load(address) {
    return this.data[address];
  }
  load2Byte(address) {
    return (this.data[address+1] << 8 ) | (this.data[address]);
  }
  loadWithoutMapping(address) {
    return this.data[address];
  }
  store(address, value) {
    if (address > this.getCapacity()) return false;
    this.data[address] = value;
    return true;
  }
  storeWithoutMapping(address, value) {
    this.data[address] = value;
  }
  dump () {
    // log.logHexarray(this.data);
    // return log.toHexarray(this.data);
    let buffer = '';
    // let previousIsZeroLine = false;
    let offset = 0;
    let end = this.getCapacity();
    for (let i = offset; i < end; i++) {
      if (i % 0x10 === 0) {
        buffer += log.DecToHexString(i - offset, 4) + ' ';
      }
      let value = this.load(i);
      buffer += log.DecToHexString(value, 2, true) + ' ';
      if (i % 0x10 === 0xf)
        buffer += '\n';
    }
    return buffer;
  }
}
// export
export { Memory };
