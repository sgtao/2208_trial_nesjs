// Cpu.js
import { Register8bit, Register16bit } from './Register.js';
import { Memory } from './Memory.js';
import { CPU_INTS, CPU_OPS } from './CpuOpcodes.js';
import { log } from './logger.js';
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
    console.dir(this.p);
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

    // interrupt reset
    this.interrupt(CPU_INTS.RESET)
  }
  /**
   *
   */
  runCycle() {
    if (this.isStall() !== true) {
      let opc = this.fetch();
      let op = this.decode(opc);
      // console.dir(op);
      console.log(this.dump() + ' op=' + this.dump_cpu_op(op, opc));
      this.operate(op, opc);
      this.stallCycle = op.cycle;
    }

    this.stallCycle--;
  }
  isStall() {
    return this.stallCycle > 0;
  }

  // interrupt method
  /**
   *  temporary implements
   */
  interrupt(int_obj) {
    // console.log(int_obj);
    this.jumpToInterruptHandler(int_obj);
  }  
  /**
   *
   */
  jumpToInterruptHandler(int_obj) {
    this.pc.store(this.load2Bytes(int_obj.addr));
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
  /**
   *
   */
  load2Bytes(address) {
    return this.load(address) | (this.load(address + 1) << 8);
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
  /**
   *
   */
  decode(opc) {
    return CPU_OPS[opc];
  }
  /**
   *
   */
  operate(op, opc) {
    return;
  }
  // dump methods
  /**
   *
   */
  dump() {
    let buffer = '- cpu - ';
    // let opc = this.load(this.pc.load());
    // let op = this.decode(opc);
    buffer += 'p:' + this.p.dump() + ' ';
    buffer += 'pc:' + this.pc.dump() + ' ';
    buffer += 'sp:' + this.sp.dump() + ' ';
    buffer += 'a:' + this.a.dump() + ' ';
    buffer += 'x:' + this.x.dump() + ' ';
    buffer += 'y:' + this.y.dump() + ' ';
    // buffer += '\n\n';
    return buffer;

  }
  dump_cpu_op(op, opc) {
    let buffer = '(0x' + log.toHex(opc) + '): ';
    buffer += op.instruction.name + ' ';
    if (op.mode != null )
      buffer += op.mode.name;
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
  constructor() {
    super();
    this.isCpuStatusRegister = true;
    this.N_BIT= 7;
    this.V_BIT= 6;
    this.A_BIT= 5;  // unused bit. A is random name
    this.B_BIT= 4;
    this.D_BIT= 3;
    this.I_BIT= 2;
    this.Z_BIT= 1;
    this.C_BIT= 0;
  }
  isN() {
    return this.isBitSet(this.N_BIT);
  }

  setN() {
    this.setBit(this.N_BIT);
  }

  clearN() {
    this.clearBit(this.N_BIT);
  }

  isV() {
    return this.isBitSet(this.V_BIT);
  }

  setV() {
    this.setBit(this.V_BIT);
  }

  clearV() {
    this.clearBit(this.V_BIT);
  }

  isA() {
    return this.IsBitSet(this.A_BIT);
  }

  setA() {
    this.setBit(this.A_BIT);
  }

  clearA() {
    this.clearBit(this.A_BIT);
  }

  isB() {
    return this.isBitSet(this.B_BIT);
  }

  setB() {
    this.setBit(this.B_BIT);
  }

  clearB() {
    this.clearBit(this.B_BIT);
  }

  isD() {
    return this.isBitSet(this.D_BIT);
  }

  setD() {
    this.setBit(this.D_BIT);
  }

  clearD() {
    this.clearBit(this.D_BIT);
  }

  isI() {
    return this.isBitSet(this.I_BIT);
  }

  setI() {
    this.setBit(this.I_BIT);
  }

  clearI() {
    this.clearBit(this.I_BIT);
  }

  isZ() {
    return this.isBitSet(this.Z_BIT);
  }

  setZ() {
    this.setBit(this.Z_BIT);
  }

  clearZ() {
    this.clearBit(this.Z_BIT);
  }

  isC() {
    return this.isBitSet(this.C_BIT);
  }

  setC() {
    this.setBit(this.C_BIT);
  }

  clearC() {
    this.clearBit(this.C_BIT);
  }

  // dump

  dump() {
    var buffer = '';
    buffer += Register8bit.prototype.dump.call(this);
    buffer += '(';
    buffer += this.isN() ? 'N' : '-';
    buffer += this.isV() ? 'V' : '-';
    buffer += this.isB() ? 'B' : '-';
    buffer += this.isD() ? 'D' : '-';
    buffer += this.isI() ? 'I' : '-';
    buffer += this.isZ() ? 'Z' : '-';
    buffer += this.isC() ? 'C' : '-';
    buffer += ')';
    return buffer;
  }

}
export { Cpu };