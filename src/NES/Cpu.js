// Cpu.js
class Cpu {
  constractor(nes){
    this.isCpu = true;
    this.nes = nes;
    this.rom = null;
  }
  SetRom(rom) {
    this.rom = rom;
  }
}
export { Cpu };