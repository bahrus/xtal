var xtal;
(function (xtal) {
    class XtalLite extends HTMLElement {
        connectedCallback() {
            //super.connectedCallback();
            const id = this.tagName.toLowerCase();
            this.innerHTML = xtal['domLite'][id];
        }
    }
    xtal.XtalLite = XtalLite;
    customElements.define('xtal-lite', XtalLite);
    class DOMLite extends HTMLElement {
        connectedCallback() {
            const innerHTML = this.innerHTML;
            if (!xtal['domLite'])
                xtal['domLite'] = {};
            xtal['domLite'][this.id] = innerHTML;
        }
    }
    customElements.define('dom-lite', DOMLite);
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-lite.js.map