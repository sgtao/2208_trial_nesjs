/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/NES.js":
/*!********************!*\
  !*** ./src/NES.js ***!
  \********************/
/***/ ((module) => {

eval("function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\n\n// NES.js\n// 定数\nvar DISP_WIDTH = 256;\nvar DISP_HEIGHT = 224; // クラス\n\nvar NES = /*#__PURE__*/function () {\n  function NES(canvas) {\n    _classCallCheck(this, NES);\n\n    // requestAnimationFrame 対応ブラウザのみ遊べます\n    if (typeof window.requestAnimationFrame === \"undefined\") {\n      window.alert('use a brower that supports requestAnimationFrame method');\n      return;\n    } // 画面データ\n\n\n    this.ImageData = null;\n    this.ctx = canvas.getContext(\"2d\");\n    this.ctx_multiple = 1;\n  }\n\n  _createClass(NES, [{\n    key: \"initCanvas\",\n    value: function initCanvas() {\n      // Canvasを初期化(真っ黒画面にする)\n      if (!this.ctx) {\n        return false;\n      }\n\n      var disp_width = DISP_WIDTH * this.ctx_multiple;\n      var disp_height = DISP_HEIGHT * this.ctx_multiple;\n      this.ImageData = this.ctx.createImageData(disp_width, disp_height);\n\n      for (var i = 0; i < disp_width * disp_height * 4; i += 4) {\n        this.ImageData.data[i + 3] = 0xFF;\n      }\n\n      this.ctx.putImageData(this.ImageData, 0, 0);\n      return true;\n    }\n  }]);\n\n  return NES;\n}();\n\nmodule.exports = NES;\n\n//# sourceURL=webpack://trial_nesjs/./src/NES.js?");

/***/ }),

/***/ "./src/NES/debuggerNES.js":
/*!********************************!*\
  !*** ./src/NES/debuggerNES.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"DBGROM\": () => (/* binding */ DBGROM)\n/* harmony export */ });\n/* harmony import */ var _logger__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./logger */ \"./src/NES/logger.js\");\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\nfunction _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }\n\nfunction _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, \"prototype\", { writable: false }); return Constructor; }\n\n// debuggerNES.js\n // 定数\n// const DBG_Level = 2; // 1 is short message, 2 is long message\n\nvar DBG_Level = 1; // 1 is short message, 2 is long message\n// クラス\n\nvar DBGROM = /*#__PURE__*/function () {\n  function DBGROM(nesBuffer, textarea_charROM) {\n    _classCallCheck(this, DBGROM);\n\n    var nesROM = rom_parse(nesBuffer);\n\n    if (nesROM === false) {\n      textarea_charROM.value = 'This file is not NES format.';\n      return;\n    }\n\n    this.headerROM = nesROM.headerROM;\n    this.programROM = nesROM.programROM;\n    this.characterROM = nesROM.characterROM; // show ROM data.\n\n    this.display_charROM(textarea_charROM);\n  }\n\n  _createClass(DBGROM, [{\n    key: \"display_charROM\",\n    value: function display_charROM(textarea_charROM) {\n      // console.log('nesROM : ', nesROM);\n      // console.log('isHorizontalMirror : ', nesROM.isHorizontalMirror);\n      // console.log(nesROM.programROM);\n      console.log('headerROM:');\n      _logger__WEBPACK_IMPORTED_MODULE_0__[\"default\"].logHexarray(this.headerROM); // console.log('programROM:');\n      // log.log_hexarray(nesROM.programROM);\n      // console.log('characterROM:');\n      // log.log_hexarray(nesROM.characterROM);\n\n      textarea_charROM.value = '';\n      textarea_charROM.value += 'header : ' + _logger__WEBPACK_IMPORTED_MODULE_0__[\"default\"].toHexarray(this.headerROM) + '\\n';\n      var program_pages = this.headerROM[4];\n      var charrom_pages = this.headerROM[5];\n      var mapper = (this.headerROM[6] & 0xF0) >> 4 | this.headerROM[7] & 0xF0;\n      textarea_charROM.value += 'program pages = ' + _logger__WEBPACK_IMPORTED_MODULE_0__[\"default\"].toHex(program_pages) + '\\n';\n      textarea_charROM.value += 'charrom pages = ' + _logger__WEBPACK_IMPORTED_MODULE_0__[\"default\"].toHex(charrom_pages) + '\\n';\n      textarea_charROM.value += 'mapper = ' + mapper + '\\n';\n\n      if (DBG_Level >= 2) {\n        textarea_charROM.value += '------------------\\n';\n        textarea_charROM.value += this.toHEX_progrom();\n        textarea_charROM.value += '------------------\\n';\n        textarea_charROM.value += this.toHEX_charrom();\n        textarea_charROM.value += '------------------\\n';\n      }\n    }\n  }, {\n    key: \"toHEX_progrom\",\n    value: function toHEX_progrom() {\n      var chardata;\n      var progrom_hex = '';\n      var PROGRAM_ROM_SIZE = 0x4000; // unit size is 16KB\n\n      var spritesNum = PROGRAM_ROM_SIZE * this.headerROM[4] / 16; // ROM_SIZE * NUM_prog_pages / 16Byte\n\n      if (DBG_Level <= 1) return progrom_hex;\n      progrom_hex += 'PROGRAM_ROM_DATA:\\n';\n\n      for (var i = 0; i < spritesNum; i++) {\n        chardata = this.programROM.slice(i * 16, i * 16 + 16);\n        progrom_hex += _logger__WEBPACK_IMPORTED_MODULE_0__[\"default\"].toHex(i) + ' : ' + _logger__WEBPACK_IMPORTED_MODULE_0__[\"default\"].toHexarray(chardata) + '\\n';\n      }\n\n      return progrom_hex;\n    }\n  }, {\n    key: \"toHEX_charrom\",\n    value: function toHEX_charrom() {\n      var chardata;\n      var charrom_hex = '';\n      var CHARACTOR_ROM_SIZE = 0x2000; // unit size is 8KB\n\n      var spritesNum = CHARACTOR_ROM_SIZE * this.headerROM[5] / 16; // ROM_SIZE * NUM_char_pages / 16Byte\n\n      if (DBG_Level <= 1) return charrom_hex;\n      charrom_hex += 'CHARACTOR_ROM_DATA:\\n';\n\n      for (var i = 0; i < spritesNum; i++) {\n        chardata = this.characterROM.slice(i * 16, i * 16 + 16);\n        charrom_hex += _logger__WEBPACK_IMPORTED_MODULE_0__[\"default\"].toHex(i) + ' : ' + _logger__WEBPACK_IMPORTED_MODULE_0__[\"default\"].toHexarray(chardata) + '\\n';\n      }\n\n      return charrom_hex;\n    }\n  }]);\n\n  return DBGROM;\n}();\n\nfunction rom_parse(nesBuffer) {\n  var NES_HEADER_SIZE = 0x0010;\n  var PROGRAM_ROM_SIZE = 0x4000;\n  var CHARACTER_ROM_SIZE = 0x2000;\n  var nes = new Uint8Array(nesBuffer); // log.hexarray(nes);\n\n  if ([].slice.call(nes, 0, 3).map(function (v) {\n    return String.fromCharCode(v);\n  }).join('') !== 'NES') {\n    console.log('This file is not NES format.');\n    return false;\n  }\n\n  var programROMPages = nes[4];\n  var characterROMPages = nes[5];\n  var isHorizontalMirror = !(nes[6] & 0x01);\n  var mapper = (nes[6] & 0xF0) >> 4 | nes[7] & 0xF0;\n  console.info('prom pages =', programROMPages);\n  console.info('crom pages =', characterROMPages);\n  console.info('mapper', mapper);\n  var characterROMStart = NES_HEADER_SIZE + programROMPages * PROGRAM_ROM_SIZE;\n  var characterROMEnd = characterROMStart + characterROMPages * CHARACTER_ROM_SIZE; // console.log('prom pages = ', programROMPages);\n\n  var nesROM = {\n    isHorizontalMirror: isHorizontalMirror,\n    headerROM: nes.slice(0, NES_HEADER_SIZE - 1),\n    programROM: nes.slice(NES_HEADER_SIZE, characterROMStart - 1),\n    characterROM: nes.slice(characterROMStart, characterROMEnd - 1)\n  };\n  return nesROM;\n}\n\n//# sourceURL=webpack://trial_nesjs/./src/NES/debuggerNES.js?");

/***/ }),

/***/ "./src/NES/logger.js":
/*!***************************!*\
  !*** ./src/NES/logger.js ***!
  \***************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"log\": () => (/* binding */ log),\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* logger.js */\n\n/**\r\n * バイト配列を16進数表記文字列に変換する\r\n */\nfunction toHEX(num) {\n  return num < 16 ? '0' + num.toString(16).toUpperCase() : num.toString(16).toUpperCase();\n}\n\nfunction strHEXarray(buf) {\n  var hex_str = '';\n\n  for (var i in buf) {\n    hex_str += toHEX(buf[i]) + ' ';\n  }\n\n  return hex_str;\n}\n\nvar log = {\n  toHex: function toHex(num) {\n    return toHEX(num);\n  },\n  toHexarray: function toHexarray(buf) {\n    return strHEXarray(buf);\n  },\n  logHex: function logHex(num) {\n    console.log(toHEX(num));\n  },\n  logHexarray: function logHexarray(buf) {\n    console.log(strHEXarray(buf));\n  }\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (log);\n\n//# sourceURL=webpack://trial_nesjs/./src/NES/logger.js?");

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _styles_vendors_bootstrap_reboot_css__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/vendors/bootstrap-reboot.css */ \"./src/styles/vendors/bootstrap-reboot.css\");\n/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./style.scss */ \"./src/style.scss\");\n/* harmony import */ var _NES__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./NES */ \"./src/NES.js\");\n/* harmony import */ var _NES__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_NES__WEBPACK_IMPORTED_MODULE_2__);\n/* harmony import */ var _NES_debuggerNES__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./NES/debuggerNES */ \"./src/NES/debuggerNES.js\");\n // import CSS files\n\n\n //\n// import JS files\n// var NES = require('./NES');\n\n\n // 主要要素の取得\n// canvas\n\nvar canvas = document.querySelector('#NESdisplay');\nvar canvas_width = 256;\nvar canvas_height = 224; // nes\n\nvar nes = new (_NES__WEBPACK_IMPORTED_MODULE_2___default())(canvas); // console\n\nvar dbg_console = document.querySelector('#DBGconsole');\nvar dbg_textarea = dbg_console.querySelector('.textArea'); // 初期化\n\nwindow.onload = function () {\n  // 画面の高さに応じてcanvasサイズ変更\n  resize_canvas(); // DOM イベントの初期化\n\n  initialize_dom_events();\n}; // NES画面のリサイズ\n\n\nfunction resize_canvas() {\n  var magnification = Math.floor(window.innerWidth * 0.9 / canvas_width);\n\n  if (nes.ctx_multiple != magnification) {\n    console.log(\"previous canvas size \".concat(canvas_width, \", current windows width(x0.9)= \").concat(window.innerWidth * 0.9));\n    console.log(\"change magnification to \".concat(magnification));\n    nes.ctx_multiple = magnification;\n    canvas.width = canvas_width * magnification;\n    canvas.height = canvas_height * magnification;\n    canvas.style.width = canvas_width * magnification;\n    canvas.style.height = canvas_height * magnification;\n  }\n\n  nes.initCanvas();\n} // ROM をNESにセットする\n\n\nfunction nes_rom_change(arraybuffer) {\n  var nesrom = new _NES_debuggerNES__WEBPACK_IMPORTED_MODULE_3__.DBGROM(arraybuffer, dbg_textarea);\n  console.log(nesrom.toHEX_progrom());\n  console.log(nesrom.toHEX_charrom()); // if (!nes.SetRom(arraybuffer)) {\n  //   console.error(\"Can't get rom data (perhaps you don't set ArrayBuffer arguments or it's not nes rom format)\");\n  //   return;\n  // }\n  // nes.Init();\n  // nes.Run();\n} // ローカル上のROMを読み込み\n\n\nfunction read_local_file(fileObj, cb) {\n  console.log('read filename is ' + fileObj.name);\n  var reader = new FileReader();\n\n  reader.onload = function (e) {\n    cb(e.target.result);\n  };\n\n  reader.readAsArrayBuffer(fileObj);\n} // URL からROMを読み込み\n\n\nfunction read_url(url, cb) {\n  console.log('rom url is ' + url);\n  var request = new XMLHttpRequest();\n\n  request.onload = function () {\n    cb(request.response);\n  };\n\n  request.onerror = function (e) {\n    console.error(\"can't get rom binary. Error is \", e);\n  };\n\n  request.open('GET', url, true);\n  request.responseType = 'arraybuffer';\n  request.send(null);\n} // DOMのイベントを設定\n\n\nfunction initialize_dom_events() {\n  if (typeof window.FileReader !== \"undefined\") {\n    // ドラッグ&ドロップでROM読み込み\n    window.addEventListener(\"dragenter\", function (e) {\n      e.preventDefault();\n    }, false);\n    window.addEventListener(\"dragover\", function (e) {\n      e.preventDefault();\n    }, false);\n    window.addEventListener(\"drop\", function (e) {\n      e.preventDefault();\n      read_local_file(e.dataTransfer.files[0], nes_rom_change);\n    }, false); // プルダウンから ROM読み込み\n\n    document.getElementById(\"romload\").addEventListener(\"click\", function (e) {\n      e.preventDefault(); // ROM の場所\n\n      var url = document.getElementById(\"romlist\").value;\n      read_url(url, nes_rom_change);\n    }, false);\n  } // 画面の高さに応じてcanvasサイズ変更\n\n\n  window.addEventListener('resize', resize_canvas);\n}\n\n//# sourceURL=webpack://trial_nesjs/./src/main.js?");

/***/ }),

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n// extracted by mini-css-extract-plugin\n\n\n//# sourceURL=webpack://trial_nesjs/./src/style.scss?");

/***/ }),

/***/ "./src/styles/vendors/bootstrap-reboot.css":
/*!*************************************************!*\
  !*** ./src/styles/vendors/bootstrap-reboot.css ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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