var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        function initXtalFetch() {
            class XtalFetch extends Polymer.Element {
                constructor() {
                    super(...arguments);
                    this.as = 'text';
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
                    if (this.href) {
                        const _this = this;
                        fetch(this.href).then(resp => {
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
            }
            customElements.define(XtalFetch.is, XtalFetch);
        }
        //function waitForPolymerElement(){if(typeof Polymer === 'undefined' || Polymer.Element === undefined){setTimeout(waitForPolymerElement, 50);return;}
        initXtalFetch();
        // }
        //waitForPolymerElement();
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-fetch.js.map