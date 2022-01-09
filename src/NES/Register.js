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
  clear () {
    this.data[0] = 0x0;
  }
  load() {
    return this.data[0];
  }
  store (value) {
    this.data[0] = value;
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
