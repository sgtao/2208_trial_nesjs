// NES.js
// 定数
const DISP_WIDTH=256;
const DISP_HEIGHT=224;
// クラス
class NES {
  constructor (canvas) {
    // requestAnimationFrame 対応ブラウザのみ遊べます
    if (typeof window.requestAnimationFrame === "undefined") {
      window.alert('use a brower that supports requestAnimationFrame method');
      return;
    }
    // 画面データ
    this.ImageData = null;
    this.ctx = canvas.getContext("2d");
    this.ctx_multiple = 1;
  }
  initCanvas () {
    // Canvasを初期化(真っ黒画面にする)
    if (!this.ctx) {
      return false;
    }
    let disp_width = DISP_WIDTH * this.ctx_multiple;
    let disp_height= DISP_HEIGHT * this.ctx_multiple;
    this.ImageData = this.ctx.createImageData(disp_width, disp_height);
    for (var i = 0; i < disp_width * disp_height * 4; i += 4) {
      this.ImageData.data[i + 3] = 0xFF;
    }
    this.ctx.putImageData(this.ImageData, 0, 0);
    return true;
  }
}
module.exports = NES;
