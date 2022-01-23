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
    for (let i = 0, il = this.getCapacity(); i < il; i++)
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
    let buffer = '';
    let previousIsZeroLine = false;
    let offset = 0;
    let end = this.getCapacity();

    for (let i = offset; i < end; i++) {
      if (i % 0x10 == 0) {
        if (previousIsZeroLine) {
          let skipZero = false;
          while (this._checkNext16BytesIsZero(i + 0x10, end)) {
            i += 0x10;
            skipZero = true;
          }
          if (skipZero)
            buffer += '...\n';
        }
        buffer += log.DecToHexString(i - offset, 4) + ' ';
        previousIsZeroLine = true;
      }

      let value = this.load(i);
      buffer += log.DecToHexString(value, 2, true) + ' ';
      if (value != 0)
        previousIsZeroLine = false;

      if (i % 0x10 == 0xf)
        buffer += '\n';
    }
    return buffer;
  }
  /**
   *
   */
  _checkNext16BytesIsZero(offset, size) {
    if (offset + 0x10 >= size)
      return false;

    let sum = 0;
    for (let i = offset; i < offset + 0x10; i++) {
      sum += this.load(i);
    }
    return sum == 0;
  }
}
// export
export { Memory };
