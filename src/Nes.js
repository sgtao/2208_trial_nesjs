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
    if (!this.rom.SetRom(arrayBuffer)){ // if failure
      return false;
    } else {
      this.cpu.SetRom(this.rom);      
      this.ppu.SetRom(this.rom);
    }
    return this.rom;
  }
  Init () {
    this.cpu.InitCpu();
  }
  Run () {
    var cycles = (341 * 262 / 3) | 0; // TODO: temporal
    for (var i = 0; i < cycles; i++) {
      this.runCycle();
    }
    if (this.state === this.STATES.RUN)
      requestAnimationFrame(this.runFunc);
  }
  /**
   *
   */
  runCycle() {
    this.cpu.runCycle();
    // this.ppu.runCycle();
    // this.ppu.runCycle();
    // this.ppu.runCycle();
  }
}
export { Nes };
