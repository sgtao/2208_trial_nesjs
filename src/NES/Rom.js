// Rom.js
import { Memory } from './Memory.js'
import { Mapper } from './Mapper.js'
class Rom {
  constructor(nes) {
    this.isRom = true;
    this.nes   = nes;
    this.data = null;
    this.size = 0;
    this.header = null;
    this.header_parse = null;
    this.mapper = null;
  }
  SetRom(arrayBuffer) {
    this.data = new Memory(arrayBuffer);
    this.size = this.data.getCapacity();
    console.log('[Rom.SetRom] data size : ' + this.size);
    // console.dir(this.data);
    this.header = new Memory(16);
    for (let i = 0; i < 16; i++) {
      this.header.data[i] = this.data.load(i);
    }
    if (this._isNes()) {
      this.header_parse = this._ParseHeader(this.header);
      // this.mapper = new Memory(256); // temporary mapper
      this.mapper = new Mapper(this);
      console.log('Mapper Num : ' + this.header_parse.mapper_num + ' (' + this.mapper.getName() + ')');
      return true;
    } else {
      return false;
    }
  }
  _isNes() {
    if ([].slice.call(this.header.data, 0, 3).map(v => String.fromCharCode(v)).join('') !== 'NES') {
      console.error('This file is not NES format.');
      return false;
    } else {
      console.log('This file is NES format.');
      console.log(this.header);
      return true;
    }
  }
  _ParseHeader(header) {
    if (header === null) return;
    let _parse = {};
    // header size is 16B
    _parse.header_size = 0x10;
    // PRG_ROM_BANKS_NUM_ADDRESS = 0x4
    _parse.prg_bank_num = header.load(4);
    // CHR_ROM_BANKS_NUM_ADDRESS = 0x5
    _parse.chr_bank_num = header.load(5);
    // CONTROL_BYTE1_ADDRESS = 0x6, CONTROL_BYTE2_ADDRESS = 0x7
    _parse.isHorizontalMirror = (header.load(6) & 0x01) ? false : true;
    _parse.isPresenceBatteryRAM = (header.load(6) & 0x02) ? true : false;
    _parse.isPresenceTrainer = (header.load(6) & 0x04) ? true : false;
    _parse.isFourScreenMirror = (header.load(6) & 0x08) ? true : false;
    _parse.mapper_num = ((header.load(6) & 0xF0) >> 4) |
    (this.header.load(7) & 0xF0);
    // SCREEN TYPE
    _parse.screen_type = 0; // SINGLE_SCREEN
    if (_parse.isFourScreenMirror) {
      _parse.screen_type = 3; // FOUR_SCREEN
    } else if (_parse.isHorizontalMirror) {
      _parse.screen_type = 1; // HORIZONTAL
    } else {
      _parse.screen_type = 2; // VERTICAL
    }
    return _parse;
  }
  /**
   * load/store methods called by CPU.
   *
   * CPU memory address:
   * 0x0000 - 0x1FFF: Character ROM access
   * 0x8000 - 0xFFFF: Program ROM access
   *
   * To access wide range ROM data with limited CPU memory address space
   * Mapper maps CPU memory address to ROM's.
   * In general writing control registers in Mapper via .store() switches bank.
   */
  load(address) {
    let addressInRom = this.header_parse.header_size;
    if (address < 0x2000) {
      // Character ROM access
      addressInRom += this.header_parse.prg_bank_num * 0x4000;
      addressInRom += this.mapper.mapForChrRom(address);
    } else {
      // Program ROM access
      addressInRom += this.mapper.map(address);
    }
    return this.data.load(addressInRom);
  }
  /**
   * In general writing with ROM address space updates control registers in Mapper.
   */
  store(address, value) {
    this.mapper.store(address & 0xFF, value);
  }
  hasChrRom() {
    return (this.header_parse.chr_bank_num > 0);
  }
  getMirroringType() {
    return (this.header_parse.screen_type);
  }
  dump() {
    return this.data.dump();
  }
  header_dump() {
    return this.header.dump();
  }
  header_info() {
    let buffer = '';
    buffer += 'PRG-ROM banks size: ' + this.header_parse.prg_bank_num * 16+ '(KB)\n';
    buffer += 'CHR-ROM banks size: ' + this.header_parse.chr_bank_num * 8+ '(KB)\n';
    buffer += 'mapper number : ' + this.header_parse.mapper_num + '\n';
    buffer += 'screen type   : ';
    switch (this.header_parse.screen_type) {
      case 1: buffer += 'HORIZONTAL'; break;
      case 2: buffer += 'VERTICAL'; break;
      case 3: buffer += 'FOUR_SCREEN'; break;
      default: buffer += 'SINGLE_SCREEN'; break;
    }
    buffer += '\n\n';
    return buffer;
  }
}
export { Rom };