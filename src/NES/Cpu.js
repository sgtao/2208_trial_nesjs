// Cpu.js
import { Register8bit, Register16bit } from './Register.js';

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

  }
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