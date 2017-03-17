var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        class XtalFetch extends Polymer.Element {
            static get is() { return 'xtal-fetch'; }
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
                    reqUrl: {
                        type: String,
                        observer: 'loadNewUrl'
                    },
                    /**
                    * The expression for where to place the result.
                    */
                    result: {
                        type: String,
                        notify: true,
                        readOnly: true
                    },
                };
            }
            loadNewUrl() {
                if (this.reqUrl) {
                    const _this = this;
                    fetch(this.reqUrl).then(resp => {
                        resp.text().then(txt => {
                            _this['_setResult'](txt);
                            //_this.notifyPath('result');
                        });
                    });
                }
            }
        }
        elements.XtalFetch = XtalFetch;
        customElements.define(xtal.elements.XtalFetch.is, xtal.elements.XtalFetch);
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-fetch.js.map