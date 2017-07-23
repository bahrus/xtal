var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        function initXtalTransformer() {
            /**
            * '<xtal-transformer>' is a Polymer based custom element, that watches for a property of the parent custom element,
            * and applies a JavaScript method in the host custom element via event handling.
            */
            class XtalTransformer extends Polymer.Element {
                /**
                * Fired  when the watched object changes.  Consumers of this component subscribe to this event,
                * in order to apply transforms on the object, and pass back other.
                *
                * @event ready-for-processing
                */
                static get is() { return 'xtal-transformer'; }
                static get properties() {
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
                }
                //wrapObjectWithPath: string;
                onPropsChange(newVal) {
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
                }
            }
            customElements.define(XtalTransformer.is, XtalTransformer);
        }
        customElements.whenDefined('poly-prep').then(() => initXtalTransformer());
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-transformer.js.map