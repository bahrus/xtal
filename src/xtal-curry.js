var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        function initXtalCurry() {
            class XtalCurry extends Polymer.Element {
                constructor() {
                    super(...arguments);
                    this.eventListeners = {};
                    this.clickMessageOptions = {
                        bubbles: true,
                        composed: false,
                    };
                    this.inputMessageOptions = {
                        bubbles: true,
                        composed: false,
                        debounceInterval: 100,
                    };
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
                static get is() { return 'xtal-curry'; }
                static get properties() {
                    return {
                        clickMessage: {
                            type: String,
                            observer: 'registerClickHandler',
                        },
                        inputMessage: {
                            type: String,
                            observer: 'registerInputHandler'
                        },
                        inputMessageOptions: {
                            type: Object,
                        },
                        clickMessageOptions: {
                            type: Object
                        }
                    };
                }
                connectedCallback() {
                    const jsonMergeInit = this.querySelector('json-merge[role="init"]');
                    if (jsonMergeInit) {
                        customElements.whenDefined('json-merge').then(() => {
                            const initObjs = jsonMergeInit.loadJSON();
                            debugger;
                            if (initObjs) {
                                initObjs.forEach(initObj => jsonMergeInit.mergeDeep(this, initObj));
                            }
                        });
                    }
                }
                disconnectedCallback() {
                    super.disconnectedCallback();
                    for (const key in this.eventListeners) {
                        this.removeEventListener(key, this.eventListeners[key]);
                    }
                }
                registerClickHandler(newVal) {
                    if (newVal) {
                        this.addCustomEventListener('click', this.clickEventHandler);
                    }
                }
                registerInputHandler(newVal) {
                    debugger;
                    if (newVal) {
                        if (!this.__inputDebouncer) {
                            const _this = this;
                            this.__inputDebouncer = xtal.elements['debounce']((e) => {
                                if (!this.inputMessageOptions.detailFn) {
                                    this.inputMessageOptions.detailFn = (e) => {
                                        const src = e.srcElement;
                                        return {
                                            name: src.name,
                                            value: src.value,
                                        };
                                    };
                                }
                                _this.dispatchEvent(new CustomEvent(this.inputMessage, {
                                    detail: _this.inputMessageOptions.detailFn ? _this.inputMessageOptions.detailFn(e) : null,
                                    bubbles: _this.inputMessageOptions.bubbles,
                                    composed: _this.inputMessageOptions.composed
                                }));
                            }, this.inputMessageOptions.debounceInterval);
                        }
                        this.addCustomEventListener('input', this.__inputDebouncer);
                    }
                }
                addCustomEventListener(key, listener) {
                    this.eventListeners[key] = listener;
                    this.addEventListener(key, listener);
                }
                clickEventHandler(e) {
                    this.dispatchEvent(new CustomEvent(this.clickMessage, {
                        detail: this.clickMessageOptions.detailFn ? this.clickMessageOptions.detailFn(e) : null,
                        bubbles: this.clickMessageOptions.bubbles,
                        composed: this.clickMessageOptions.composed
                    }));
                }
            }
            customElements.define(XtalCurry.is, XtalCurry);
        }
        customElements.whenDefined('xtal-ball').then(() => initXtalCurry());
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-curry.js.map