// Display.js
// 定数
const DISP_WIDTH = 256;
const DISP_HEIGHT = 240;
// クラス
class Display  {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx_multiple = 1;
    this.width = DISP_WIDTH;
    this.height = DISP_HEIGHT;
    this.data = this.ctx.createImageData(this.width, this.height);
    this.uint32 = new Uint32Array(this.data.data.buffer);
    this.resizeCanvas();
  }
  initCanvas() {
    // requestAnimationFrame 対応ブラウザのみ遊べます
    if (typeof window.requestAnimationFrame === "undefined") {
      window.alert('use a brower that supports requestAnimationFrame method');
      return;
    }
    // Canvasを初期化(真っ黒画面にする)
    if (!this.ctx) {
      return false;
    }
    let disp_width = DISP_WIDTH * this.ctx_multiple;
    let disp_height = DISP_HEIGHT * this.ctx_multiple;
    this.ImageData = this.ctx.createImageData(disp_width, disp_height);
    for (var i = 0; i < disp_width * disp_height * 4; i += 4) {
      this.ImageData.data[i + 3] = 0xFF;
    }
    this.ctx.putImageData(this.ImageData, 0, 0);
    return true;
  }
  resizeCanvas() {
      console.log('at resizeCanvas, this.width is ', this.width);
    let magnification = Math.floor(window.innerWidth * 0.9 / this.width);
    if (this.ctx_multiple != magnification) {
      console.log(`previous canvas size ${this.width}, current windows width(x0.9)= ${window.innerWidth * 0.9}`);
      console.log(`change magnification to ${magnification}`);
      this.ctx_multiple = magnification;
      this.canvas.width = DISP_WIDTH * magnification;
      this.canvas.height = DISP_HEIGHT * magnification;
      this.canvas.style.width = DISP_WIDTH * this.magnification;
      this.canvas.style.height = DISP_HEIGHT * magnification;
    }
    this.initCanvas();
  }  
  renderPixel (x, y, c) {
    var index = y * this.width + x;
    this.uint32[index] = c;
  }
  updateScreen() {
    this.ctx.putImageData(this.data, 0, 0);
  }
}
//
export { Display };
