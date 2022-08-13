// Display.js
// 定数
const DISP_WIDTH = 256;
const DISP_HEIGHT = 240;
// クラス
class Display {
  constructor(canvas) {
    // requestAnimationFrame 対応ブラウザのみ遊べます
    if (typeof window.requestAnimationFrame === 'undefined') {
      window.alert('use a brower that supports requestAnimationFrame method');
      return false;
    }
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.ctx_multiple = 1;
    this.width = DISP_WIDTH;
    this.height = DISP_HEIGHT;
    this.ImageData = this.ctx.createImageData(this.width, this.height);
    this.uint32 = new Uint32Array(DISP_WIDTH * DISP_HEIGHT);
    this.resizeCanvas();
  }
  initCanvas() {
    // Canvasを初期化(真っ黒画面にする)
    if (!this.ctx) {
      return false;
    }
    this.ImageData = this.ctx.createImageData(
      this.canvas.width,
      this.canvas.height
    );
    for (let i = 0; i < DISP_HEIGHT; i++) {
      for (let j = 0; j < DISP_WIDTH; j++) {
        this.renderPixel(j, i, 0xa0);
      }
    }
    this.updateScreen();
    return true;
  }
  resizeCanvas() {
    console.log('at resizeCanvas, this.width is ', this.width);
    let magnification = Math.floor((window.innerWidth * 0.9) / this.width);
    if (this.ctx_multiple != magnification) {
      console.log(
        `previous canvas size ${this.width}, current windows width(x0.9)= ${
          window.innerWidth * 0.9
        }`
      );
      console.log(`change magnification to ${magnification}`);
      this.ctx_multiple = magnification >= 1 ? magnification : 1;
    }
    this.canvas.width = DISP_WIDTH * this.ctx_multiple;
    this.canvas.height = DISP_HEIGHT * this.ctx_multiple;
    this.canvas.style.width = DISP_WIDTH * this.ctx_multiple;
    this.canvas.style.height = DISP_HEIGHT * this.ctx_multiple;
    this.initCanvas();
  }
  renderPixel(x, y, c) {
    let index = y * this.width + x;
    this.uint32[index] = c;
  }
  _getCanvasColor(nes_color) {
    let color_array = new Uint8Array(4);
    color_array[0] = (nes_color & 0x00ff0000) >> 16;
    color_array[1] = (nes_color & 0x0000ff00) >> 8;
    color_array[2] = nes_color & 0x000000ff;
    color_array[3] = 0xff;
    return color_array;
  }
  updateScreen() {
    let color_array = new Uint8Array(4);
    if (this.ctx_multiple === 1) {
      for (let i = 0; i < this.canvas.width * this.canvas.height * 4; i += 4) {
        color_array = this._getCanvasColor(this.uint32[i / 4]);
        this.ImageData.data[i] = color_array[0];
        this.ImageData.data[i + 1] = color_array[1];
        this.ImageData.data[i + 2] = color_array[2];
        this.ImageData.data[i + 3] = color_array[3];
      }
    } else if (this.ctx_multiple > 1) {
      for (let i = 0; i < DISP_HEIGHT; i++) {
        for (let j = 0; j < DISP_WIDTH; j++) {
          color_array = this._getCanvasColor(this.uint32[i / 4]);
          color_array = this._getCanvasColor(this.uint32[i * DISP_WIDTH + j]);
          for (let x = 0; x < this.ctx_multiple; x++) {
            for (let y = 0; y < this.ctx_multiple; y++) {
              let idx =
                ((i * this.ctx_multiple + x) * this.canvas.width +
                  (j * this.ctx_multiple + y)) *
                4;
              this.ImageData.data[idx] = color_array[0];
              this.ImageData.data[idx + 1] = color_array[1];
              this.ImageData.data[idx + 2] = color_array[2];
              this.ImageData.data[idx + 3] = color_array[3];
            }
          }
        }
      }
    }
    this.ctx.putImageData(this.ImageData, 0, 0);
    return;
  }
}
//
export { Display };
