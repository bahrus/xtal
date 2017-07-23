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
        function initXtalTransformer() {
            /**
            * '<xtal-transformer>' is a Polymer based custom element, that watches for a property of the parent custom element,
            * and applies a JavaScript method in the host custom element via event handling.
            */
            var XtalTransformer = (function (_super) {
                __extends(XtalTransformer, _super);
                function XtalTransformer() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Object.defineProperty(XtalTransformer, "is", {
                    /**
                    * Fired  when the watched object changes.  Consumers of this component subscribe to this event,
                    * in order to apply transforms on the object, and pass back other.
                    *
                    * @event ready-for-processing
                    */
                    get: function () { return 'xtal-transformer'; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(XtalTransformer, "properties", {
                    get: function () {
                        return {
                            /**
                             * The expression to observe and transform when it changes.
                             */
                            watch: {
                                type: Object,
                                observer: 'onPropsChange'
                            },
                            /**
                             * The expression for where to place the result of the transformation
                             */
                            result: {
                                type: Object,
                                notify: true,
                                readOnly: true
                            },
                            /**
                             * Configuration argument to pass to the transformer
                             */
                            argument: {
                                type: Object
                            },
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                //wrapObjectWithPath: string;
                XtalTransformer.prototype.onPropsChange = function (newVal) {
                    var arg = this.argument;
                    if (!arg) {
                        arg = {};
                    }
                    ;
                    arg.context = {
                        element: this,
                    };
                    var detail = { obj: newVal, arg: arg };
                    //this.fire('transform', detail);
                    this.dispatchEvent(new CustomEvent('ready-for-processing', {
                        detail: detail
                    }));
                    this['_setResult'](detail.obj);
                };
                return XtalTransformer;
            }(Polymer.Element));
            customElements.define(XtalTransformer.is, XtalTransformer);
        }
        customElements.whenDefined('poly-prep').then(function () { return initXtalTransformer(); });
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-transformer.js.map