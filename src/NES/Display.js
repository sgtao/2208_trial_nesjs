// Display.js
// 定数
const DISP_WIDTH = 256;
const DISP_HEIGHT = 240;
// クラス
class Display  {
  constructor(canvas) {
    // requestAnimationFrame 対応ブラウザのみ遊べます
    if (typeof window.requestAnimationFrame === "undefined") {
      window.alert('use a brower that supports requestAnimationFrame method');
      return false;
    }    
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx_multiple = 1;
    this.width = DISP_WIDTH;
    this.height = DISP_HEIGHT;
    this.ImageData = this.ctx.createImageData(this.width, this.height);
    this.uint32 = new Uint32Array(this.ImageData.data.buffer);
    this.resizeCanvas();
  }
  initCanvas() {
    // Canvasを初期化(真っ黒画面にする)
    if (!this.ctx) {
      return false;
    }
    this.ImageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);
    for (let i = 0; i < DISP_HEIGHT; i++) {
      for (let j = 0; j < DISP_WIDTH; j++) {
        this.renderPixel(j, i, 0xA0);
      }
    }
    this.updateScreen();
    return true;
  }
  resizeCanvas() {
    console.log('at resizeCanvas, this.width is ', this.width);
    let magnification = Math.floor(window.innerWidth * 0.9 / this.width);
    if (this.ctx_multiple != magnification) {
      console.log(`previous canvas size ${this.width}, current windows width(x0.9)= ${window.innerWidth * 0.9}`);
      console.log(`change magnification to ${magnification}`);
      this.ctx_multiple = (magnification >= 1)?magnification:1;
    }
    this.canvas.width = DISP_WIDTH * this.ctx_multiple;
    this.canvas.height = DISP_HEIGHT * this.ctx_multiple;
    this.canvas.style.width = DISP_WIDTH * this.ctx_multiple
    this.canvas.style.height = DISP_HEIGHT * this.ctx_multiple;
    this.initCanvas();
  }  
  renderPixel (x, y, c) {
    let index = y * DISP_WIDTH + x;
    this.uint32[index] = c;
  }
  updateScreen() {
    for (let i = 0; i < this.canvas.width * this.canvas.height * 4; i += 4) {
      this.ImageData.data[i + 3] = this.uint32[i / 4];
    }    
    this.ctx.putImageData(this.ImageData, 0, 0);
    return;
  }
}
//
export { Display };
