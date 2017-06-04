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
                        detailFn: e => {
                            const src = e.srcElement;
                            return {
                                name: src.name,
                                value: src.value,
                            };
                        }
                    };
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
                        },
                        inputMessageOptions: {
                            type: Object,
                        },
                        clickMessageOptions: {
                            type: Object
                        }
                    };
                }
                disconnectedCallback() {
                    super.disconnectedCallback();
                    for (const key in this.eventListeners) {
                        this.removeEventListener(key, this.eventListeners[key]);
                    }
                }
                registerClickHandler(newVal) {
                    if (newVal) {
                        this.addCustomEventListener(newVal, this.clickEventHandler);
                    }
                }
                registerInputHandler(newVal) {
                    if (newVal) {
                        this.addCustomEventListener(newVal, this.inputEventHandler);
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
                inputEventHandler(e) {
                    this.dispatchEvent(new CustomEvent(this.inputMessage, {
                        detail: this.inputMessageOptions.detailFn ? this.clickMessageOptions.detailFn(e) : null,
                        bubbles: this.inputMessageOptions.bubbles,
                        composed: this.inputMessageOptions.composed
                    }));
                }
            }
            customElements.define(XtalCurry.is, XtalCurry);
        }
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-curry.js.map