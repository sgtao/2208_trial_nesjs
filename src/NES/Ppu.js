// Ppu.js
class Ppu {
  constractor(nes) {
    this.isPpu = true;
    this.nes = nes;
    this.rom = null;
  }
  SetRom(rom) {
    this.rom = rom;
  }
}
export { Ppu };