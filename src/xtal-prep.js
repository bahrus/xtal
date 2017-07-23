var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        function initXtalPrep() {
            class XtalPrep extends Polymer.Element {
                static get is() { return 'xtal-prep'; }
                static get properties() {
                    return {
                        /**
                         * CSS selector for a target custom element to dump the inner contents of the tag
                         */
                        selector: {
                            type: String
                        },
                        /**
                         * check if property exists on element.  When it does, element is ready to dump contents
                        */
                        targetProp: {
                            type: String
                        },
                        /**
                         * Name of a global variable where model for inner contents is derived
                        */
                        jsModel: {
                            type: String
                        },
                    };
                }
                checkAndDumpWhenReady() {
                    const containerElement = document.querySelector(this.selector);
                    if (!containerElement)
                        return;
                    const custElName = containerElement.tagName.toLowerCase();
                    customElements.whenDefined(custElName).then(() => {
                        if (this.jsModel) {
                            const model = eval(this.jsModel);
                            containerElement[this.targetProp] = model;
                        }
                        else {
                            containerElement.innerHTML = this.innerHTML;
                        }
                    });
                }
            }
        }
        customElements.whenDefined('xtal-ball').then(() => initXtalPrep());
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-prep.js.map