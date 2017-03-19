var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        class XtalInlineIFrame extends Polymer.Element {
            static get is() { return 'xtal-inline-iframe'; }
            ready() {
                super.ready();
                const _this = this;
                //setTimeout(() =>{
                console.log(this.innerHTML);
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
                //}, 1000)
            }
        }
        customElements.define(XtalInlineIFrame.is, XtalInlineIFrame);
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-inline-iframe.js.map