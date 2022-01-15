// Cpu.js
import { Register8bit, Register16bit } from './Register.js';
import { Memory } from './Memory.js';
import { CPU_INTERRUPTS, CPU_OPS } from './CpuOpcodes.js';
class Cpu {
  constructor(nes){
    this.isCpu = true;
    this.nes = nes;
    this.rom = null;
    // registers
    this.pc = new Register16bit();
    this.sp = new Register8bit();
    this.a = new Register8bit();
    this.x = new Register8bit();
    this.y = new Register8bit();
    this.p = new CpuStatusRegister();
    // RAM inside CPU
    this.ram = new Memory(2 * 1024);  // 2KB
  }
  SetRom(rom) {
    this.rom = rom;
  }
  InitCpu() {
    this.p.store(0x34);
    this.a.clear();
    this.x.clear();
    this.y.clear();
    this.sp.store(0xFD);
    this.ram.clear();
  }
  /**
   *
   */
  runCycle() {
    if (this.isStall() !== true) {
      let opc = this.fetch();
      let op = this.decode(opc);

      this.operate(op, opc);
      this.stallCycle = op.cycle;
    }

    this.stallCycle--;
  }
  isStall() {
    return this.stallCycle > 0;
  }
  // load/store methods

  /**
   *
   */
  load(address) {
    address = address & 0xFFFF;  // just in case

    // 0x0000 - 0x07FF: 2KB internal RAM
    // 0x0800 - 0x1FFF: Mirrors of 0x0000 - 0x07FF (repeats every 0x800 bytes)

    if (address >= 0 && address < 0x2000)
      return this.ram.load(address & 0x07FF);

    // 0x2000 - 0x2007: PPU registers
    // 0x2008 - 0x3FFF: Mirrors of 0x2000 - 0x2007 (repeats every 8 bytes)

    // if (address >= 0x2000 && address < 0x4000)
    //   return this.ppu.loadRegister(address & 0x2007);

    // 0x4000 - 0x4017: APU, PPU and I/O registers
    // 0x4018 - 0x401F: APU and I/O functionality that is normally disabled
    // if (address >= 0x4000 && address < 0x4014)
    //   return this.apu.loadRegister(address);

    // if (address === 0x4014)
    //   return this.ppu.loadRegister(address);

    // if (address === 0x4015)
    //   return this.apu.loadRegister(address);

    // if (address === 0x4016)
    //   return this.pad1.loadRegister();

    // if (address >= 0x4017 && address < 0x4020)
    //   return this.apu.loadRegister(address);


    // cartridge space
    // if (address >= 0x4020 && address < 0x6000)
    //   return this.ram.load(address);

    // 0x6000 - 0x7FFF: Battery Backed Save or Work RAM
    // if (address >= 0x6000 && address < 0x8000)
    //   return this.ram.load(address);

    // 0x8000 - 0xFFFF: ROM
    if (address >= 0x8000 && address < 0x10000)
      return this.rom.load(address);

    // when access blank addresses, return all-1.
    return 0x00;
  }
  store(addr, value) {
    let address = addr & 0xFFFF;

    // 0x0000 - 0x07FF: 2KB internal RAM
    // 0x0800 - 0x1FFF: Mirrors of 0x0000 - 0x07FF (repeats every 0x800 bytes)

    if (address >= 0 && address < 0x2000)
      return this.ram.store(address & 0x7FF, value);

    // 0x2000 - 0x2007: PPU registers
    // 0x2008 - 0x3FFF: Mirrors of 0x2000 - 0x2007 (repeats every 8 bytes)
    // if (address >= 0x2000 && address < 0x4000)
    //   return this.ppu.storeRegister(address & 0x2007, value);


    // 0x4000 - 0x4017: APU, PPU and I/O registers
    // 0x4018 - 0x401F: APU and I/O functionality that is normally disabled
    // if (address >= 0x4000 && address < 0x4014)
    //   return this.apu.storeRegister(address, value);

    // if (address === 0x4014)
    //   return this.ppu.storeRegister(address, value);

    // if (address === 0x4015)
    //   return this.apu.storeRegister(address, value);

    // if (address === 0x4016)
    //   return this.pad1.storeRegister(value);

    // if (address >= 0x4017 && address < 0x4020)
    //   return this.apu.storeRegister(address, value);


    // cartridge space
    // if (address >= 0x4020 && address < 0x6000)
    //   return this.ram.store(address, value);


    // 0x6000 - 0x7FFF: Battery Backed Save or Work RAM
    // if (address >= 0x6000 && address < 0x8000)
    //   return this.ram.store(address, value);

    // 0x8000 - 0xFFFF: ROM
    // if (address >= 0x8000 && address < 0x10000)
    return;
  }

  // processing methods
  /**
   *
   */
  fetch() {
    let opc = this.load(this.pc.load());
    this.pc.increment();
    return opc;
  }

  // dump methods
  /**
   *
   */
  dump() {
    let buffer = '- cpu - ';
    // let opc = this.load(this.pc.load());
    // let op = this.decode(opc);
    buffer += 'p:' + this.p.Status_dump() + ' ';
    buffer += 'pc:' + this.pc.dump() + ' ';
    buffer += 'sp:' + this.sp.dump() + ' ';
    buffer += 'a:' + this.a.dump() + ' ';
    buffer += 'x:' + this.x.dump() + ' ';
    buffer += 'y:' + this.y.dump() + ' ';
    buffer += '\n\n';
    return buffer;

  }
  dump_memory_map() {
    let cpu_memory = new Memory(0x10000); // 64KB
    for (let i = 0; i < 0x10000; i++) {
      cpu_memory.store(i,this.load(i));
    }
    return cpu_memory.dump();
  }
}
class CpuStatusRegister extends Register8bit {
  constructor () {
    super();
    this.isCpuStatusRegister = true;
  }
  Status_dump() {
    let buffer = '';
    buffer += this.dump();
    return buffer;
  }
}
export { Cpu };