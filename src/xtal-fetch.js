var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        function initXtalFetch() {
            class XtalFetch extends xtal.elements['InitMerge'](Polymer.Element) {
                constructor() {
                    super(...arguments);
                    this.reqInit = {
                        credentials: 'include'
                    };
                    this.as = 'text';
                    this._initialized = false;
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
                        // reqInfo: {
                        //     type: Object,
                        // },
                        reqInit: {
                            type: Object
                        },
                        insertResults: {
                            type: Boolean
                        },
                        href: {
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
                    if (!this._initialized)
                        return;
                    if (this.href) {
                        const _this = this;
                        fetch(this.href, this.reqInit).then(resp => {
                            resp[_this.as]().then(val => {
                                _this['_setResult'](val);
                                if (typeof val === 'string' && this.insertResults) {
                                    this.innerHTML = val;
                                }
                                //_this.notifyPath('result');
                            });
                        });
                    }
                }
                connectedCallback() {
                    super.connectedCallback();
                    this.init().then(() => {
                        this._initialized = true;
                        this.loadNewUrl();
                    });
                }
            }
            customElements.define(XtalFetch.is, XtalFetch);
        }
        customElements.whenDefined('xtal-ball').then(() => initXtalFetch());
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-fetch.js.map