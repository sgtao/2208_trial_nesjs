// NES.js
import { Display } from './NES/Display.js';
import { Cpu } from './NES/Cpu.js';
import { Ppu } from './NES/Ppu.js';
import { Rom } from './NES/Rom.js';
// クラス
class Nes {
  constructor (canvas) {
    this.isNes = true;
    this.display = new Display(canvas);
    this.cpu = new Cpu(this);
    this.ppu = new Ppu(this);
    this.rom = new Rom(this);
  }
  SetRom(arrayBuffer) {
    return this.rom.SetRom(arrayBuffer);
    // this.rom.dump();
    this.rom.header_dump();
  }
  init () {
  }
}
export { Nes };
