// Mapper.js
var MAPPERS = {
  0: { 'name': 'NROM' },
  1: { 'name': 'MMC1' },
  2: { 'name': 'UNROM' },
  3: { 'name': 'CNROM' },
  4: { 'name': 'MMC3' },
  76: { 'name': 'Mapper76' },
};
class Mapper {
  constructor (rom) {
    this.isMapper = true;
    this.rom = rom;
    this.prgBankNum = rom.header_parse.prg_bank_num;
    this.chrBankNum = rom.header_parse.chr_bank_num;
    this.mapper_num = rom.header_parse.mapper_num;
    // console.log(MAPPERS);
  }
  getName() {
    return this.getMapperParam(this.mapper_num).name;
  }
  getMapperParam(number) {
    if (MAPPERS[number] === undefined)
      throw new Error('unsupport No.' + number + ' Mapper');

    return MAPPERS[number];
  }
  /**
   * Mapper0(NROM, no Mapper) only implementation
   */
  map(address) {
    // 0x8000 - 0xBFFF: First 16 KB of ROM
    // 0xC000 - 0xFFFF: Last 16 KB of ROM (NROM-256) or
    //                  mirror of 0x8000 - 0xBFFF (NROM-128).
    if (this.prgBankNum === 1 && address >= 0xC000)
      address -= 0x4000;
    return address - 0x8000;
  }
  /**
   * Maps CPU memory address 0x0000 - 0x1FFF to the offset
   * in Character segment of Rom for Character ROM access
   */
  mapForChrRom(address) {
    return address;
  }
  /**
   * In general, updates control registers in Mapper
   */
  store(address, value) {
    console.log(`Mapper.store(not work): ${value} to ${address}`)
  }
  /**
   *
   */
  getMirroringType() {
    // screen_type is : 
    //   0 : 'SINGLE_SCREEN'
    //   1 : 'HORIZONTAL'
    //   2 : 'VERTICAL'
    //   3 : 'FOUR_SCREEN'
    return this.rom.header_parse.screen_type;
  }
}
export { Mapper }