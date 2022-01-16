// Ppu.js
import { Register8bit, Register16bit } from './Register.js';
import { Memory } from './Memory.js';
class Ppu {
  constructor(nes) {
    this.isPpu = true;
    this.nes = nes;
    this.rom = null;
    this.cpu = null;
    this.display = null;  // set by .setDisplay();

    // inside memory
    this.vRam = new Memory(16 * 1024);  // 16KB
    this.oamRam = new Memory(256);      // 256B, primary OAM memory
    this.oamRam2 = new Memory(32);      // 32B, secondary OAM memory

    // CPU memory mapped registers
    this.ppuctrl = new PpuControlRegister();  // 0x2000
    this.ppumask = new PpuMaskRegister();     // 0x2001, called as PPU Control Register 2
    this.ppustatus = new PpuStatusRegister(); // 0x2002
    this.oamaddr = new Register8bit();        // 0x2003, called as SPR-RAM Address Register
    this.oamdata = new Register8bit();        // 0x2004, called as SPR-RAM I/O Register
    this.ppuscroll = new Register8bit();      // 0x2005, called as VRAM Address Register 1
    this.ppuaddr = new Register8bit();        // 0x2006, called as VRAM Address Register 2
    this.ppudata = new Register8bit();        // 0x2007, called as VRAM I/O Register
    this.oamdma = new Register8bit();         // 0x4014, called as Sprite DMA Register
  }
  SetRom(rom) {
    this.rom = rom;
  }
  SetCpu(cpu) {
    this.cpu = cpu;
  }
  SetDisplay(display) {
    this.display = display;
  }
  InitPpu() {
    console.dir(this.ppustatus);
    this.ppustatus.store(0x80);
  }

  // dump methods
  /**
   *
   */
  dump() {
    let buffer = '';
    buffer += 'PPU Ctrl: ' + this.ppuctrl.dump() + '\n';
    buffer += 'PPU Mask: ' + this.ppumask.dump() + '\n';
    buffer += 'PPU Status: ' + this.ppustatus.dump() + '\n';
    buffer += 'OAM Address: ' + this.oamaddr.dump() + '\n';
    buffer += 'OAM Data: ' + this.oamdata.dump() + '\n';
    buffer += 'PPU Scroll: ' + this.ppuscroll.dump() + '\n';
    buffer += 'PPU Addr: ' + this.ppuaddr.dump() + '\n';
    buffer += 'PPU Data: ' + this.ppudata.dump() + '\n';
    buffer += 'OAM DMA: ' + this.oamdma.dump() + '\n';
    buffer += '\n';
    return buffer;
  }
}

// PPU Registers

/**
 *
 */
class PpuControlRegister extends Register8bit {
  constructor() {
    super();
    this.isPpuControlRegister = true;
  }
}
/**
 *
 */
class PpuMaskRegister extends Register8bit {
  constructor() {
    super();
    this.isPpuMaskRegister = true;
  }
}
/**
 *
 */
class PpuStatusRegister extends Register8bit {
  constructor() {
    super();
    this.isPpuStatusRegister = true;
  }
}
export { Ppu };