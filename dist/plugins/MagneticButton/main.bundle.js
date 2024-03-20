/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 450:
/***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {


// EXTERNAL MODULE: ./node_modules/gsap/index.js + 2 modules
var gsap = __webpack_require__(880);
;// CONCATENATED MODULE: ../../common/utils/Utils.js
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var Utils = /*#__PURE__*/function () {
  function Utils() {
    _classCallCheck(this, Utils);
  }
  return _createClass(Utils, null, [{
    key: "midpoint",
    value: function midpoint(x1, y1, x2, y2) {
      return {
        x: (x1 + x2) / 2,
        y: (y1 + y2) / 2
      };
    }
  }, {
    key: "rgbToRgba",
    value: function rgbToRgba() {}
  }, {
    key: "rgbToHex",
    value: function rgbToHex(r, g, b) {
      r = r.toString(16);
      g = g.toString(16);
      b = b.toString(16);
      if (r.length == 1) r = "0" + r;
      if (g.length == 1) g = "0" + g;
      if (b.length == 1) b = "0" + b;
      return "#" + r + g + b;
    }
  }, {
    key: "hexToRgb",
    value: function hexToRgb(hex) {
      var r = parseInt(hex.substring(1, 3), 16);
      var g = parseInt(hex.substring(3, 5), 16);
      var b = parseInt(hex.substring(5, 7), 16);
      return {
        r: r,
        g: g,
        b: b
      };
    }
  }, {
    key: "hexToRgba",
    value: function hexToRgba(hex, alpha) {
      var r = parseInt(hex.substring(1, 3), 16);
      var g = parseInt(hex.substring(3, 5), 16);
      var b = parseInt(hex.substring(5, 7), 16);
      return [r, g, b, alpha || 1.0];
    }
  }, {
    key: "lightenHex",
    value: function lightenHex(hex, amount) {
      var _this$hexToRgb = this.hexToRgb(hex),
        r = _this$hexToRgb.r,
        g = _this$hexToRgb.g,
        b = _this$hexToRgb.b;

      // Ensure amount is not greater than 100
      amount = amount > 100 ? 100 : amount;

      // Calculate the adjustment value
      var adjust = amount / 100 * 255;

      // Adjust each color component
      var r2 = Math.min(255, r + adjust);
      var g2 = Math.min(255, g + adjust);
      var b2 = Math.min(255, b + adjust);

      // Convert back to hex and return
      return "#" + [r2, g2, b2].map(function (x) {
        var hex = Math.round(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      }).join("");
    }
  }, {
    key: "getPixelColor",
    value: function getPixelColor(img, x, y, format, opacity) {
      var px = img.get(x, y);
      var _final;
      if (!Array.isArray(px)) return;
      switch (format) {
        case "rgb":
          _final = "rgb(".concat([px[0]], ", ").concat(px[1], ", ").concat(px[2], ")");
          break;
        case "rgba":
          _final = "rgba(".concat([px[0]], ", ").concat(px[1], ", ").concat(px[2], ", ").concat(opacity, ")");
          break;
        default:
          _final = Utils.rgbToHex(px[0], px[1], px[2]);
      }
      return _final;
    }
  }, {
    key: "getRandomJSONValue",
    value: function getRandomJSONValue(json) {
      // Check if the input is a string and parse it, otherwise use it directly
      var obj = typeof json === "string" ? JSON.parse(json) : json;

      // Extract the values from the object
      var values = Object.values(obj);

      // Generate a random index based on the number of values
      var randomIndex = Math.floor(Math.random() * values.length);

      // Return a random value
      return values[randomIndex];
    }
  }, {
    key: "drawPoint",
    value: function drawPoint(x, y) {
      stroke("black");
      strokeWeight(50);
      point(x, y);
      noStroke();
    }
  }, {
    key: "getRandomInt",
    value: function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }
  }, {
    key: "isTouchScreen",
    value: function isTouchScreen() {
      return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }
  }]);
}();
/* harmony default export */ const utils_Utils = (Utils);
// EXTERNAL MODULE: ../../../../../node_modules/lodash/uniqueId.js
var uniqueId = __webpack_require__(480);
var uniqueId_default = /*#__PURE__*/__webpack_require__.n(uniqueId);
;// CONCATENATED MODULE: ../../common/utils/StringUtils.js
function StringUtils_typeof(o) { "@babel/helpers - typeof"; return StringUtils_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, StringUtils_typeof(o); }
function StringUtils_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function StringUtils_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, StringUtils_toPropertyKey(descriptor.key), descriptor); } }
function StringUtils_createClass(Constructor, protoProps, staticProps) { if (protoProps) StringUtils_defineProperties(Constructor.prototype, protoProps); if (staticProps) StringUtils_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function StringUtils_toPropertyKey(t) { var i = StringUtils_toPrimitive(t, "string"); return "symbol" == StringUtils_typeof(i) ? i : i + ""; }
function StringUtils_toPrimitive(t, r) { if ("object" != StringUtils_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != StringUtils_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var StringUtils = /*#__PURE__*/function () {
  function StringUtils() {
    StringUtils_classCallCheck(this, StringUtils);
  }
  return StringUtils_createClass(StringUtils, null, [{
    key: "pascalToKebab",
    value: function pascalToKebab(inputString) {
      return inputString.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
    }
  }, {
    key: "pascalToCamel",
    value: function pascalToCamel(str) {
      if (!str) return "";
      return str.charAt(0).toLowerCase() + str.slice(1);
    }
  }]);
}();
/* harmony default export */ const utils_StringUtils = (StringUtils);
;// CONCATENATED MODULE: ../../common/utils/Plugin.js
function Plugin_typeof(o) { "@babel/helpers - typeof"; return Plugin_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, Plugin_typeof(o); }
function Plugin_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function Plugin_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, Plugin_toPropertyKey(descriptor.key), descriptor); } }
function Plugin_createClass(Constructor, protoProps, staticProps) { if (protoProps) Plugin_defineProperties(Constructor.prototype, protoProps); if (staticProps) Plugin_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _defineProperty(obj, key, value) { key = Plugin_toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function Plugin_toPropertyKey(t) { var i = Plugin_toPrimitive(t, "string"); return "symbol" == Plugin_typeof(i) ? i : i + ""; }
function Plugin_toPrimitive(t, r) { if ("object" != Plugin_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != Plugin_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }


var Plugin = /*#__PURE__*/function () {
  function Plugin(el) {
    Plugin_classCallCheck(this, Plugin);
    this.id = uniqueId_default()("p");
    this.name = utils_StringUtils.pascalToCamel("Plugin" + this.constructor.name);
    this.container = el;
    this.attributes = this.container.dataset;
    this.container.dataset[this.name] = this.id;
    Plugin.instances.push(this);
  }
  return Plugin_createClass(Plugin, [{
    key: "getAttr",
    value: function getAttr(key) {
      return this.container.dataset[key];
    }
  }, {
    key: "setAttr",
    value: function setAttr(key, value) {
      this.container.dataset[key] = value;
    }
  }, {
    key: "destroy",
    value: function destroy() {
      delete this;
    }
  }], [{
    key: "get",
    value: function get(name) {
      return Plugin.instances.filter(function (x) {
        return x.name == name;
      });
    }
  }]);
}();
_defineProperty(Plugin, "instances", []);
/* harmony default export */ const utils_Plugin = (Plugin);
;// CONCATENATED MODULE: ./src/MagneticButton.js
function MagneticButton_typeof(o) { "@babel/helpers - typeof"; return MagneticButton_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, MagneticButton_typeof(o); }
function MagneticButton_classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function MagneticButton_defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, MagneticButton_toPropertyKey(descriptor.key), descriptor); } }
function MagneticButton_createClass(Constructor, protoProps, staticProps) { if (protoProps) MagneticButton_defineProperties(Constructor.prototype, protoProps); if (staticProps) MagneticButton_defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function MagneticButton_toPropertyKey(t) { var i = MagneticButton_toPrimitive(t, "string"); return "symbol" == MagneticButton_typeof(i) ? i : i + ""; }
function MagneticButton_toPrimitive(t, r) { if ("object" != MagneticButton_typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != MagneticButton_typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _callSuper(t, o, e) { return o = _getPrototypeOf(o), _possibleConstructorReturn(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], _getPrototypeOf(t).constructor) : o.apply(t, e)); }
function _possibleConstructorReturn(self, call) { if (call && (MagneticButton_typeof(call) === "object" || typeof call === "function")) { return call; } else if (call !== void 0) { throw new TypeError("Derived constructors may only return object or undefined"); } return _assertThisInitialized(self); }
function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf.bind() : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }
function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); Object.defineProperty(subClass, "prototype", { writable: false }); if (superClass) _setPrototypeOf(subClass, superClass); }
function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }




// Source: https://codepen.io/tdesero/pen/RmoxQg
var MagneticButton = /*#__PURE__*/function (_Plugin) {
  function MagneticButton(el) {
    var _this;
    MagneticButton_classCallCheck(this, MagneticButton);
    _this = _callSuper(this, MagneticButton, [el]);
    _this.setAttr("strength", "100");
    if (!utils_Utils.isTouchScreen()) {
      _this.initListeners();
    }
    return _this;
  }
  _inherits(MagneticButton, _Plugin);
  return MagneticButton_createClass(MagneticButton, [{
    key: "move",
    value: function move(clientX, clientY) {
      var button = this.container;
      var _this$bounds = this.bounds(),
        left = _this$bounds.left,
        top = _this$bounds.top,
        width = _this$bounds.width,
        height = _this$bounds.height;
      var strength = this.getAttr("strength");
      gsap/* default */.Ay.to(button, 1.5, {
        x: ((clientX - left) / width - 0.5) * strength,
        y: ((clientY - top) / height - 0.5) * strength,
        rotate: "0.001deg",
        ease: "Power4.easeOut"
      });
    }
  }, {
    key: "onMouseLeave",
    value: function onMouseLeave() {
      gsap/* default */.Ay.to(this.container, 1.5, {
        x: 0,
        y: 0,
        ease: "Elastic.easeOut"
      });
    }
  }, {
    key: "onMouseMove",
    value: function onMouseMove(clientX, clientY) {
      this.move(clientX, clientY);
    }
  }, {
    key: "onMouseEnter",
    value: function onMouseEnter() {}
  }, {
    key: "handleMouseEnter",
    value: function handleMouseEnter(e) {
      this.isHovering = true;
      this.onMouseEnter();
    }
  }, {
    key: "handleMouseLeave",
    value: function handleMouseLeave() {
      this.isHovering = false;
      this.onMouseLeave();
    }
  }, {
    key: "handleMouseMove",
    value: function handleMouseMove(e) {
      this.onMouseMove(e.clientX, e.clientY);
    }
  }, {
    key: "top",
    value: function top() {
      return this.container.getBoundingClientRect().top;
    }
  }, {
    key: "left",
    value: function left() {
      return this.container.getBoundingClientRect.left;
    }
  }, {
    key: "right",
    value: function right() {
      var rect = element.getBoundingClientRect();
      var viewportWidth = window.innerWidth;
      var distanceToRight = viewportWidth - rect.right;
      return distanceToRight;
    }
  }, {
    key: "bottom",
    value: function bottom() {
      return this.container.getBoundingClientRect().right;
    }
  }, {
    key: "height",
    value: function height() {
      return this.container.getBoundingClientRect().height;
    }
  }, {
    key: "width",
    value: function width() {
      return this.container.getBoundingClientRect().width;
    }
  }, {
    key: "bounds",
    value: function bounds() {
      return this.container.getBoundingClientRect();
    }
  }, {
    key: "initListeners",
    value: function initListeners() {
      var enterHandler = this.handleMouseEnter.bind(this);
      var leaveHandler = this.handleMouseLeave.bind(this);
      var moveHandler = this.handleMouseMove.bind(this);
      this.container.addEventListener("mouseenter", enterHandler);
      this.container.addEventListener("mouseleave", leaveHandler);
      this.container.addEventListener("mousemove", moveHandler);
    }
  }]);
}(utils_Plugin);
/* harmony default export */ const src_MagneticButton = (MagneticButton);
;// CONCATENATED MODULE: ./src/index.js



var init = function init() {
  window.addEventListener("load", function () {
    var nodes = Array.from(document.querySelectorAll(".sqs-block-button"));
    nodes.forEach(function (node) {
      new src_MagneticButton(node);
    });
  });
};
init();

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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			792: 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkmagnetic_button"] = self["webpackChunkmagnetic_button"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [587], () => (__webpack_require__(450)))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=main.bundle.js.map