var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        class XtalFetch extends Polymer.Element {
            static get properties() {
                return {
                    debounceTimeInMs: {
                        type: Number
                    },
                    reqInfo: {
                        type: Object,
                    },
                    reqInit: {
                        type: Object
                    },
                    reqURL: {
                        type: String,
                    }
                };
            }
        }
        elements.XtalFetch = XtalFetch;
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-fetch.js.map