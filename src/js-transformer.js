var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        customElements.whenDefined('xtal-ball').then(() => {
            /**
            * '<js-transformer>' is a Polymer based custom element, that watches for a property of the parent custom element,
            * applies either a JavaScript method in the parent custom element via event handling,
            * and / or it transforms the object based on a global (namespaced)
            * common function contained within the tag (use hidden attribute)
            */
            class JSTransformer extends Polymer.Element {
                static get is() { return 'js-transformer'; }
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
                         * The expression for where to place the result.
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
                onPropsChange(newVal) {
                    if (!this._transformerFns) {
                        try {
                            //this._transformerFns = eval(this.innerText);
                            const splitStr = this.innerText.replace('[', '').replace(']', '').split('').map(s => s.trim());
                            this._transformerFns = splitStr.map(s => new Function(s));
                        }
                        catch (e) {
                            console.error("Unable to parse " + this.innerText);
                        }
                    }
                    var arg = this.argument;
                    if (!arg) {
                        arg = {};
                    }
                    ;
                    arg.context = {
                        element: this,
                        count: 0,
                    };
                    var detail = { obj: newVal, arg: arg };
                    //this.fire('transform', detail);
                    this.dispatchEvent(new CustomEvent('transform', {
                        detail: detail
                    }));
                    arg.context.count++;
                    let transformedObj = detail.obj;
                    if (this._transformerFns) {
                        for (let i = 0, ii = this._transformerFns.length; i < ii; i++) {
                            const transformerFnOrObj = this._transformerFns[i];
                            switch (typeof (transformerFnOrObj)) {
                                case 'function':
                                    transformedObj = transformerFnOrObj(transformedObj, arg);
                                    break;
                                default:
                                    throw 'TODO:  error message';
                            }
                            arg.context.count++;
                        }
                    }
                    detail.obj = transformedObj;
                    this.dispatchEvent(new CustomEvent('transform', {
                        detail: detail
                    }));
                    delete arg.context;
                    this['_setResult'](detail.obj);
                }
                connectedCallback() {
                    super.connectedCallback();
                    if (!Array.isArray(this._transformerFns))
                        delete this._transformerFns;
                }
            }
            customElements.define(JSTransformer.is, JSTransformer);
        });
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=js-transformer.js.map