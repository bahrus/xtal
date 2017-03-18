var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        class JSTransformer extends Polymer.Element {
            static get is() { return 'js-transformer'; }
            static get properties() {
                return {
                    /**
                    * The expression to observe and transform when it changes.
                    */
                    watch: {
                        type: Object,
                        observer: 'onWatchChange'
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
                    wrapObjectWithPath: {
                        type: String
                    }
                };
            }
            //Inspired by Stackoverflow.com/questions/27936772/deep-object-merging-in-es6-es7
            /**
            * Deep merge two objects.
            * @param target
            * @param source
            */
            mergeDeep(target, source) {
                if (typeof target !== 'object')
                    return;
                if (typeof source !== 'object')
                    return;
                for (const key in source) {
                    const sourceVal = source[key];
                    const targetVal = target[key];
                    if (!sourceVal)
                        continue; //TODO:  null out property?
                    if (!targetVal) {
                        target[key] = sourceVal;
                        continue;
                    }
                    if (Array.isArray(sourceVal) && Array.isArray(targetVal)) {
                        //warning!! code below not yet tested
                        if (targetVal.length > 0 && typeof targetVal[0].id === 'undefined')
                            continue;
                        for (var i = 0, ii = sourceVal.length; i < ii; i++) {
                            const srcEl = sourceVal[i];
                            if (typeof srcEl.id === 'undefined')
                                continue;
                            const targetEl = targetVal.find(function (el) { return el.id === srcEl.id; });
                            if (targetEl) {
                                this.mergeDeep(targetEl, srcEl);
                            }
                            else {
                                targetVal.push(srcEl);
                            }
                        }
                        continue;
                    }
                    switch (typeof sourceVal) {
                        case 'object':
                            switch (typeof targetVal) {
                                case 'object':
                                    this.mergeDeep(targetVal, sourceVal);
                                    break;
                                default:
                                    target[key] = sourceVal;
                                    break;
                            }
                            break;
                        default:
                            target[key] = sourceVal;
                    }
                }
                return target;
            }
            onWatchChange(newVal) {
                let transformedObj;
                if (this.wrapObjectWithPath) {
                    transformedObj = {};
                    transformedObj[this.wrapObjectWithPath] = newVal;
                }
                else {
                    transformedObj = newVal;
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
                var detail = { obj: transformedObj, arg: arg };
                //this.fire('transform', detail);
                this.dispatchEvent(new CustomEvent('loadedDependencies', detail));
                arg.context.count++;
                transformedObj = detail.obj;
                if (this._transformerFns) {
                    for (var i = 0, ii = this._transformerFns.length; i < ii; i++) {
                        var transformerFnOrObj = this._transformerFns[i];
                        switch (typeof (transformerFnOrObj)) {
                            case 'function':
                                transformedObj = transformerFnOrObj(transformedObj, arg);
                                break;
                            case 'object':
                                this.mergeDeep(transformedObj, transformerFnOrObj);
                                break;
                        }
                        arg.context.count++;
                    }
                }
                detail.obj = transformedObj;
                this.dispatchEvent(new CustomEvent('loadedDependencies', detail));
                delete arg.context;
                this['_setResult'](transformedObj);
            }
            connectedCallback() {
                super.connectedCallback();
                try {
                    this._transformerFns = eval(this.innerText);
                }
                catch (e) {
                    console.error("Unable to parse " + this.innerText);
                }
                if (!Array.isArray(this._transformerFns))
                    delete this._transformerFns;
            }
        }
        customElements.define(JSTransformer.is, JSTransformer);
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=js-transformer.js.map