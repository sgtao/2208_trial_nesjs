// Ppu.js
import { Register8bit, Register16bit } from './Register.js';
import { PALETTES, PpuControlRegister, PpuMaskRegister, PpuStatusRegister } from './PpuRegisterPalette.js';
import { Memory } from './Memory.js';
class Ppu {
  constructor(nes) {
    this.isPpu = true;
    this.nes = nes;
    this.rom = null;
    this.cpu = null;
    this.display = null;  // set by .setDisplay();

    this.frame = 0;
    this.scanLine = 0;
    this.cycle = 0;
    this.PALETTES = PALETTES;
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
    // inside shift registers

    this.nameTableRegister = new Register8bit();
    this.attributeTableLowRegister = new Register16bit();
    this.attributeTableHighRegister = new Register16bit();
    this.patternTableLowRegister = new Register16bit();
    this.patternTableHighRegister = new Register16bit();

    // inside latches

    this.nameTableLatch = 0;
    this.attributeTableLowLatch = 0;
    this.attributeTableHighLatch = 0;
    this.patternTableLowLatch = 0;
    this.patternTableHighLatch = 0

    //
    this.fineXScroll = 0;
    this.currentVRamAddress = 0;
    this.temporalVRamAddress = 0;

    //

    this.vRamReadBuffer = 0;
    this.registerFirstStore = true;

    // sprites
    // this.spritesManager = new SpritesManager(this.oamRam);
    // this.spritesManager2 = new SpritesManager(this.oamRam2);

    // for one scan line

    this.spritePixels = [];
    this.spriteIds = [];
    this.spritePriorities = [];

    for (var i = 0; i < 256; i++) {
      this.spritePixels[i] = -1;
      this.spriteIds[i] = -1;
      this.spritePriorities[i] = -1;
    }


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
  /**
   *
   */
  runCycle() {
    this.renderPixel();
    // this.shiftRegisters();
    // this.fetch();
    // this.evaluateSprites();
    this.updateFlags();
    // this.countUpScrollCounters();
    this.countUpCycle();
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
        this.ppustatus.clearVBlank();
        this.registerFirstStore = true;
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

  /**
   * load/store inside Ppu
   */
  // load from Ppu memory map
  load(address) {
    address = address & 0x3FFF;  // just in case

    // 0x0000 - 0x1FFF is mapped with cartridge's CHR-ROM if it exists

    if (address < 0x2000 && this.rom.hasChrRom() === true)
      return this.rom.load(address);

    // 0x0000 - 0x0FFF: pattern table 0
    // 0x1000 - 0x1FFF: pattern table 1
    // 0x2000 - 0x23FF: nametable 0
    // 0x2400 - 0x27FF: nametable 1
    // 0x2800 - 0x2BFF: nametable 2
    // 0x2C00 - 0x2FFF: nametable 3
    // 0x3000 - 0x3EFF: Mirrors of 0x2000 - 0x2EFF
    // 0x3F00 - 0x3F1F: Palette RAM indices
    // 0x3F20 - 0x3FFF: Mirrors of 0x3F00 - 0x3F1F

    if (address >= 0x2000 && address < 0x3F00)
      return this.vRam.load(this.getNameTableAddressWithMirroring(address & 0x2FFF));

    if (address >= 0x3F00 && address < 0x4000)
      address = address & 0x3F1F;

    // Addresses for palette
    // 0x3F10/0x3F14/0x3F18/0x3F1C are mirrors of
    // 0x3F00/0x3F04/0x3F08/0x3F0C.

    if (address === 0x3F10)
      address = 0x3F00;

    if (address === 0x3F14)
      address = 0x3F04;

    if (address === 0x3F18)
      address = 0x3F08;

    if (address === 0x3F1C)
      address = 0x3F0C;

    return this.vRam.load(address);
  }
  //
  // store to Ppu memory map
  store(address, value) {
    address = address & 0x3FFF;  // just in case

    // 0x0000 - 0x1FFF is mapped with cartridge's CHR-ROM if it exists

    if (address < 0x2000 && this.rom.hasChrRom() === true) {
      this.rom.store(address, value);
      return;
    }

    // 0x0000 - 0x0FFF: pattern table 0
    // 0x1000 - 0x1FFF: pattern table 1
    // 0x2000 - 0x23FF: nametable 0
    // 0x2400 - 0x27FF: nametable 1
    // 0x2800 - 0x2BFF: nametable 2
    // 0x2C00 - 0x2FFF: nametable 3
    // 0x3000 - 0x3EFF: Mirrors of 0x2000 - 0x2EFF
    // 0x3F00 - 0x3F1F: Palette RAM indices
    // 0x3F20 - 0x3FFF: Mirrors of 0x3F00 - 0x3F1F

    if (address >= 0x2000 && address < 0x3F00) {
      this.vRam.store(this.getNameTableAddressWithMirroring(address & 0x2FFF), value);
      return;
    }

    if (address >= 0x3F00 && address < 0x4000)
      address = address & 0x3F1F;

    // Addresses for palette
    // 0x3F10/0x3F14/0x3F18/0x3F1C are mirrors of
    // 0x3F00/0x3F04/0x3F08/0x3F0C.

    if (address === 0x3F10)
      address = 0x3F00;

    if (address === 0x3F14)
      address = 0x3F04;

    if (address === 0x3F18)
      address = 0x3F08;

    if (address === 0x3F1C)
      address = 0x3F0C;

    return this.vRam.store(address, value);
  }
  // private methods for load and store
  getNameTableAddressWithMirroring(address) {
    address = address & 0x2FFF;  // just in case

    var baseAddress = 0;

    switch (this.rom.getMirroringType()) {
      case 0: // MIRRORINGS.SINGLE_SCREEN:
        baseAddress = 0x2000;
        break;

      case 1: // MIRRORINGS.HORIZONTAL:
        if (address >= 0x2000 && address < 0x2400)
          baseAddress = 0x2000;
        else if (address >= 0x2400 && address < 0x2800)
          baseAddress = 0x2000;
        else if (address >= 0x2800 && address < 0x2C00)
          baseAddress = 0x2400;
        else
          baseAddress = 0x2400;

        break;

      case 2: // MIRRORINGS.VERTICAL:
        if (address >= 0x2000 && address < 0x2400)
          baseAddress = 0x2000;
        else if (address >= 0x2400 && address < 0x2800)
          baseAddress = 0x2400;
        else if (address >= 0x2800 && address < 0x2C00)
          baseAddress = 0x2000;
        else
          baseAddress = 0x2400;

        break;

      case 3: // MIRRORINGS.FOUR_SCREEN:
        if (address >= 0x2000 && address < 0x2400)
          baseAddress = 0x2000;
        else if (address >= 0x2400 && address < 0x2800)
          baseAddress = 0x2400;
        else if (address >= 0x2800 && address < 0x2C00)
          baseAddress = 0x2800;
        else
          baseAddress = 0x2C00;

        break;
    }

    return baseAddress | (address & 0x3FF);
  }
  /**
   * render display
   */
  renderPixel() {
    // Note: this comparison order is for performance.
    if (this.cycle >= 257 || this.scanLine >= 240 || this.cycle === 0)
      return;

    let x = this.cycle - 1;
    let y = this.scanLine;

    let backgroundVisible = this.ppumask.isBackgroundVisible();
    let spritesVisible = this.ppumask.isSpritesVisible();

    let backgroundPixel = this.getBackgroundPixel();
    let spritePixel = this.spritePixels[x];
    let spriteId = this.spriteIds[x];
    let spritePriority = this.spritePriorities[x];

    let c = this.PALETTES[this.load(0x3F00)];

    // TODO: fix me

    if (backgroundVisible === true && spritesVisible === true) {
      if (spritePixel === -1) {
        c = backgroundPixel;
      } else {
        if (backgroundPixel === c)
          c = spritePixel
        else
          c = spritePriority === 0 ? spritePixel : backgroundPixel;
      }
    } else if (backgroundVisible === true && spritesVisible === false) {
      c = backgroundPixel;
    } else if (backgroundVisible === false && spritesVisible === true) {
      if (spritePixel !== -1)
        c = spritePixel;
    }

    // TODO: fix me

    if (this.ppumask.emphasisRed() === true)
      c = c | 0x00FF0000;
    if (this.ppumask.emphasisGreen() === true)
      c = c | 0x0000FF00;
    if (this.ppumask.emphasisBlue() === true)
      c = c | 0x000000FF;

    // TODO: fix me

    if (backgroundVisible === true && spritesVisible === true &&
      spriteId === 0 && spritePixel !== 0 && backgroundPixel !== 0)
      this.ppustatus.setZeroHit();

    this.display.renderPixel(x, y, c);
  }

  /**
   *
   */
  getBackgroundPixel() {
    let offset = 15 - this.fineXScroll;

    let lsb = (this.patternTableHighRegister.loadBit(offset) << 1) |
      this.patternTableLowRegister.loadBit(offset);
    let msb = (this.attributeTableHighRegister.loadBit(offset) << 1) |
      this.attributeTableLowRegister.loadBit(offset);
    let index = (msb << 2) | lsb;

    // TODO: fix me

    if (this.ppumask.isGreyscale() === true)
      index = index & 0x30;

    return this.PALETTES[this.load(0x3F00 + index)];
  }


  /**
   *
   */
  updateFlags() {
    if (this.cycle === 1) {
      if (this.scanLine === 241) {
        this.ppustatus.setVBlank();
        this.display.updateScreen();

        //if(this.ppuctrl.enabledNmi() === true)
        //  this.cpu.interrupt(this.cpu.INTERRUPTS.NMI);
      } else if (this.scanLine === 261) {
        this.ppustatus.clearVBlank();
        this.ppustatus.clearZeroHit();
        this.ppustatus.clearOverflow();
      }
    }

    if (this.cycle === 10) {
      if (this.scanLine === 241) {
        if (this.ppuctrl.enabledNmi() === true)
          this.cpu.interrupt(this.cpu.INTERRUPTS.NMI);
      }
    }

    // @TODO: check this driving IRQ counter for MMC3Mapper timing is correct

    if (this.rom.mapper.isMMC3Mapper === true) {
      if (this.cycle === 340 && this.scanLine <= 240 &&
        this.ppumask.isBackgroundVisible() === true &&
        this.ppumask.isSpritesVisible() === true)
        this.rom.mapper.driveIrqCounter(this.cpu);
    }
  }

  /**
   * countUp cycle and scanLine
   * cycle:    0 - 340
   * scanLine: 0 - 261
   */
  countUpCycle() {
    this.cycle++;

    if (this.cycle > 340) {
      this.cycle = 0;
      this.scanLine++;

      if (this.scanLine > 261) {
        this.scanLine = 0;
        this.frame++;
      }
    }
  }

  /**
   * dump methods
   */
  // dump Ppu registers
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
  dump_ppu_memory() {
    let ppu_memory = new Memory(0x4000); // 16KB
    for (let i = 0; i < 0x4000; i++) {
      ppu_memory.store(i, this.load(i));
    }
    return ppu_memory.dump();
  }
}

export { Ppu };