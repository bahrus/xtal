var xtal;
(function (xtal) {
    var exports;
    (function (exports) {
        customElements.whenDefined('xtal-ball').then(() => {
            class XtalJsonEditor extends Polymer.Element {
                static get is() { return 'xtal-json-editor'; }
                static get properties() {
                    return {
                        /**
                        * The expression to observe and transform when it changes.
                        */
                        watch: {
                            type: Object,
                            observer: 'onWatchChange'
                        },
                    };
                }
                onWatchChange(newVal) {
                    const options = {};
                    this.$.xcontainer.innerHTML = '';
                    const editor = new JSONEditor(this.$.xcontainer, options);
                    editor.set(newVal);
                    // // get json
                    // var json = editor.get();
                }
            }
            customElements.define(XtalJsonEditor.is, XtalJsonEditor);
        });
    })(exports = xtal.exports || (xtal.exports = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-json-editor.js.map