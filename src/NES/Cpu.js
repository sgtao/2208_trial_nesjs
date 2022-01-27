// Cpu.js
import { Register8bit, Register16bit } from './Register.js';
import { Memory } from './Memory.js';
import { CPU_INTS, CPU_ADDRESSINGS, CPU_INSTRUCTIONS, CPU_OPS } from './CpuOpcodes.js';
import { log } from './logger.js';
class Cpu {
  constructor(nes){
    this.isCpu = true;
    this.nes = nes;
    this.rom = null;
    this.ppu = null;
    // registers
    this.pc = new Register16bit();
    this.sp = new Register8bit();
    this.a = new Register8bit();
    this.x = new Register8bit();
    this.y = new Register8bit();
    this.p = new CpuStatusRegister();
    // RAM inside CPU
    this.ram = new Memory(2 * 1024);  // 2KB
    // Debug flag
    this.dbg_message = true;
  }
  SetRom(rom) {
    this.rom = rom;
  }
  SetPpu(ppu) {
    this.ppu = ppu;
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
      this.operate(op, opc);
      this.stallCycle = op.cycle;
      if (this.dbg_message)
        console.log(this.dump());
    }
    this.stallCycle--;
  }
  isStall() {
    return this.stallCycle > 0;
  }

  // interrupt method
  interrupt(cpu_int) {
    // console.log(cpu_int);
    switch (cpu_int.id) {
      case CPU_INTS.NMI.id:
        this.pushStack2Bytes(this.pc.load());
        this.pushStack(this.p.load());
        this.p.setI();
        this.p.clearB();
        break;
      case CPU_INTS.RESET.id:
        this.p.setI();
        break;
      case CPU_INTS.IRQ.id:
        if (this.p.isI() === true) {
          return;
        }
        this.pushStack2Bytes(this.pc.load());
        this.pushStack(this.p.load());
        this.p.setI();
        this.p.clearB();
        break;
      case CPU_INTS.BRK.id:
        this.pushStack2Bytes(this.pc.load());
        this.pushStack(this.p.load());
        this.p.setI();
        this.p.setB();
        break;
      default:
        console.error('Cpu.interrupt is invalid id:' + cpu_int.id);
        return;
    }
    // jump to InterruptHandler
    this.pc.store(this.load2Bytes(cpu_int.addr));
  }  

  /**
   * load/store methods
   */
  load(address) {
    address = address & 0xFFFF;  // just in case

    // 0x0000 - 0x07FF: 2KB internal RAM
    // 0x0800 - 0x1FFF: Mirrors of 0x0000 - 0x07FF (repeats every 0x800 bytes)
    if (address >= 0 && address < 0x2000)
      return this.ram.load(address & 0x07FF);

    // 0x2000 - 0x2007: PPU registers
    // 0x2008 - 0x3FFF: Mirrors of 0x2000 - 0x2007 (repeats every 8 bytes)
    if (address >= 0x2000 && address < 0x4000)
      return this.ppu.loadRegister(address & 0x2007);

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
    if (address >= 0x2000 && address < 0x4000)
      return this.ppu.storeRegister(address & 0x2007, value);

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
   * temporary 
   */
  operate(op, opc) {
    let address = 0;
    if (op.instruction.id !== CPU_INSTRUCTIONS.INV.id) {
      address = this.getAddressWithAddressingMode(op);
    }
    switch (op.instruction.id) {
      case CPU_INSTRUCTIONS.INV.id: // Invalid op , temporary skip
        console.error('invalid operand')
        break;
      // Load and Store Instructions
      case CPU_INSTRUCTIONS.LDA.id:
        this.opLDA(address); 
        break;
      case CPU_INSTRUCTIONS.LDX.id:
        this.opLDX(address); 
        break;
      case CPU_INSTRUCTIONS.LDY.id:
        this.opLDY(address); 
        break;
      case CPU_INSTRUCTIONS.STA.id:
        this.opSTA(address); 
        break;
      case CPU_INSTRUCTIONS.STX.id:
        this.opSTX(address); 
        break;
      case CPU_INSTRUCTIONS.STY.id:
        this.opSTY(address); 
        break;
      // Transfer Instructions
      case CPU_INSTRUCTIONS.TAX.id:
        this.opTAX(); 
        break;
      case CPU_INSTRUCTIONS.TAY.id:
        this.opTAY(); 
        break;
      case CPU_INSTRUCTIONS.TSX.id:
        this.opTSX(); 
        break;
      case CPU_INSTRUCTIONS.TXA.id:
        this.opTXA(); 
        break;
      case CPU_INSTRUCTIONS.TXS.id:
        this.opTXS(); 
        break;
      case CPU_INSTRUCTIONS.TYA.id:
        this.opTYA(); 
        break;
      // Arithmetic/Logical/etc. Instructions
      case CPU_INSTRUCTIONS.ADC.id:
        this.opADC(address); 
        break;
      case CPU_INSTRUCTIONS.AND.id:
        this.opAND(address); 
        break;
      case CPU_INSTRUCTIONS.ASL.id:
        if (op.mode.id == CPU_ADDRESSINGS.ACCUMULATOR.id)
          this.a.store(this.opASL_Sub(this.a.load()));
        else
          this.opASL(address); 
        break;
      case CPU_INSTRUCTIONS.BIT.id:
        this.opBIT(address);
        break;
      case CPU_INSTRUCTIONS.CMP.id:
        this.opCMP(address, this.a.load());
        break;
      case CPU_INSTRUCTIONS.CPX.id:
        this.opCMP(address, this.x.load());
        break;
      case CPU_INSTRUCTIONS.CPY.id:
        this.opCMP(address, this.y.load());
        break;
      case CPU_INSTRUCTIONS.DEC.id:
        this.opDEC(address);
        break;
      case CPU_INSTRUCTIONS.DEX.id:
        this.x.store(this.opDEC_Sub(this.x.load()));
        break;
      case CPU_INSTRUCTIONS.DEY.id:
        this.y.store(this.opDEC_Sub(this.y.load()));
        break;
      case CPU_INSTRUCTIONS.EOR.id:
        this.opEOR(address);
        break;
      case CPU_INSTRUCTIONS.INC.id:
        this.opINC(address);
        break;
      case CPU_INSTRUCTIONS.INX.id:
        this.x.store(this.opINC_Sub(this.x.load()));
        break;
      case CPU_INSTRUCTIONS.INY.id:
        this.y.store(this.opINC_Sub(this.y.load()));
        break;
      case CPU_INSTRUCTIONS.LSR.id:
        if (op.mode.id == CPU_ADDRESSINGS.ACCUMULATOR.id)
          this.a.store(this.opLSR_Sub(this.a.load()));
        else
          this.opLSR(address);
        break;
      case CPU_INSTRUCTIONS.ORA.id:
        this.opORA(address);
        break;
      case CPU_INSTRUCTIONS.ROL.id:
        if (op.mode.id == CPU_ADDRESSINGS.ACCUMULATOR.id)
          this.a.store(this.opROL_Sub(this.a.load()));
        else
          this.opROL(address);
        break;
      case CPU_INSTRUCTIONS.ROR.id:
        if (op.mode.id == CPU_ADDRESSINGS.ACCUMULATOR.id)
          this.a.store(this.opRROR_Sub(this.a.load()));
        else
          this.opROR(address);
        break;
      case CPU_INSTRUCTIONS.SBC.id:
        this.opSBC(address);
        break;
      // Stack Instructions
      case CPU_INSTRUCTIONS.PHA.id:
        this.opPHA();
        break;
      case CPU_INSTRUCTIONS.PHP.id:
        this.opPHP();
        break;
      case CPU_INSTRUCTIONS.PLA.id:
        this.opPLA();
        break;
      case CPU_INSTRUCTIONS.PLP.id:
        this.opPLP();
        break;
      // Jump/Subroutine Instructions
      case CPU_INSTRUCTIONS.JMP.id:
        this.opJMP(address);
        break;
      case CPU_INSTRUCTIONS.JSR.id:
        this.opJSR(address);
        break;
      case CPU_INSTRUCTIONS.RTS.id:
        this.opRTS();
        break;
      case CPU_INSTRUCTIONS.RTI.id:
        this.opRTI();
        break;
      // Branch Instructions
      case CPU_INSTRUCTIONS.BCC.id:
        this.opBranch(address, !this.p.isC());
        break;
      case CPU_INSTRUCTIONS.BCS.id:
        this.opBranch(address, this.p.isC());
        break;
      case CPU_INSTRUCTIONS.BEQ.id:
        this.opBranch(address, this.p.isZ());
        break;
      case CPU_INSTRUCTIONS.BMI.id:
        this.opBranch(address, this.p.isN());
        break;
      case CPU_INSTRUCTIONS.BNE.id:
        this.opBranch(address, !this.p.isZ());
        break;
      case CPU_INSTRUCTIONS.BPL.id:
        this.opBranch(address, !this.p.isN());
        break;
      case CPU_INSTRUCTIONS.BVC.id:
        this.opBranch(address, !this.p.isV());
        break;
      case CPU_INSTRUCTIONS.BVS.id:
        this.opBranch(address, this.p.isV());
        break;
      // Set and Clear Instructions
      case CPU_INSTRUCTIONS.CLC.id:
        this.p.clearC();
        break;
      case CPU_INSTRUCTIONS.CLD.id:
        this.p.clearD();
        break;
      case CPU_INSTRUCTIONS.CLI.id:
        this.p.clearI();
        break;
      case CPU_INSTRUCTIONS.CLV.id:
        this.p.clearV();
        break;
      case CPU_INSTRUCTIONS.SEC.id:
        this.p.setC();
        break;
      case CPU_INSTRUCTIONS.SED.id:
        this.p.setD();
        break;
      case CPU_INSTRUCTIONS.SEI.id:
        this.p.setI();
        break;
      // Other Instructions
      case CPU_INSTRUCTIONS.BRK.id:
        this.opBRK();
        break;
      case CPU_INSTRUCTIONS.NOP.id:
        break;
      //
      // not implemented oprands
      default: 
        // temporary skip.
        console.error('Cpu.operand is not implemented yet');
        // throw new Error('Cpu.operate: Invalid instruction, pc=' + Utility.convertDecToHexString(this.pc.load() - 1) + ' opc=' + Utility.convertDecToHexString(opc, 2) + ' name=' + op.instruction.name);
        break;
    }
    return opc; // temporary return
  }

  /**
   * NES CPU アドレッシングモード 
   */
  // get Address Interface
  getAddressWithAddressingMode (op) {
    let address;
    // get address
    switch (op.mode.id) {
      case CPU_ADDRESSINGS.IMMEDIATE.id: {
        address = this.getAddressImmediate();
        break;
      }
      case CPU_ADDRESSINGS.ABSOLUTE.id: {
        address = this.getAddressAbsolute();
        break;
      }
      case CPU_ADDRESSINGS.INDEXED_ABSOLUTE_X.id: {
        address = this.getAddressAbsoluteX();
        break;
      }
      case CPU_ADDRESSINGS.INDEXED_ABSOLUTE_Y.id: {
        address = this.getAddressAbsoluteY();
        break;
      }
      case CPU_ADDRESSINGS.ZERO_PAGE.id: {
        address = this.getAddressZeroPage();
        break;
      }
      case CPU_ADDRESSINGS.INDEXED_ZERO_PAGE_X.id: {
        address = this.getAddressZeroPageX();
        break;
      }
      case CPU_ADDRESSINGS.INDEXED_ZERO_PAGE_Y.id: {
        address = this.getAddressZeroPageY();
        break;
      }
      case CPU_ADDRESSINGS.IMPLIED.id: {
        address = 0;
        break;
      }
      case CPU_ADDRESSINGS.ACCUMULATOR.id: {
        address = this.a.load();
        break;
      }
      case CPU_ADDRESSINGS.INDIRECT.id: {
        address = this.getAddressZeroPage();
        break;
      }
      case CPU_ADDRESSINGS.INDEXED_INDIRECT_X.id: {
        address = this.getAddressIndirectX();
        break;
      }
      case CPU_ADDRESSINGS.INDEXED_INDIRECT_Y.id: {
        address = this.getAddressIndirectY();
        break;
      }
      case CPU_ADDRESSINGS.RELATIVE.id: {
        address = this.getAddressRelative();
        // console.log('relative addressing : ' + address);
        break;
      }
      default:
        throw new Error('Cpu: Unkown addressing mode.');
        // break;
    }
    return address;
  }

  // Zero Page Addressing
  // 上位アドレスとして$00、下位アドレスとして2番目のバイトを使用し実効アドレスとします。
  getAddressZeroPage() {
    let addr = this.load(this.pc.load());
    this.pc.increment();
    return addr;
  }

  // Immediate Addressing
  // 2番目のバイトをデータそのものとして使用します。
  getAddressImmediate() {
    let addr = this.pc.load();
    this.pc.increment();
    return addr;
  }

  // Absolute Addressing
  // 2番目のバイトを下位アドレス、 3番目のバイトを上位アドレスとして実効アドレスとします。
  getAddressAbsolute() {
    let addr = this.load2Bytes(this.pc.load());
    this.pc.incrementBy2()
    return (addr & 0xFFFF);
  }

  // Indexed Zero Page Addressing X
  // 上位アドレスとして$00、 下位アドレスとして2番目のバイトにインデックスレジスタXを加算した値を実効アドレスとします。
  getAddressZeroPageX() {
    let addr = this.getAddressZeroPage();
    addr += this.x.load();
    return (addr & 0xFF);
  }


  // Indexed Zero Page Addressing Y
  // 上位アドレスとして$00、 下位アドレスとして2番目のバイトにインデックスレジスタYを加算した値を実効アドレスとします。
  getAddressZeroPageY() {
    let addr = this.getAddressZeroPage();
    addr += this.y.load();
    return (addr & 0xFF);
  }

  // Indexed Indirect Addressing
  // 上位アドレスを$00とし、 また2番目のバイトにインデックスレジスタXを加算した値を下位アドレスとします。
  // このアドレスに格納されている値を実効アドレスの下位バイト、
  // そしてその次のアドレスに格納されている値を実効アドレスの上位バイトとします。
  // このインクリメントにおいてキャリーは無視します。
  getAddressIndirectX() {
    let index = this.getAddressZeroPage();
    index += this.x.load();
    return this.load2Bytes(index & 0xFF);
  }

  // Indirect Indexed Addressing
  // まず上位アドレスを$00とし、下位アドレスとして2番目のバイトを使用します。
  // このアドレスに格納されている値を次の上位アドレス、
  // その次のアドレスに格納されている値を次の下位アドレスとします。
  // このときのインクリメントにおけるキャリーは無視します。
  // 得られたアドレスにインデックスレジスタYを加算したものを実効アドレスとします。
  getAddressIndirectY() {
    let index = this.getAddressZeroPage();
    let address = this.load2Bytes(index);
    address += this.y.load();
    return (address & 0xFFFF);
  }

  // Indexed Absolute Addressing X
  // 2番目のバイトを下位アドレス、3番目のバイトを上位アドレスとして、
  // このアドレスにインデックスレジスタXを加算したものを実効アドレスとします。
  getAddressAbsoluteX() {
    let addr = this.getAddressAbsolute();
    addr += this.x.load();
    return (addr & 0xFFFF);
  }

  // Indexed Absolute Addressing Y
  // 2番目のバイトを下位アドレス、3番目のバイトを上位アドレスとして、
  // このアドレスにインデックスレジスタYを加算したものを実効アドレスとします。
  getAddressAbsoluteY() {
    let addr = this.getAddressAbsolute();
    addr += this.y.load();
    return (addr & 0xFFFF);
  }

  // Relative Addressing
  // アドレス「PC + IM8」を取得
  getAddressRelative() {
    let addr = this.load(this.pc.load());
    this.pc.increment();
    if (addr & 0x80)
      addr -= 0x100;
    return addr;
  }

  /**
   *  update Status Register
   */
  // bit-7: Negative Flag
  updateN(value) {
    if ((value & 0x80) === 0)
      this.p.clearN();
    else
      this.p.setN();
  }
  // bit-1: Zero Flag
  updateZ(value) {
    if ((value & 0xff) === 0)
      this.p.setZ();
    else
      this.p.clearZ();
  }
  // bit-0: Carry Flag
  updateC(value) {
    if ((value & 0x100) === 0)
      this.p.clearC();
    else
      this.p.setC();
  }
  /**
   * NES CPU スタック
   * スタック領域: 0x0100~0x01FF
   */
  getStackAddress() {
    return this.sp.load() + 0x100;
  }
  // スタックにpush
  pushStack (value) {
    this.store(this.getStackAddress(), value);
    this.sp.decrement();
  }
  // スタックからpop
  popStack() {
    this.sp.increment();
    return this.load(this.getStackAddress());
  }
  pushStack2Bytes(value) {
    this.store(this.getStackAddress(), (value >> 8) & 0xff);
    this.sp.decrement();
    this.store(this.getStackAddress(), value & 0xff);
    this.sp.decrement();
  }
  popStack2Bytes() {
    this.sp.increment();
    var value = this.load(this.getStackAddress());
    this.sp.increment();
    return (this.load(this.getStackAddress()) << 8) | value;
  }

  /* 
   * NES CPU オペコード
   */

  // LDA : Aレジスタにロード
  opLDA(address) {
    let data = this.load(address);
    this.a.store(data);
    this.updateN(data);
    this.updateZ(data);
  }
  // LDX : Xレジスタにロード
  opLDX(address) {
    let data = this.load(address);
    this.x.store(data);
    this.updateN(data);
    this.updateZ(data);
  }
  // LDY : Yレジスタにロード
  opLDY(address) {
    let data = this.load(address);
    this.y.store(data);
    this.updateN(data);
    this.updateZ(data);
  }

  // STA : Aからメモリにストア
  opSTA(address) {
    this.store(address, this.a.load());
  }
  // STX : xからメモリにストア
  opSTX(address) {
    this.store(address, this.x.load());
  }
  // STY : Yからメモリにストア
  opSTY(address) {
    this.store(address, this.y.load());
  }

  // TAX : AレジスタをXレジスタにコピー
  opTAX() {
    let data = this.a.load();
    this.x.store(data);
    this.updateN(data);
    this.updateZ(data);
  }
  // TAY : AレジスタをYレジスタにコピー
  opTAY() {
    let data = this.a.load();
    this.y.store(data);
    this.updateN(data);
    this.updateZ(data);
  }
  // TSX : SレジスタをXレジスタにコピー
  opTSX() {
    let data = this.s.load();
    this.x.store(data);
    this.p.clearN();
    this.p.clearZ();
  }
  // TXA : XレジスタをAレジスタにコピー
  opTXA() {
    let data = this.x.load();
    this.a.store(data);
    this.updateN(data);
    this.updateZ(data);
  }
  // TXS : XレジスタをSレジスタにコピー
  opTXS() {
    this.sp.store(this.x.load());
  }
  // TYA : YレジスタをAレジスタにコピー
  opTYA() {
    let data = this.y.load();
    this.a.store(data);
    this.updateN(data);
    this.updateZ(data);
  }

  // ADC : (A + メモリ + キャリーフラグ) を演算して結果をAへ格納
  opADC(address) {
    let src1 = this.a.load();
    let src2 = this.load(address);
    let c = this.p.isC() ? 1 : 0;
    let result = (src1 + src2 + c);
    // console.log('adc result ' , address, src1, src2, c,  'is  ' + result);
    this.a.store(result);
    this.updateN(result)
    this.updateZ(result)
    this.updateC(result)
    if (!((src1 ^ src2) & 0x80) && ((src2 ^ result) & 0x80))
      this.p.setV();
    else
      this.p.clearV();
}
  // AND : AレジスタとAND演算をする。(結果はAへ格納)
  opAND(address) {
    let result = this.a.load() & this.load(address);
    this.a.store(result);
    this.updateN(result);
    this.updateZ(result);
  }
  // ASL : Aまたはメモリを左へシフトします。
  // 左シフト
  opASL_Sub(data) {
    let result = (data << 1)
    this.updateN(result)
    this.updateZ(result);
    this.updateC(result);
    return result & 0xff;
  }
  opASL(address) {
    this.store(address, this.opASL_Sub(this.load(address)));
  }
  // BIT : Aとメモリをビット比較演算します。
  opBIT(address) {
    let data = this.load(address);
    let result = data & this.a.load();
    this.updateN(data);
    this.updateZ(result);
    if ((data & 0x40) == 0)
      this.p.clearV();
    else
      this.p.setV();
  }
  // CMP : src(A/X/Y)とメモリを比較演算します。
  opCMP(address, src) {
    let data = this.load(address);
    let result = src - data;
    this.updateN(result);
    this.updateZ(result);
    if (src >= data)
      this.p.setC();
    else
      this.p.clearC();
  }
  // DEC : メモリをデクリメントします。
  opDEC(address) {
    this.store(address, this.opDEC_Sub(this.load(address)));
  }
  opDEC_Sub(data) {
    let result = (data - 1);
    this.updateN(result);
    this.updateZ(result);
    return result & 0xFF;
  }
  // EOR : Aとメモリを論理XOR演算します。(結果はAへ格納)
  opEOR(address) {
    let result = this.a.load() ^ this.load(address);
    this.a.store(result);
    this.updateN(result);
    this.updateZ(result);
  }
  // INC : メモリをインクリメントします。
  opINC(address) {
    this.store(address, this.opINC_Sub(this.load(address)));
  }
  opINC_Sub(data) {
    let result = (data + 1);
    this.updateN(result);
    this.updateZ(result);
    return result & 0xFF;
  }
  // LSR : Aまたはメモリを右へシフトします。
  // 右シフト
  opLSR_Sub(data) {
    let result = (data >> 1)
    this.p.clearN();
    this.updateZ(result);
    if ((data & 1) == 0)
      self.p.clearC();
    else
      self.p.setC();
    return result & 0xff;
  }
  opLSR(address) {
    this.store(address, this.opLSR_Sub(this.load(address)));
  }
  // ORA : Aとメモリを論理OR演算をする。(結果はAへ格納)
  opORA(address) {
    let result = this.a.load() | this.load(address);
    this.a.store(result);
    this.updateN(result);
    this.updateZ(result);
  }
  // ROL : Aまたはメモリを左へローテートします。
  // 左ローテート
  opROL_Sub(data) {
    let c = self.p.isC() ? 1 : 0;
    let result = (data << 1) | c;
    self.updateN(result);
    self.updateZ(result);
    self.updateC(result);
    return result & 0xff;
  }
  opROL(address) {
    this.store(address, this.opROL_Sub(this.load(address)));
  }
  // ROR : Aまたはメモリを右へローテートします。
  // 右ローテート
  opROR_Sub(data) {
    let c = this.p.isC() ? 0x80 : 0x00;
    let result = (data >> 1) | c;
    this.updateN(result);
    this.updateZ(result);
    if ((data & 1) == 0)
      this.p.clearC();
    else
      this.p.setC();
    return result & 0xff;
  }
  opROR(address) {
    this.store(address, this.opROR_Sub(this.load(address)));
  }
  // SBC : (A - メモリ - キャリーフラグの反転) を演算し、結果をAに返す。
  opSBC(address) {
    // this refer to takahirox-san's INSTRUCTIONS.SBC implement.
    let src1 = this.a.load();
    let src2 = this.load(address);
    let c = this.p.isC() ? 0 : 1;
    let result = src1 - src2 - c;
    this.a.store(result);
    this.updateN(result)
    this.updateZ(result)
    // TODO: check if this logic is right.
    if (src1 >= src2 + c)
      this.p.setC();
    else
      this.p.clearC();
    // TODO: implement right overflow logic.
    //       this is just a temporal logic.
    if (((src1 ^ result) & 0x80) && ((src1 ^ src2) & 0x80))
      this.p.setV();
    else
      this.p.clearV();
  }

  // PHA : Aをスタックにプッシュダウンします。
  opPHA() {
    this.pushStack(this.a.load());
  }
  // PHP : Pをスタックにプッシュダウンします。
  opPHP() {
    this.pushStack(this.p.load());
  }
  // PLA : スタックからAにポップアップします。
  opPLA() {
    let result = this.popStack();
    this.a.store(result);
    this.updateN(result);
    this.updateZ(result);
  }
  // PLP : スタックからPにポップアップします。
  opPLP() {
    this.p.store(this.popStack());
  }

  // JMP : アドレスへジャンプします。
  opJMP(address) {
    this.pc.store(address);
  }
  // JSR : サブルーチンを呼び出します。
  opJSR(address) {
    this.pc.decrement();
    this.pushStack2Bytes(this.pc.load());
    this.pc.store(address);
  }
  // RTS : サブルーチンから復帰します。
  opRTS() {
    this.pc.store(this.popStack2Bytes());
    this.pc.increment();
  }
  // RTI : 割り込みルーチンから復帰します。
  opRTI() {
    this.p.store(this.popStack());
    this.pc.store(this.popStack2Bytes());
  }
  
  // B** : ブランチ処理(flagがtrueの時、pc+(Relative)addressへjumpする)
  opBranch(address, flag) {
    if (flag) {
      // console.log('jump from ' + this.pc.load() + ' to  +' + address);
      this.pc.add(address);
      // console.log(' --> ' + this.pc.load());
    }
  }

  // BRK : ソフトウェア割り込みを起こします。
  // Forced Interrupt with PC + 2 to SP, P to S, set status(B)
  opBRK() {
    this.pc.increment();
    this.p.setA();
    this.p.setB();
    this.interrupt(CPU_INTS.BRK);
  }

  // End Of Operands
  //
  /**
   * dump methods
   */
  dump() {
    let buffer = 'cpu ';
    let opc = this.load(this.pc.load());
    let op = this.decode(opc);
    buffer += 'p:' + this.p.dump() + ' ';
    buffer += 'pc:' + this.pc.dump() + ' ';
    buffer += 'sp:' + this.sp.dump() + ' ';
    buffer += 'a:' + this.a.dump() + ' ';
    buffer += 'x:' + this.x.dump() + ' ';
    buffer += 'y:' + this.y.dump() + ' ';
    buffer += this.dump_cpu_op(op, opc);
    buffer += '\n';
    return buffer;

  }
  dump_cpu_op(op, opc) {
    let buffer = 'opc=(0x' + log.toHex(opc) + '): ';
    buffer += op.instruction.name + ' ';
    if (op.mode != null )
      buffer += op.mode.name;
    buffer += ' ';
    return buffer;
  }
  dump_cpu_memory() {
    // let dump_size = 0x10000; // 64KB
    let dump_size = 0x800; // 2KB
    // let dump_size = 0x200; // 512B
    let cpu_memory = new Memory(dump_size); // 64KB
    for (let i = 0; i < dump_size; i++) {
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