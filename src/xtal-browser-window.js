var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        class XtalBrowserWindow extends Polymer.Element {
            constructor() {
                super();
                this.linkOnly = false;
                this.sandBox = '';
                this.windowTop = 0;
                this.width = '';
                this.collapsedText = '►';
                this.clicked = false;
            }
            static get is() { return 'xtal-browser-window'; }
            static get properties() {
                return {
                    linkOnly: {
                        type: Boolean
                    },
                    sandBox: {
                        type: String
                    },
                    windowTop: {
                        type: Number
                    },
                    width: {
                        type: String,
                        value: '90%'
                    },
                    collapsedText: {
                        type: String,
                        value: '►'
                    },
                    clicked: {
                        type: Boolean,
                        notify: true,
                        reflectToAttribute: true
                    }
                };
            }
            connectedCallback() {
                super.connectedCallback();
            }
            ready() {
                super.ready();
                var aLink = this.children[0];
                aLink.target = '_blank';
                if (this.sandBox) {
                    var iFrame = this.$.iframe;
                    iFrame.setAttribute('sandbox', this.sandBox);
                }
            }
            handleOnLoad() {
                this.$.div_iframe.scrollTop = this.windowTop;
            }
            markClicked() {
                this.clicked = true;
            }
            toggleIFrame() {
                this.clicked = true;
                var aLink = this.children[0];
                if (this.linkOnly) {
                    window.open(aLink.href);
                    return;
                }
                var iFrame = this.$.iframe;
                var toggleButton = this.$.toggle_button;
                var divIFrame = this.$.div_iframe;
                var div_noFrame = this.$.div_noFrame;
                if (divIFrame.style.display === 'none') {
                    divIFrame.style.display = 'block';
                    div_noFrame.style.display = 'none';
                    iFrame.src = aLink.href;
                    toggleButton.innerText = '▼';
                }
                else {
                    iFrame.src = 'about:blank';
                    divIFrame.style.display = 'none';
                    div_noFrame.style.display = 'block';
                    toggleButton.innerText = this.collapsedText;
                }
            }
        }
        customElements.define(XtalBrowserWindow.is, XtalBrowserWindow);
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-browser-window.js.map