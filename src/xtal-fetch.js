var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        class XtalFetch extends Polymer.Element {
            constructor() {
                super(...arguments);
                this.as = 'text';
                // ready(){
                //     super.ready();
                // }
            }
            static get is() { return 'xtal-fetch'; }
            static get properties() {
                return {
                    /**
                     * Possible values are 'text' and 'json'
                     */
                    as: {
                        type: String
                    },
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
                        type: Object,
                        notify: true,
                        readOnly: true
                    },
                };
            }
            loadNewUrl() {
                if (this.reqUrl) {
                    const _this = this;
                    fetch(this.reqUrl).then(resp => {
                        resp[_this.as]().then(val => {
                            _this['_setResult'](val);
                            //_this.notifyPath('result');
                        });
                    });
                }
            }
        }
        customElements.define(XtalFetch.is, XtalFetch);
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-fetch.js.map