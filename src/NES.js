// NES.js
import { Display } from './NES/Display.js';
// クラス
class NES {
  constructor (canvas) {
    this.display = new Display(canvas);
  }
}
export { NES };
