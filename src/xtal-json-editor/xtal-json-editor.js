///<reference path="../../node_modules/@types/jsoneditor/index.d.ts"/>
//type JSONEditor =  jsoneditor.JSONEditor;
var xtal;
(function (xtal) {
    var exports;
    (function (exports) {
        customElements.whenDefined('xtal-ball').then(() => {
            /**
            * Polymer based web component wrapper around the JSON Editor api.
            *
            * Code can be found at https://github.com/josdejong/jsoneditor
            */
            class XtalJsonEditor extends Polymer.Element {
                static get is() { return 'xtal-json-editor'; }
                static get properties() {
                    return {
                        /**
                        * The expression that points to an object to edit.
                        */
                        watch: {
                            type: Object,
                            observer: 'onPropsChange'
                        },
                        /**
                         * JsonEditor options, implements jsoneditor.JSONEditorOptions
                         */
                        options: {
                            type: Object,
                            observer: 'onPropsChange'
                        }
                    };
                }
                get jsonEditor() {
                    return this._jsonEditor;
                }
                onPropsChange(newVal) {
                    if (!this.watch)
                        return;
                    this.$.xcontainer.innerHTML = '';
                    this._jsonEditor = new JSONEditor(this.$.xcontainer, this.options);
                    this._jsonEditor.set(this.watch);
                }
            }
            customElements.define(XtalJsonEditor.is, XtalJsonEditor);
        });
    })(exports = xtal.exports || (xtal.exports = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-json-editor.js.map