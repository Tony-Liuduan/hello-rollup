(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.experience = {}));
}(this, (function (exports) { 'use strict';

    var setCookie = function setCookie(key, value) {
      document.cookie = "".concat(key, "=").concat(value, ";");
    };
    var getCookie = function getCookie(key) {
      var items = document.cookie.split('; ');

      for (var i = 0; i < items.length; i += 1) {
        var item = items[i].split('=');

        if (key === item[0] && item.length === 2) {
          return decodeURIComponent(item[1]);
        }
      }

      return '';
    };

    exports.getCookie = getCookie;
    exports.setCookie = setCookie;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=tsBundle.js.map
