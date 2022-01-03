// debuggerNES.js
import log from './logger';
// 定数
// const DBG_Level = 2; // 1 is short message, 2 is long message
const DBG_Level = 1; // 1 is short message, 2 is long message
// クラス
export class DBGROM {
  constructor(nesBuffer, textarea_charROM) {
    let nesROM = rom_parse(nesBuffer);
    if (nesROM === false) {
      textarea_charROM.value = 'This file is not NES format.';
      return;
    }
    this.headerROM = nesROM.headerROM;
    this.programROM = nesROM.programROM;
    this.characterROM = nesROM.characterROM;
    // show ROM data.
    this.display_charROM(textarea_charROM);
  }
  display_charROM(textarea_charROM) {
    // console.log('nesROM : ', nesROM);
    // console.log('isHorizontalMirror : ', nesROM.isHorizontalMirror);
    // console.log(nesROM.programROM);
    console.log('headerROM:');
    log.logHexarray(this.headerROM);
    // console.log('programROM:');
    // log.log_hexarray(nesROM.programROM);
    // console.log('characterROM:');
    // log.log_hexarray(nesROM.characterROM);

    textarea_charROM.value = '';
    textarea_charROM.value += 'header : ' + log.toHexarray(this.headerROM) + '\n';
    let program_pages = this.headerROM[4];
    let charrom_pages = this.headerROM[5];
    let mapper = (((this.headerROM[6] & 0xF0) >> 4) | this.headerROM[7] & 0xF0);
    textarea_charROM.value += 'program pages = ' + log.toHex(program_pages) + '\n';
    textarea_charROM.value += 'charrom pages = ' + log.toHex(charrom_pages) + '\n';
    textarea_charROM.value += 'mapper = ' + mapper + '\n';
    if (DBG_Level >= 2) {
      textarea_charROM.value += '------------------\n';
      //
      textarea_charROM.value += this.toHEX_charrom();
      // const PROGRAM_ROM_SIZE = 0x4000;   // unit size is 16KB
      textarea_charROM.value += '------------------\n';
    }
  }
  toHEX_charrom() {
    let charrom_hex = '';
    const CHARACTOR_ROM_SIZE = 0x2000; // unit size is 8KB
    let spritesNum = CHARACTOR_ROM_SIZE * this.headerROM[5] / 16; // ROM_SIZE * NUM_char_pages / 16Byte
    if (DBG_Level <= 1) return charrom_hex;
    charrom_hex += 'CHARACTOR_ROM_DATA:\n';
    for (let i = 0; i < spritesNum; i++) {
      let chardata = this.characterROM.slice(i * 16, i * 16 + 16);
      charrom_hex += log.toHex(i) + ' : ' + log.toHexarray(chardata) + '\n';
    }
    return charrom_hex;
  }
}
function rom_parse(nesBuffer) {
  const NES_HEADER_SIZE = 0x0010;
  const PROGRAM_ROM_SIZE = 0x4000;
  const CHARACTER_ROM_SIZE = 0x2000;

  var nes = new Uint8Array(nesBuffer);
  // log.hexarray(nes);
  if ([].slice.call(nes, 0, 3).map(v => String.fromCharCode(v)).join('') !== 'NES') {
    console.log('This file is not NES format.');
    return false;
  }
  const programROMPages = nes[4];
  const characterROMPages = nes[5];
  const isHorizontalMirror = !(nes[6] & 0x01);
  const mapper = (((nes[6] & 0xF0) >> 4) | nes[7] & 0xF0);
  console.info('prom pages =', programROMPages);
  console.info('crom pages =', characterROMPages);
  console.info('mapper', mapper);
  const characterROMStart = NES_HEADER_SIZE + programROMPages * PROGRAM_ROM_SIZE;
  const characterROMEnd = characterROMStart + characterROMPages * CHARACTER_ROM_SIZE;

  // console.log('prom pages = ', programROMPages);
  const nesROM = {
    isHorizontalMirror,
    headerROM: nes.slice(0, NES_HEADER_SIZE - 1),
    programROM: nes.slice(NES_HEADER_SIZE, characterROMStart - 1),
    characterROM: nes.slice(characterROMStart, characterROMEnd - 1),
  };
  return nesROM;
}