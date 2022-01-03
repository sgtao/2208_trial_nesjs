'use strict';
// import CSS files
import './styles/vendors/bootstrap-reboot.css';
import './styles/style.css';
//
// import JS files
// var NES = require('./NES');
import NES from './NES';
import { DBGROM } from './NES/debuggerNES';
// 主要要素の取得
// canvas
var canvas = document.querySelector('#NESdisplay');
var canvas_width = 256;
var canvas_height = 224;
// nes
var nes = new NES(canvas);
// console
var dbg_console = document.querySelector('#DBGconsole');
var dbg_textarea = dbg_console.querySelector('.textArea');
// 初期化
window.onload = function () {
  // 画面の高さに応じてcanvasサイズ変更
  resize_canvas();
  // DOM イベントの初期化
  initialize_dom_events();
};
// NES画面のリサイズ
function resize_canvas() {
  let magnification = Math.floor(window.innerWidth * 0.9 / canvas_width);
  if (nes.ctx_multiple != magnification) { 
    console.log(`previous canvas size ${canvas_width}, current windows width(x0.9)= ${window.innerWidth * 0.9}`);
    console.log(`change magnification to ${magnification}`);
    nes.ctx_multiple = magnification;
    canvas.width = canvas_width * magnification;
    canvas.height = canvas_height * magnification;
    canvas.style.width = canvas_width * magnification;
    canvas.style.height = canvas_height * magnification;
  }
  nes.initCanvas();
}
// ROM をNESにセットする
function nes_rom_change(arraybuffer) {
  console.dir(arraybuffer);
  let nesrom = new DBGROM(arraybuffer, dbg_textarea);
  console.log('charactor ROM : ');
  console.log(nesrom.toHEX_charrom());
  // if (!nes.SetRom(arraybuffer)) {
  //   console.error("Can't get rom data (perhaps you don't set ArrayBuffer arguments or it's not nes rom format)");
  //   return;
  // }
  // nes.Init();
  // nes.Run();
}
// ローカル上のROMを読み込み
function read_local_file(fileObj, cb) {
  var reader = new FileReader();
  reader.onload = function (e) { cb(e.target.result); };
  reader.readAsArrayBuffer(fileObj);
}
// URL からROMを読み込み
function read_url(url, cb) {
  var request = new XMLHttpRequest();
  request.onload = function () { cb(request.response); };
  request.onerror = function (e) {
    console.error("can't get rom binary. Error is ",e);
  };
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.send(null);
}
// DOMのイベントを設定
function initialize_dom_events() {
  if (typeof window.FileReader !== "undefined") {
    // ドラッグ&ドロップでROM読み込み
    window.addEventListener("dragenter",
      function (e) {
        e.preventDefault();
      }, false);

    window.addEventListener("dragover",
      function (e) {
        e.preventDefault();
      }, false);

    window.addEventListener("drop",
      function (e) {
        e.preventDefault();
        read_local_file(e.dataTransfer.files[0], nes_rom_change);
      }, false);
    // プルダウンから ROM読み込み
    document.getElementById("romload").addEventListener("click",
      function (e) {
        e.preventDefault();

        // ROM の場所
        var url = document.getElementById("romlist").value;
        console.log('rom url is ' + url);
        read_url(url, nes_rom_change);
      }, false);
  }
  // 画面の高さに応じてcanvasサイズ変更
  window.addEventListener('resize', resize_canvas);
}