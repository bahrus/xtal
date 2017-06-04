var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        function initXtalCurry() {
            class XtalCurry extends Polymer.Element {
                constructor() {
                    super(...arguments);
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
                    this.eventListeners = {};
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
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-curry.js.map