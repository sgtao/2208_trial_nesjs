'use strict';
// import CSS files
import './styles/vendors/bootstrap-reboot.css';
import './style.scss';
//
// import JS files
import { Nes } from './Nes.js';
import { dump_nes } from './NES/dump_nes.js';
// 主要要素の取得
var canvas, dbg_console;
var nes, dump;
// 初期化
function init() {
  canvas = document.querySelector('#NESdisplay');
  nes = new Nes(canvas);
  window.nes = nes;
  // 画面の高さに応じてcanvasサイズ変更
  nes.display.resizeCanvas();
  // DOM イベントの初期化
  initializeDomEvents();
  // console
  dbg_console = document.querySelector('#DBGconsole');
  dump = new dump_nes(dbg_console);
  window.dump = dump;
}
// ROM をNESにセットする
function nes_rom_change(arraybuffer) {
  dump.putMessage('Rom load...');
  if (!nes.SetRom(arraybuffer)) {
    console.error("Can't get rom data (perhaps you don't set ArrayBuffer arguments or it's not nes rom format)");
    return;
  } else {
    dump.putMessage('Header is ');
    dump.putMessage(nes.rom.header_dump());
    dump.putMessage(nes.rom.header_info());
  }
  nes.Init();
  dump.putMessage('NES Init...');
  dump.putMessage(nes.cpu.dump());
  dump.putMessage(nes.ppu.dump());
  nes.Run();
  dump.putMessage('after Run.');
}
// ローカル上のROMを読み込み
function read_local_file(fileObj, cb) {
  dump.putMessage('read filename is ' + fileObj.name);
  var reader = new FileReader();
  reader.onload = function (e) { cb(e.target.result); };
  reader.readAsArrayBuffer(fileObj);
}
// URL からROMを読み込み
function read_url(url, cb) {
  dump.putMessage('rom url is ' + url);
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
function initializeDomEvents() {
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
        read_url(url, nes_rom_change);
      }, false);
    // NES リセット
    document.querySelector("#nes_reset").addEventListener("click", 
      function (e) {
        e.preventDefault();
        dump.clrMessage();
        dump.putMessage('NES Reset...\n');
        nes.Init();
        dump.putMessage(nes.cpu.dump());
        dump.putMessage(nes.ppu.dump());
        nes.Run();
      }, false);
    // STEP実行（+16cycle)
    document.querySelector("#nes_step16").addEventListener("click", 
      function (e) {
        e.preventDefault();
        dump.putMessage('\n#Step +16cycles');
        nes.cycle_limit += 16;
        nes.Run();
      }, false);
    // 
    // Debug Console をクリア
    document.querySelector("#clear_console").addEventListener("click", 
      function (e) {
        e.preventDefault();
        dump.clrMessage();
        dump.putMessage('clear message...\n');
      }, false);
    // ROMをダンプ
    document.querySelector("#dump_rom").addEventListener("click", 
      function (e) {
        e.preventDefault();
        dump.putMessage('\n\n# Dump ROM data');
        dump.putMessage(nes.rom.dump());
      }, false);
    // Cpu register+operand をダンプ
    document.querySelector("#dump_cpureg").addEventListener("click", 
      function (e) {
        e.preventDefault();
        dump.putMessage('\n# Dump CPU Registers');
        dump.putMessage(nes.cpu.dump());
      }, false);
    // Cpu memory をダンプ
    document.querySelector("#dump_cpumem").addEventListener("click", 
      function (e) {
        e.preventDefault();
        dump.putMessage('\n# Dump CPU Memory');
        dump.putMessage(nes.cpu.dump_cpu_memory());
      }, false);
    // Ppu register をダンプ
    document.querySelector("#dump_ppureg").addEventListener("click", 
      function (e) {
        e.preventDefault();
        dump.putMessage('\n# Dump PPU Registers');
        dump.putMessage(nes.ppu.dump());
      }, false);
    // Ppu register をダンプ
    document.querySelector("#dump_ppumem").addEventListener("click", 
      function (e) {
        e.preventDefault();
        dump.putMessage('\n# Dump PPU Memory');
        dump.putMessage(nes.ppu.dump_ppu_memory());
      }, false);
  }
  // 画面の高さに応じてcanvasサイズ変更
  window.addEventListener('resize', () => {
    nes.display.resizeCanvas();
  });
}
document.addEventListener('DOMContentLoaded', function () {
  init();
});