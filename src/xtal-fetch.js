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
                         * An array of entities that have child entities available via a restful api
                         */
                        entities: {
                            type: Array,
                            observer: 'loadNewUrl'
                        },
                        /**
                         * Comma delimited list of tokens in the Rest path to replace from the entity
                         */
                        keys: {
                            type: String,
                            value: 'id'
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
                        if (this.href.indexOf(':id') > -1) {
                            if (!this.entities)
                                return;
                            this.entities.forEach(entity => {
                                const keys = this.keys.split(',');
                                let href = this.href;
                                for (const key of keys) {
                                    href = href.replace(':' + key, entity[key]);
                                }
                                //const href = this.href.replace(':id', entity.id);
                                fetch(href, this.reqInit).then(resp => {
                                    resp[_this.as]().then(val => {
                                        entity.result = val;
                                    });
                                });
                            });
                        }
                        else {
                            fetch(this.href, this.reqInit).then(resp => {
                                resp[_this.as]().then(val => {
                                    _this['_setResult'](val);
                                    if (typeof val === 'string' && this.insertResults) {
                                        this.innerHTML = val;
                                    }
                                });
                            });
                        }
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
        customElements.whenDefined('dom-module').then(() => {
            console.log('dom-module loaded.  Polymer.Element = ');
            console.log(Polymer.Element);
        });
        customElements.whenDefined('xtal-ball').then(() => initXtalFetch());
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-fetch.js.map