/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/NES/Cpu.js":
/*!************************!*\
  !*** ./src/NES/Cpu.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Cpu\": () => (/* binding */ Cpu)\n/* harmony export */ });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\n\n// Cpu.js\nvar Cpu = /*#__PURE__*/function () {\n  function Cpu() {\n    _classCallCheck(this, Cpu);\n  }\n\n  _createClass(Cpu, [{\n    key: \"constractor\",\n    value: function constractor(nes) {\n      this.isCpu = true;\n      this.nes = nes;\n      this.rom = null;\n    }\n  }, {\n    key: \"SetRom\",\n    value: function SetRom(rom) {\n      this.rom = rom;\n    }\n  }]);\n\n  return Cpu;\n}();\n\n\n\n//# sourceURL=webpack://trial_nesjs/./src/NES/Cpu.js?");

/***/ }),

/***/ "./src/NES/Display.js":
/*!****************************!*\
  !*** ./src/NES/Display.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Display\": () => (/* binding */ Display)\n/* harmony export */ });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\n\n// Display.js\n// 定数\nvar DISP_WIDTH = 256;\nvar DISP_HEIGHT = 240; // クラス\n\nvar Display = /*#__PURE__*/function () {\n  function Display(canvas) {\n    _classCallCheck(this, Display);\n\n    // requestAnimationFrame 対応ブラウザのみ遊べます\n    if (typeof window.requestAnimationFrame === \"undefined\") {\n      window.alert('use a brower that supports requestAnimationFrame method');\n      return false;\n    }\n\n    this.canvas = canvas;\n    this.ctx = canvas.getContext('2d');\n    this.ctx_multiple = 1;\n    this.width = DISP_WIDTH;\n    this.height = DISP_HEIGHT;\n    this.ImageData = this.ctx.createImageData(this.width, this.height);\n    this.uint32 = new Uint32Array(this.ImageData.data.buffer);\n    this.resizeCanvas();\n  }\n\n  _createClass(Display, [{\n    key: \"initCanvas\",\n    value: function initCanvas() {\n      // Canvasを初期化(真っ黒画面にする)\n      if (!this.ctx) {\n        return false;\n      }\n\n      this.ImageData = this.ctx.createImageData(this.canvas.width, this.canvas.height);\n\n      for (var i = 0; i < DISP_HEIGHT; i++) {\n        for (var j = 0; j < DISP_WIDTH; j++) {\n          this.renderPixel(j, i, 0xA0);\n        }\n      }\n\n      this.updateScreen();\n      return true;\n    }\n  }, {\n    key: \"resizeCanvas\",\n    value: function resizeCanvas() {\n      console.log('at resizeCanvas, this.width is ', this.width);\n      var magnification = Math.floor(window.innerWidth * 0.9 / this.width);\n\n      if (this.ctx_multiple != magnification) {\n        console.log(\"previous canvas size \".concat(this.width, \", current windows width(x0.9)= \").concat(window.innerWidth * 0.9));\n        console.log(\"change magnification to \".concat(magnification));\n        this.ctx_multiple = magnification >= 1 ? magnification : 1;\n      }\n\n      this.canvas.width = DISP_WIDTH * this.ctx_multiple;\n      this.canvas.height = DISP_HEIGHT * this.ctx_multiple;\n      this.canvas.style.width = DISP_WIDTH * this.ctx_multiple;\n      this.canvas.style.height = DISP_HEIGHT * this.ctx_multiple;\n      this.initCanvas();\n    }\n  }, {\n    key: \"renderPixel\",\n    value: function renderPixel(x, y, c) {\n      var index = y * DISP_WIDTH + x;\n      this.uint32[index] = c;\n    }\n  }, {\n    key: \"updateScreen\",\n    value: function updateScreen() {\n      for (var i = 0; i < this.canvas.width * this.canvas.height * 4; i += 4) {\n        this.ImageData.data[i + 3] = this.uint32[i / 4];\n      }\n\n      this.ctx.putImageData(this.ImageData, 0, 0);\n      return;\n    }\n  }]);\n\n  return Display;\n}(); //\n\n\n\n\n//# sourceURL=webpack://trial_nesjs/./src/NES/Display.js?");

/***/ }),

/***/ "./src/NES/Memory.js":
/*!***************************!*\
  !*** ./src/NES/Memory.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Memory\": () => (/* binding */ Memory)\n/* harmony export */ });\n/* harmony import */ var _logger_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger.js */ \"./src/NES/logger.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\n\n// Memory.js\n\n/**\r\n * Generic 8bit-word Memory.\r\n */\n\n/**\r\n * @param {ArrayBuffer|integer} arrayBuffer -\r\n */\n\nvar Memory = /*#__PURE__*/function () {\n  function Memory(arrayBuffer) {\n    _classCallCheck(this, Memory);\n\n    this.isMemory = true; // console.dir(arrayBuffer);\n\n    this.data = new Uint8Array(arrayBuffer);\n  }\n  /**\r\n   *  class methods\r\n   */\n\n\n  _createClass(Memory, [{\n    key: \"clear\",\n    value: function clear() {\n      for (var i = 0, il = this.getCapacity(); i < il; i++) {\n        this.storeWithoutMapping(i, 0);\n      }\n    }\n  }, {\n    key: \"getCapacity\",\n    value: function getCapacity() {\n      return this.data.byteLength;\n    }\n  }, {\n    key: \"load\",\n    value: function load(address) {\n      return this.data[address];\n    }\n  }, {\n    key: \"loadWithoutMapping\",\n    value: function loadWithoutMapping(address) {\n      return this.data[address];\n    }\n  }, {\n    key: \"store\",\n    value: function store(address, value) {\n      this.data[address] = value;\n    }\n  }, {\n    key: \"storeWithoutMapping\",\n    value: function storeWithoutMapping(address, value) {\n      this.data[address] = value;\n    }\n  }, {\n    key: \"dump\",\n    value: function dump() {\n      // log.logHexarray(this.data);\n      return _logger_js__WEBPACK_IMPORTED_MODULE_0__.log.toHexarray(this.data);\n    }\n  }]);\n\n  return Memory;\n}(); // export\n\n\n\n\n//# sourceURL=webpack://trial_nesjs/./src/NES/Memory.js?");

/***/ }),

/***/ "./src/NES/Ppu.js":
/*!************************!*\
  !*** ./src/NES/Ppu.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Ppu\": () => (/* binding */ Ppu)\n/* harmony export */ });\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\n\n// Ppu.js\nvar Ppu = /*#__PURE__*/function () {\n  function Ppu() {\n    _classCallCheck(this, Ppu);\n  }\n\n  _createClass(Ppu, [{\n    key: \"constractor\",\n    value: function constractor(nes) {\n      this.isPpu = true;\n      this.nes = nes;\n      this.rom = null;\n    }\n  }, {\n    key: \"SetRom\",\n    value: function SetRom(rom) {\n      this.rom = rom;\n    }\n  }]);\n\n  return Ppu;\n}();\n\n\n\n//# sourceURL=webpack://trial_nesjs/./src/NES/Ppu.js?");

/***/ }),

/***/ "./src/NES/Rom.js":
/*!************************!*\
  !*** ./src/NES/Rom.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Rom\": () => (/* binding */ Rom)\n/* harmony export */ });\n/* harmony import */ var _Memory_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Memory.js */ \"./src/NES/Memory.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\n\n// Rom.js\n\n\nvar Rom = /*#__PURE__*/function () {\n  function Rom(nes) {\n    _classCallCheck(this, Rom);\n\n    this.isRom = true;\n    this.nes = nes;\n    this.data = null;\n    this.size = 0;\n    this.header = null;\n    this.header_parse = null;\n  }\n\n  _createClass(Rom, [{\n    key: \"SetRom\",\n    value: function SetRom(arrayBuffer) {\n      this.data = new _Memory_js__WEBPACK_IMPORTED_MODULE_0__.Memory(arrayBuffer);\n      this.size = this.data.getCapacity();\n      console.log('[Rom.SetRom] data size : ' + this.size);\n      this.header = new _Memory_js__WEBPACK_IMPORTED_MODULE_0__.Memory(16);\n\n      for (var i = 0; i < 16; i++) {\n        this.header.data[i] = this.data.load(i);\n      }\n\n      if (this._isNes()) {\n        this.header_parse = this._ParseHeader(this.header);\n        return true;\n      } else {\n        return false;\n      }\n    }\n  }, {\n    key: \"_isNes\",\n    value: function _isNes() {\n      if ([].slice.call(this.header.data, 0, 3).map(function (v) {\n        return String.fromCharCode(v);\n      }).join('') !== 'NES') {\n        console.log('This file is not NES format.');\n        return false;\n      } else {\n        console.log('This file is NES format.');\n        console.log(this.header);\n        return true;\n      }\n    }\n  }, {\n    key: \"_ParseHeader\",\n    value: function _ParseHeader(header) {\n      if (header === null) return;\n      var _parse = {}; // PRG_ROM_BANKS_NUM_ADDRESS = 0x4\n\n      _parse.prog_bank_num = header.load(4); // CHR_ROM_BANKS_NUM_ADDRESS = 0x5\n\n      _parse.char_bank_num = header.load(5); // CONTROL_BYTE1_ADDRESS = 0x6, CONTROL_BYTE2_ADDRESS = 0x7\n\n      _parse.isHorizontalMirror = header.load(6) & 0x01 ? false : true;\n      _parse.isPresenceBatteryRAM = header.load(6) & 0x02 ? true : false;\n      _parse.isPresenceTrainer = header.load(6) & 0x04 ? true : false;\n      _parse.isFourScreenMirror = header.load(6) & 0x08 ? true : false;\n      _parse.mapper_num = (header.load(6) & 0xF0) >> 4 | this.header.load(7) & 0xF0; // SCREEN TYPE\n\n      _parse.screen_type = 0; // SINGLE_SCREEN\n\n      if (_parse.isFourScreenMirror) {\n        _parse.screen_type = 3; // FOUR_SCREEN\n      } else if (_parse.isHorizontalMirror) {\n        _parse.screen_type = 1; // HORIZONTAL\n      } else {\n        _parse.screen_type = 2; // VERTICAL\n      }\n\n      return _parse;\n    }\n  }, {\n    key: \"dump\",\n    value: function dump() {\n      return this.data.dump();\n    }\n  }, {\n    key: \"header_dump\",\n    value: function header_dump() {\n      return this.header.dump();\n    }\n  }, {\n    key: \"header_info\",\n    value: function header_info() {\n      var buffer = '';\n      buffer += 'PRG-ROM banks size: ' + this.header_parse.prog_bank_num * 16 + '(KB)\\n';\n      buffer += 'CHR-ROM banks size: ' + this.header_parse.char_bank_num * 8 + '(KB)\\n';\n      buffer += 'mapper number : ' + this.header_parse.mapper_num + '\\n';\n      buffer += 'screen type   : ';\n\n      switch (this.header_parse.screen_type) {\n        case 1:\n          buffer += 'HORIZONTAL';\n          break;\n\n        case 2:\n          buffer += 'VERTICAL';\n          break;\n\n        case 3:\n          buffer += 'FOUR_SCREEN';\n          break;\n\n        default:\n          buffer += 'SINGLE_SCREEN';\n          break;\n      }\n\n      buffer += '\\n\\n';\n      return buffer;\n    }\n  }]);\n\n  return Rom;\n}();\n\n\n\n//# sourceURL=webpack://trial_nesjs/./src/NES/Rom.js?");

/***/ }),

/***/ "./src/NES/dump_nes.js":
/*!*****************************!*\
  !*** ./src/NES/dump_nes.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"dump_nes\": () => (/* binding */ dump_nes)\n/* harmony export */ });\n/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger */ \"./src/NES/logger.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\n\n// dump_nes.js\n // 定数\n\nvar DUMP_Level = 1; // 1 is short message, 2 is long message\n// const DUMP_Level = 2; // 1 is short message, 2 is long message\n//\n\n/**\r\n * dump methods\r\n */\n\nvar dump_nes = /*#__PURE__*/function () {\n  function dump_nes(area) {\n    _classCallCheck(this, dump_nes);\n\n    this.area = area;\n    this.clrMessage();\n    this.putMessage('add dump console..');\n  }\n\n  _createClass(dump_nes, [{\n    key: \"putMessage\",\n    value: function putMessage(str) {\n      if (DUMP_Level >= 1) console.log(str);\n      this.area.value += str + '\\n';\n      this.area.scrollTop = this.area.scrollHeight;\n    }\n  }, {\n    key: \"clrMessage\",\n    value: function clrMessage() {\n      this.area.value = '';\n    }\n  }]);\n\n  return dump_nes;\n}();\n\n\n\n//# sourceURL=webpack://trial_nesjs/./src/NES/dump_nes.js?");

/***/ }),

/***/ "./src/NES/logger.js":
/*!***************************!*\
  !*** ./src/NES/logger.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"log\": () => (/* binding */ log),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* logger.js */\n\n/**\r\n * バイト配列を16進数表記文字列に変換する\r\n */\nfunction toHEX(num) {\n  return num < 16 ? '0' + num.toString(16).toUpperCase() : num.toString(16).toUpperCase();\n}\n\nfunction strHEXarray(buf) {\n  var hex_str = '';\n\n  for (var i in buf) {\n    hex_str += toHEX(buf[i]) + ' ';\n  }\n\n  return hex_str;\n}\n\nvar log = {\n  toHex: function toHex(num) {\n    return toHEX(num);\n  },\n  toHexarray: function toHexarray(buf) {\n    return strHEXarray(buf);\n  },\n  logHex: function logHex(num) {\n    console.log(toHEX(num));\n  },\n  logHexarray: function logHexarray(buf) {\n    console.log(strHEXarray(buf));\n  }\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (log);\n\n//# sourceURL=webpack://trial_nesjs/./src/NES/logger.js?");

/***/ }),

/***/ "./src/Nes.js":
/*!********************!*\
  !*** ./src/Nes.js ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"Nes\": () => (/* binding */ Nes)\n/* harmony export */ });\n/* harmony import */ var _NES_Display_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./NES/Display.js */ \"./src/NES/Display.js\");\n/* harmony import */ var _NES_Cpu_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./NES/Cpu.js */ \"./src/NES/Cpu.js\");\n/* harmony import */ var _NES_Ppu_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NES/Ppu.js */ \"./src/NES/Ppu.js\");\n/* harmony import */ var _NES_Rom_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./NES/Rom.js */ \"./src/NES/Rom.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\n\n// NES.js\n\n\n\n // クラス\n\nvar Nes = /*#__PURE__*/function () {\n  function Nes(canvas) {\n    _classCallCheck(this, Nes);\n\n    this.isNes = true;\n    this.display = new _NES_Display_js__WEBPACK_IMPORTED_MODULE_0__.Display(canvas);\n    this.cpu = new _NES_Cpu_js__WEBPACK_IMPORTED_MODULE_1__.Cpu(this);\n    this.ppu = new _NES_Ppu_js__WEBPACK_IMPORTED_MODULE_2__.Ppu(this);\n    this.rom = new _NES_Rom_js__WEBPACK_IMPORTED_MODULE_3__.Rom(this);\n  }\n\n  _createClass(Nes, [{\n    key: \"SetRom\",\n    value: function SetRom(arrayBuffer) {\n      if (!this.rom.SetRom(arrayBuffer)) {\n        // if failure\n        return false;\n      } else {\n        this.cpu.SetRom(this.rom);\n        this.ppu.SetRom(this.rom);\n      }\n\n      return this.rom;\n    }\n  }, {\n    key: \"init\",\n    value: function init() {}\n  }]);\n\n  return Nes;\n}();\n\n\n\n//# sourceURL=webpack://trial_nesjs/./src/Nes.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _styles_vendors_bootstrap_reboot_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/vendors/bootstrap-reboot.css */ \"./src/styles/vendors/bootstrap-reboot.css\");\n/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ \"./src/style.scss\");\n/* harmony import */ var _Nes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Nes.js */ \"./src/Nes.js\");\n/* harmony import */ var _NES_dump_nes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./NES/dump_nes.js */ \"./src/NES/dump_nes.js\");\n // import CSS files\n\n\n //\n// import JS files\n\n\n // 主要要素の取得\n\nvar canvas, dbg_console;\nvar nes, dump; // 初期化\n\nfunction init() {\n  canvas = document.querySelector('#NESdisplay');\n  nes = new _Nes_js__WEBPACK_IMPORTED_MODULE_2__.Nes(canvas);\n  window.nes = nes; // 画面の高さに応じてcanvasサイズ変更\n\n  nes.display.resizeCanvas(); // DOM イベントの初期化\n\n  initializeDomEvents(); // console\n\n  dbg_console = document.querySelector('#DBGconsole');\n  dump = new _NES_dump_nes_js__WEBPACK_IMPORTED_MODULE_3__.dump_nes(dbg_console);\n  window.dump = dump;\n} // ROM をNESにセットする\n\n\nfunction nes_rom_change(arraybuffer) {\n  dump.putMessage('Rom load...');\n\n  if (!nes.SetRom(arraybuffer)) {\n    console.error(\"Can't get rom data (perhaps you don't set ArrayBuffer arguments or it's not nes rom format)\");\n    return;\n  } else {\n    dump.putMessage('Header is ');\n    dump.putMessage(nes.rom.header_dump());\n    dump.putMessage(nes.rom.header_info());\n  } // nes.Init();\n  // nes.Run();\n\n} // ローカル上のROMを読み込み\n\n\nfunction read_local_file(fileObj, cb) {\n  dump.putMessage('read filename is ' + fileObj.name);\n  var reader = new FileReader();\n\n  reader.onload = function (e) {\n    cb(e.target.result);\n  };\n\n  reader.readAsArrayBuffer(fileObj);\n} // URL からROMを読み込み\n\n\nfunction read_url(url, cb) {\n  dump.putMessage('rom url is ' + url);\n  var request = new XMLHttpRequest();\n\n  request.onload = function () {\n    cb(request.response);\n  };\n\n  request.onerror = function (e) {\n    console.error(\"can't get rom binary. Error is \", e);\n  };\n\n  request.open('GET', url, true);\n  request.responseType = 'arraybuffer';\n  request.send(null);\n} // DOMのイベントを設定\n\n\nfunction initializeDomEvents() {\n  if (typeof window.FileReader !== \"undefined\") {\n    // ドラッグ&ドロップでROM読み込み\n    window.addEventListener(\"dragenter\", function (e) {\n      e.preventDefault();\n    }, false);\n    window.addEventListener(\"dragover\", function (e) {\n      e.preventDefault();\n    }, false);\n    window.addEventListener(\"drop\", function (e) {\n      e.preventDefault();\n      read_local_file(e.dataTransfer.files[0], nes_rom_change);\n    }, false); // プルダウンから ROM読み込み\n\n    document.getElementById(\"romload\").addEventListener(\"click\", function (e) {\n      e.preventDefault(); // ROM の場所\n\n      var url = document.getElementById(\"romlist\").value;\n      read_url(url, nes_rom_change);\n    }, false);\n  } // 画面の高さに応じてcanvasサイズ変更\n\n\n  window.addEventListener('resize', function () {\n    nes.display.resizeCanvas();\n  });\n}\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  init();\n});\n\n//# sourceURL=webpack://trial_nesjs/./src/main.js?");

/***/ }),

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://trial_nesjs/./src/style.scss?");

/***/ }),

/***/ "./src/styles/vendors/bootstrap-reboot.css":
/*!*************************************************!*\
  !*** ./src/styles/vendors/bootstrap-reboot.css ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://trial_nesjs/./src/styles/vendors/bootstrap-reboot.css?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/main.js");
/******/ 	
/******/ })()
;