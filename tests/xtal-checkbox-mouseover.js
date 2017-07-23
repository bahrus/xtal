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
        var XtalCheckboxMouseover = (function (_super) {
            __extends(XtalCheckboxMouseover, _super);
            function XtalCheckboxMouseover() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            XtalCheckboxMouseover.prototype.handleMouseOver = function () {
                console.log(this);
            };
            XtalCheckboxMouseover.prototype.init = function () {
                this.addEventListener('mouseover', this.handleMouseOver);
            };
            return XtalCheckboxMouseover;
        }(HTMLElement));
        customElements.define('xtal-checkbox-mouseover', XtalCheckboxMouseover);
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-checkbox-mouseover.js.map