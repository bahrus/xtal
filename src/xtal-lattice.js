var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        var XtalLattice = (function (_super) {
            __extends(XtalLattice, _super);
            function XtalLattice() {
                var _this = _super.call(this) || this;
                _this._data = _this.data;
                return _this;
            }
            XtalLattice.prototype.connectedCallback = function () {
                if (this._data !== undefined)
                    this.updateDOM();
            };
            Object.defineProperty(XtalLattice.prototype, "data", {
                get: function () {
                    return this._data;
                },
                set: function (newVal) {
                    this._data = newVal;
                    if (this._data !== undefined)
                        this.updateDOM();
                },
                enumerable: true,
                configurable: true
            });
            XtalLattice.prototype.updateDOM = function () {
                var _this = this;
                if (this._els === undefined) {
                    this._els = [];
                    var els_1 = this._els;
                    this.querySelectorAll('[data-rc]').forEach(function (el) {
                        var rc = el.dataset.rc;
                        var rcArr = rc.split(',').map(function (s) { return parseInt(s); });
                        var rowNum = rcArr[0];
                        if (els_1[rowNum] === undefined)
                            els_1[rowNum] = [];
                        els_1[rowNum][rcArr[1]] = el;
                    });
                }
                this._data.forEach(function (row, idx) {
                    row.forEach(function (cell, jdx) {
                        var el = _this._els[idx][jdx];
                        el.innerText = cell;
                    });
                });
            };
            return XtalLattice;
        }(HTMLElement));
        customElements.define('xtal-lattice', XtalLattice);
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-lattice.js.map