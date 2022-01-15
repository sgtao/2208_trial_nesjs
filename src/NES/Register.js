// Register.js
import { log } from './logger.js';
/**
 * General Register implementation.
 * Specific register for CPU and PPU are implemented in each class.
 */

// Register type 1 is 8bitRegister, type 2 has 16bit.
class Register {
  constructor(type) {
    if (type === 2) {
      this.isRegister16bit = true;
      this.type = 2; // 16bit Register
      this.data = new Uint16Array(1);
    } else { 
      this.isRegister8bit = true;
      this.type = 1; // 8bit Register
      this.data = new Uint8Array(1);
    }
    this.clear();
  }
  /**
   *
   */
  getWidth() {
    return this.data.byteLength * 8;
  }

  /**
   *
   */
  load() {
    return this.data[0];
  }

  /**
   *
   */
  loadBit(pos) {
    return (this.data[0] >> pos) & 1;
  }

  /**
   *
   */
  loadBits(offset, size) {
    return (this.data[0] >> offset) & ((1 << size) - 1);
  }

  /**
   *
   */
  store(value) {
    this.data[0] = value;
  }

  /**
   *
   */
  storeBit(pos, value) {
    value = value & 1;  // just in case
    this.data[0] = this.data[0] & ~(1 << pos) | (value << pos);
  }

  /**
   *
   */
  storeBits(offset, size, value) {
    var mask = (1 << size) - 1;
    value = value & mask;  // just in case
    this.data[0] = this.data[0] & ~(mask << offset) | (value << offset);
  }

  /**
   *
   */
  clear() {
    this.data[0] = 0;
  }

  /**
   *
   */
  setBit(pos) {
    this.storeBit(pos, 1);
  }

  /**
   *
   */
  clearBit(pos) {
    this.storeBit(pos, 0);
  }

  /**
   *
   */
  isBitSet(pos) {
    return this.loadBit(pos) === 1;
  }

  /**
   *
   */
  increment() {
    this.data[0]++;
  }

  /**
   *
   */
  incrementBy2() {
    this.data[0] += 2;
  }

  /**
   *
   */
  add(value) {
    this.data[0] += value;
  }

  /**
   *
   */
  decrement() {
    this.data[0]--;
  }

  /**
   *
   */
  decrementBy2() {
    this.data[0] -= 2;
  }

  /**
   *
   */
  sub(value) {
    this.data[0] -= value;
  }

  /**
   *
   */
  shift(value) {
    value = value & 1;  // just in case
    var carry = this.loadBit(this.getWidth() - 1);
    this.data[0] = (this.data[0] << 1) | value;
    return carry;
  }

  dump () {
    if (this.type === 1) {
      // log.logHex(this.data);
      return log.toHex(this.data[0]);
    } else if (this.type === 2) {
      let buffer = '';
      buffer += log.toHex((this.data[0] >> 8) & 0xFF);
      buffer += log.toHex(this.data[0] & 0xFF);
      // console.log(buffer)
      return buffer;
    } else {
      return '';
    }
  }
}
class Register8bit extends Register {
  constructor() {
    super(1);
  }
}
class Register16bit extends Register {
  constructor() {
    super(2);
  }
}
export { Register8bit, Register16bit };
