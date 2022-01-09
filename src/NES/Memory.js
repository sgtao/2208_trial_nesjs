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
  loadWithoutMapping(address) {
    return this.data[address];
  }
  store(address, value) {
    this.data[address] = value;
  }
  storeWithoutMapping(address, value) {
    this.data[address] = value;
  }
  dump () {
    // log.logHexarray(this.data);
    return log.toHexarray(this.data);
  }
}
// export
export { Memory };
