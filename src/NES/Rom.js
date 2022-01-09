// Rom.js
import { Memory } from './Memory.js'
class Rom {
  constructor(nes) {
    this.isRom = true;
    this.nes   = nes;
    this.data = null;
    this.header = null;
  }
  SetRom(arrayBuffer) {
    this.data = new Memory(arrayBuffer);
    console.log('SetRom data : ' + this.data.getCapacity());
    this.header = new Memory(16);
    for (let i = 0; i < 16; i++) {
      this.header.data[i] = this.data.load(i);
    }    
    return this.isValid();
  }
  isValid() {
    if ([].slice.call(this.header.data, 0, 3).map(v => String.fromCharCode(v)).join('') !== 'NES') {
      console.log('This file is not NES format.');
      return false;
    } else {
      console.log('This file is NES format.');
      return true;
    }
  }
  dump() {
    return this.data.dump();
  }
  header_dump() {
    return this.header.dump();
  }
}
export { Rom };