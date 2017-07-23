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
        function initJSONMerge() {
            /**
             * <js-merge></js-merge> is a Polymer-based helper element, that watches for changes to a property defined in
             * its containing host polymer element.  When it changes, this element will merge the data with an array of JSON
             * elements contained inside the tag.
             * The JSON can reference items from the refs property using ${this.refs.myProp}
             */
            var JSONMerge = (function (_super) {
                __extends(JSONMerge, _super);
                function JSONMerge() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.passThruOnInit = false;
                    return _this;
                }
                Object.defineProperty(JSONMerge, "is", {
                    get: function () { return 'json-merge'; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(JSONMerge, "properties", {
                    get: function () {
                        return {
                            /**
                             * Wrap the incoming object inside a new empty object, with key equal to this value.
                             * E.g. if the incoming object is {foo: 'hello', bar: 'world'}
                             * and wrap-object-with-path = 'myPath'
                             * then the source object which be merged into is:
                             * {myPath: {foo: 'hello', bar: 'world'}}
                             */
                            wrapObjectWithPath: {
                                type: String
                            },
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
                             * Allow for substitions into JSON object, where the value is of the form "key":"${this.refs.xyz}"
                             */
                            refs: {
                                type: Object
                            },
                            /**
                             * If set to true, the JSON object will directly go to result during initalization
                             */
                            passThruOnInit: {
                                type: Boolean
                            }
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                /**
                 * Deep merge two objects.
                 * Inspired by Stackoverflow.com/questions/27936772/deep-object-merging-in-es6-es7
                 * @param target
                 * @param source
                 *
                 */
                JSONMerge.prototype.mergeDeep = function (target, source) {
                    if (typeof target !== 'object')
                        return;
                    if (typeof source !== 'object')
                        return;
                    for (var key in source) {
                        var sourceVal = source[key];
                        var targetVal = target[key];
                        if (!sourceVal)
                            continue; //TODO:  null out property?
                        if (!targetVal) {
                            console.log(key);
                            target[key] = sourceVal;
                            continue;
                        }
                        if (Array.isArray(sourceVal) && Array.isArray(targetVal)) {
                            //warning!! code below not yet tested
                            if (targetVal.length > 0 && typeof targetVal[0].id === 'undefined')
                                continue;
                            var _loop_1 = function () {
                                var srcEl = sourceVal[i];
                                if (typeof srcEl.id === 'undefined')
                                    return "continue";
                                var targetEl = targetVal.find(function (el) { return el.id === srcEl.id; });
                                if (targetEl) {
                                    this_1.mergeDeep(targetEl, srcEl);
                                }
                                else {
                                    targetVal.push(srcEl);
                                }
                            };
                            var this_1 = this;
                            for (var i = 0, ii = sourceVal.length; i < ii; i++) {
                                _loop_1();
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
                                        console.log(key);
                                        target[key] = sourceVal;
                                        break;
                                }
                                break;
                            default:
                                console.log(key);
                                target[key] = sourceVal;
                        }
                    }
                    return target;
                };
                JSONMerge.prototype.loadJSON = function () {
                    var _this = this;
                    try {
                        if (this.refs) {
                            this._objectsToMerge = JSON.parse(this.innerText, function (key, val) {
                                if (typeof val !== 'string')
                                    return val;
                                if (!val.startsWith('${refs.') || !val.endsWith('}'))
                                    return val;
                                var realKey = val.substring(7, val.length - 1);
                                return _this.refs[realKey];
                            });
                        }
                        else {
                            this._objectsToMerge = JSON.parse(this.innerText);
                        }
                    }
                    catch (e) {
                        console.error("Unable to parse " + this.innerText);
                    }
                    return this._objectsToMerge;
                };
                JSONMerge.prototype.onPropsChange = function (newVal) {
                    debugger;
                    var transformedObj;
                    if (this.wrapObjectWithPath) {
                        transformedObj = {};
                        transformedObj[this.wrapObjectWithPath] = newVal;
                    }
                    else {
                        transformedObj = newVal;
                    }
                    this.loadJSON();
                    if (this._objectsToMerge && transformedObj) {
                        for (var i = 0, ii = this._objectsToMerge.length; i < ii; i++) {
                            var objToMerge = this._objectsToMerge[i];
                            switch (typeof (objToMerge)) {
                                case 'object':
                                    this.mergeDeep(transformedObj, objToMerge);
                                    break;
                                default:
                                    throw 'TODO:  error message';
                            }
                        }
                    }
                    this['_setResult'](transformedObj);
                };
                JSONMerge.prototype.ready = function () {
                    _super.prototype.ready.call(this);
                    if (this.passThruOnInit) {
                        this.onPropsChange({});
                    }
                };
                return JSONMerge;
            }(MyMixin(Polymer.Element)));
            customElements.define(JSONMerge.is, JSONMerge);
        }
        //function waitForPolymerElement(){if(typeof Polymer === 'undefined' || Polymer.Element === undefined){setTimeout(waitForPolymerElement, 50);return;}
        //    initJSMerge();
        //}
        //waitForPolymerElement();
        customElements.whenDefined('xtal-ball').then(function () { return initJSONMerge(); });
        var MyMixin = function (superClass) {
            return (function (_super) {
                __extends(class_1, _super);
                function class_1() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                // Code that you want common to elements.
                // If you're going to override a lifecycle method, remember that a) you
                // might need to call super but b) it might not exist
                class_1.prototype.connectedCallback = function () {
                    if (_super.prototype.connectedCallback) {
                        _super.prototype.connectedCallback.call(this);
                    }
                    /* ... */
                };
                return class_1;
            }(superClass));
        };
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=json-merge.js.map