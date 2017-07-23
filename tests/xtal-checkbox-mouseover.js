var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        class XtalCheckboxMouseover extends HTMLElement {
            handleMouseOver() {
                console.log(this);
            }
            init() {
                this.addEventListener('mouseover', this.handleMouseOver);
            }
        }
        customElements.define('xtal-checkbox-mouseover', XtalCheckboxMouseover);
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-checkbox-mouseover.js.map