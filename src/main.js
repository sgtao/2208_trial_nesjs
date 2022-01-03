'use strict';
// import CSS files
import './styles/vendors/bootstrap-reboot.css';
import './styles/style.css';
//
// import JS files
var NES = require('./NES');
// 主要要素の取得
// canvas
var canvas = document.querySelector('#NESdisplay');
var canvas_width = 256;
var canvas_height = 224;
// nes
var nes = new NES(canvas);
// 初期化
window.onload = function () {
  // 画面の高さに応じてcanvasサイズ変更
  resize_canvas();
  nes.initCanvas();
};
// NES画面のリサイズ
function resize_canvas() {
  console.log(window.innerWidth * 0.9);
  console.log(canvas_width);
  let diameter = Math.floor(window.innerWidth * 0.9 / canvas_width);
  nes.ctx_multiple = diameter;
  console.log(diameter);
  canvas.width = canvas_width * diameter;
  canvas.height = canvas_height * diameter;
  canvas.style.width = canvas_width * diameter;
  canvas.style.height = canvas_height * diameter;
}