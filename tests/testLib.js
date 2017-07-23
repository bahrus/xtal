define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.sqrt = Math.sqrt;
    function square(x) {
        return x * x;
    }
    exports.square = square;
    function diag(x, y) {
        return exports.sqrt(square(x) + square(y));
    }
    exports.diag = diag;
});
//# sourceMappingURL=testLib.js.map