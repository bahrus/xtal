///<reference path="../../node_modules/@types/jsoneditor/index.d.ts"/>
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
//type JSONEditor =  jsoneditor.JSONEditor;
var xtal;
(function (xtal) {
    var exports;
    (function (exports) {
        customElements.whenDefined('xtal-ball').then(function () {
            /**
            * Polymer based web component wrapper around the JSON Editor api.
            *
            * Code can be found at https://github.com/josdejong/jsoneditor
            */
            var XtalJsonEditor = (function (_super) {
                __extends(XtalJsonEditor, _super);
                function XtalJsonEditor() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Object.defineProperty(XtalJsonEditor, "is", {
                    get: function () { return 'xtal-json-editor'; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(XtalJsonEditor, "properties", {
                    get: function () {
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
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(XtalJsonEditor.prototype, "jsonEditor", {
                    get: function () {
                        return this._jsonEditor;
                    },
                    enumerable: true,
                    configurable: true
                });
                XtalJsonEditor.prototype.onPropsChange = function (newVal) {
                    if (!this.watch)
                        return;
                    this.$.xcontainer.innerHTML = '';
                    this._jsonEditor = new JSONEditor(this.$.xcontainer, this.options);
                    this._jsonEditor.set(this.watch);
                };
                return XtalJsonEditor;
            }(Polymer.Element));
            customElements.define(XtalJsonEditor.is, XtalJsonEditor);
        });
    })(exports = xtal.exports || (xtal.exports = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-json-editor.js.map