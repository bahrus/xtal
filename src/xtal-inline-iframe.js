var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        class XtalInlineIFrame extends Polymer.Element {
            static get is() { return 'xtal-inline-iframe'; }
            static get properties() {
                return {
                    passObject: {
                        type: Object,
                        observer: 'onObjectChange'
                    },
                    passPropertyKey: {
                        type: String,
                    },
                    passTo: {
                        type: String
                    }
                };
            }
            ready() {
                super.ready();
                const _this = this;
                let innerHTML;
                if (this.children.length === 1) {
                    const srcRoot = _this.children[0];
                    if (srcRoot.tagName === 'TEMPLATE') {
                        const htmlToEmbed = document.importNode(srcRoot, true);
                        innerHTML = htmlToEmbed.innerHTML;
                    }
                    else {
                        innerHTML = this.innerHTML;
                    }
                }
                else {
                    innerHTML = this.innerHTML;
                }
                console.log('innerHML = ' + innerHTML);
                const iframe = _this.$.target;
                innerHTML = `
            <html>
                <body>${innerHTML}</body>
            </html>
            `;
                iframe.contentWindow.document.open();
                iframe.contentWindow.document.write(innerHTML);
                iframe.contentWindow.document.close();
            }
            onObjectChange(newVal) {
                const targetElements = this.$.target.contentWindow.document.querySelectorAll(this['passTo']);
                for (let i = 0, ii = targetElements.length; i < ii; i++) {
                    const targetElement = targetElements[i];
                    debugger;
                    targetElement[this['passPropertyKey']] = newVal;
                }
            }
        }
        customElements.define(XtalInlineIFrame.is, XtalInlineIFrame);
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-inline-iframe.js.map