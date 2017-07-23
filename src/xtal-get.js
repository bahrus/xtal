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
        var XtalGet = (function (_super) {
            __extends(XtalGet, _super);
            function XtalGet() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            XtalGet.prototype.connectedCallback = function () {
                var _this = this;
                var href = this.getAttribute('href');
                fetch(href).then(function (resp) {
                    resp.json().then(function (val) {
                        _this.parentNode['data'] = val;
                    });
                });
            };
            return XtalGet;
        }(HTMLElement));
        customElements.define('xtal-get', XtalGet);
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-get.js.map