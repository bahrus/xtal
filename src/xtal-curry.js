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
        function initXtalCurry() {
            var XtalCurry = (function (_super) {
                __extends(XtalCurry, _super);
                function XtalCurry() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.eventListeners = {};
                    _this.clickMessageOptions = {
                        bubbles: true,
                        composed: false,
                    };
                    _this.inputMessageOptions = {
                        bubbles: true,
                        composed: false,
                        debounceTimeInMs: 100,
                    };
                    return _this;
                    // inputEventHandler(e: Event){
                    //     console.log('in inputEventHandler');
                    //     xtal.elements['debounce'](() =>{
                    //         console.log('debouncer');
                    //         _this.dispatchEvent(new CustomEvent(this.inputMessage, {
                    //             detail:   _this.inputMessageOptions.detailFn ? _this.clickMessageOptions.detailFn(e) : null,
                    //             bubbles:  _this.inputMessageOptions.bubbles,
                    //             composed: _this.inputMessageOptions.composed
                    //         } as CustomEventInit));
                    //     }, this.inputMessageOptions.debounceInterval)
                    // }
                }
                Object.defineProperty(XtalCurry, "is", {
                    get: function () { return 'xtal-curry'; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(XtalCurry, "properties", {
                    get: function () {
                        return {
                            clickMessage: {
                                type: String,
                                observer: 'registerClickHandler',
                            },
                            inputMessage: {
                                type: String,
                            },
                            inputMessageOptions: {
                                type: Object,
                            },
                            clickMessageOptions: {
                                type: Object
                            }
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                XtalCurry.prototype.connectedCallback = function () {
                    var _this = this;
                    _super.prototype.connectedCallback.call(this);
                    this.init().then(function () {
                        if (_this.inputMessage)
                            _this.registerInputHandler();
                    });
                };
                XtalCurry.prototype.disconnectedCallback = function () {
                    _super.prototype.disconnectedCallback.call(this);
                    for (var key in this.eventListeners) {
                        this.removeEventListener(key, this.eventListeners[key]);
                    }
                };
                XtalCurry.prototype.registerClickHandler = function (newVal) {
                    if (newVal) {
                        this.addCustomEventListener('click', this.clickEventHandler);
                    }
                };
                XtalCurry.prototype.registerInputHandler = function () {
                    var _this = this;
                    console.log(this.inputMessageOptions);
                    if (!this.__inputDebouncer) {
                        var _this_1 = this;
                        this.__inputDebouncer = xtal.elements['debounce'](function (e) {
                            if (!_this.inputMessageOptions.detailFn) {
                                _this.inputMessageOptions.detailFn = function (e) {
                                    var src = e.srcElement;
                                    return {
                                        name: src.name,
                                        value: src.value,
                                    };
                                };
                            }
                            _this_1.dispatchEvent(new CustomEvent(_this.inputMessage, {
                                detail: _this_1.inputMessageOptions.detailFn ? _this_1.inputMessageOptions.detailFn(e) : null,
                                bubbles: _this_1.inputMessageOptions.bubbles,
                                composed: _this_1.inputMessageOptions.composed
                            }));
                        }, this.inputMessageOptions.debounceTimeInMs);
                    }
                    this.addCustomEventListener('input', this.__inputDebouncer);
                };
                XtalCurry.prototype.addCustomEventListener = function (key, listener) {
                    this.eventListeners[key] = listener;
                    this.addEventListener(key, listener);
                };
                XtalCurry.prototype.clickEventHandler = function (e) {
                    this.dispatchEvent(new CustomEvent(this.clickMessage, {
                        detail: this.clickMessageOptions.detailFn ? this.clickMessageOptions.detailFn(e) : null,
                        bubbles: this.clickMessageOptions.bubbles,
                        composed: this.clickMessageOptions.composed
                    }));
                };
                return XtalCurry;
            }(xtal.elements['InitMerge'](Polymer.Element)));
            customElements.define(XtalCurry.is, XtalCurry);
        }
        customElements.whenDefined('xtal-ball').then(function () { return initXtalCurry(); });
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-curry.js.map