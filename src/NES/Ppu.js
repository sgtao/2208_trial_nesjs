// Ppu.js
import { Register8bit, Register16bit } from './Register.js';
import { PpuControlRegister, PpuMaskRegister, PpuStatusRegister } from './PpuRegisterPallet.js';
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
    this.ppuaddr = new Register16bit();        // 0x2006, called as VRAM Address Register 2
    this.ppudata = new Register8bit();        // 0x2007, called as VRAM I/O Register
    this.oamdma = new Register8bit();         // 0x4014, called as Sprite DMA Register

    // Name Table, Scroll, VRAM address
    this.name_table_baddr = 0;
    this.ppuscroll_horizontal = 0;
    this.ppuscroll_vertical   = 0;
    this.ppuscroll_1st_access = true;
    this.ppuaddr_1st_access = true;
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
    // console.dir(this.ppustatus);
    this.ppustatus.store(0x80);
  }

  // load/store register from Cpu
  /**
   * 0x2000 - 0x2007: PPU registers
   * 0x4014         : Sprite DMA Register
   * load register from Cpu
   */
  loadRegister(address) {
    let value;
    switch (address) {
      // ppucontrol, ppumask is write only, so return 0
      case 0x2000:
      case 0x2001:
        return 0;

      // ppustatus load
      case 0x2002:
        value = this.ppustatus.load();
        // this.ppustatus.clearVBlank();
        // this.registerFirstStore = true;
        return value;

      // oamaddr is write only, so return 0
      case 0x2003:
        return 0;

      // oamdata load
      case 0x2004:
        return this.oamRam.load(this.oamaddr.load());

      // ppuscroll, ppuaddr is write only, so return 0
      case 0x2005:
      case 0x2006:
        return 0;

      // ppudata load
      // temporary implement
      case 0x2007:
        value = this.vRam.load(this.ppuaddr.data);
        this.ppuaddr.increment();
        return value;
    }

    return 0;
  }
  /**
   * 0x2000 - 0x2007: PPU registers
   * 0x4014         : Sprite DMA Register
   * store register from Cpu
   */
  storeRegister(address, value) {
    switch (address) {

      // ppuctrl store
      case 0x2000: {
        this.ppuctrl.store(value);
        let _baseaddr = 0x2000;
        let _offset   = (value & 0x3) << 0x400;
        this.name_table_baddr = _baseaddr + _offset;
        break;
      }
      // ppumask store
      case 0x2001:
        this.ppumask.store(value);
        break;

      // oamaddr store
      case 0x2003:
        this.oamaddr.store(value);
        break;

      // oamdata store
      case 0x2004:
        this.oamdata.store(value);
        break;

      // ppuscroll store

      case 0x2005:
        this.ppuscroll.store(value);
        if (this.ppuscroll_1st_access)
          this.ppuscroll_horizontal = value;
        else
          this.ppuscroll_vertical = value;
        this.ppuscroll_1st_access = ~this.ppuscroll_1st_access;
        break;

      // ppuaddr store
      case 0x2006: {
        let _temp_ppu_addr = 0;
        if (this.ppuaddr_1st_access)
          _temp_ppu_addr = (this.ppuaddr.data & 0x00FF) | ((value & 0xFF) << 8);
        else
          _temp_ppu_addr = (this.ppuaddr.data & 0x00FF) | (value & 0xFF);
        this.ppuaddr.store(_temp_ppu_addr);
        this.ppuaddr_1st_access = ~this.ppuaddr_1st_access;
        break;
      }
      // ppudata store
      case 0x2007:
        this.ppudata.store(value);
        this.vRam.store(this.ppuaddr.data, value);
        this.ppuaddr.increment();
        break;

      // oamdma store

      case 0x4014:
        this.oamdma.store(value);
        break;
    }
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

export { Ppu };