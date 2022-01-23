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
    this.cpu.SetPpu(this.ppu);
    this.ppu.SetCpu(this.cpu);
    this.ppu.SetDisplay(this.display);
    this.cycle = 0;
    this.cycle_limit = 16;
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
    this.ppu.InitPpu();
    this.cycle = 0;
    this.cycle_limit = 16;
  }
  Run () {
    let one_frame_cycle = (341 * 262 / 3) | 0; // TODO: temporal
    // this.cycle_limit = one_frame_cycle;
    while (this.cycle < this.cycle_limit) {
      this.runCycle();
      this.cycle++;
    }
    if (this.cycle == this.cycle_limit) {
      console.log('NES reach to limit. cycle : ' + this.cycle);
    }
    // if (this.state === this.STATES.RUN)
    //   requestAnimationFrame(this.runFunc);
  }
  /**
   *
   */
  runCycle() {
    this.cpu.runCycle();
    this.ppu.runCycle();
    this.ppu.runCycle();
    this.ppu.runCycle();
  }
}
export { Nes };
