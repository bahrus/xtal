var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        function initXtalFetch() {
            var XtalFetch = (function (_super) {
                __extends(XtalFetch, _super);
                function XtalFetch() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.as = 'text';
                    _this._initialized = false;
                    _this._cachedResults = {};
                    return _this;
                }
                Object.defineProperty(XtalFetch.prototype, "cachedResults", {
                    get: function () {
                        return this._cachedResults;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(XtalFetch, "is", {
                    get: function () { return 'xtal-fetch'; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(XtalFetch, "properties", {
                    get: function () {
                        return {
                            /**
                             * Possible values are 'text' and 'json'
                             */
                            as: {
                                type: String
                            },
                            /**
                             *
                             */
                            cacheResults: {
                                type: Boolean
                            },
                            debounceTimeInMs: {
                                type: Number
                            },
                            /**
                             * Needs to be true for any request to be made.
                             */
                            fetch: {
                                type: Boolean,
                                observer: 'loadNewUrl'
                            },
                            /**
                             * A comma delimited list of keys to pluck from in-entities
                             */
                            forEach: {
                                type: String
                            },
                            /**
                             * Base url
                             */
                            href: {
                                type: String,
                                observer: 'loadNewUrl'
                            },
                            /**
                             * An array of entities that forEach keys will be plucked from.
                             * Fetch requests will be made iteratively (but in parallel) for each such entity
                             */
                            inEntities: {
                                type: Array,
                                observer: 'loadNewUrl'
                            },
                            /**
                             * Place the contents of the fetch inside the tag itself.
                             */
                            insertResults: {
                                type: Boolean
                            },
                            /**
                             * The second parameter of the fetch call.
                             * See, e.g. https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
                             */
                            reqInit: {
                                type: Object
                            },
                            /**
                             * The expression for where to place the result.
                             */
                            result: {
                                type: Object,
                                notify: true,
                                readOnly: true
                            },
                            /**
                             * When looping through entities, calling fetch, place the results of the fetch in the path specified by this
                             * property.
                             */
                            setPath: {
                                type: String,
                                value: 'result'
                            }
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                XtalFetch.prototype.loadNewUrl = function () {
                    var _this = this;
                    if (!this._initialized)
                        return;
                    if (!this.fetch)
                        return;
                    if (this.href) {
                        var _this_1 = this;
                        if (this.forEach) {
                            if (!this.inEntities)
                                return;
                            this.inEntities.forEach(function (entity) {
                                var keys = _this.forEach.split(',');
                                var href = _this.href;
                                for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                                    var key = keys_1[_i];
                                    href = href.replace(':' + key, entity[key]);
                                }
                                if (_this.cacheResults) {
                                    if (_this.cachedResults[href]) {
                                        return;
                                    }
                                }
                                fetch(href, _this.reqInit).then(function (resp) {
                                    resp[_this_1.as]().then(function (val) {
                                        if (_this.cacheResults)
                                            _this.cachedResults[href] = val;
                                        entity[_this.setPath] = val;
                                        var detail = {
                                            entity: entity,
                                            href: href
                                        };
                                        _this.dispatchEvent(new CustomEvent('fetch-complete', {
                                            detail: detail,
                                            bubbles: true,
                                            composed: true
                                        }));
                                    });
                                });
                            });
                        }
                        else {
                            if (this.cacheResults) {
                                if (this.cachedResults[this.href]) {
                                    return;
                                }
                            }
                            fetch(this.href, this.reqInit).then(function (resp) {
                                resp[_this_1.as]().then(function (val) {
                                    if (_this.cachedResults) {
                                        _this.cachedResults[_this.href] = val;
                                    }
                                    _this_1['_setResult'](val);
                                    if (typeof val === 'string' && _this.insertResults) {
                                        _this.innerHTML = val;
                                    }
                                });
                            });
                        }
                    }
                };
                XtalFetch.prototype.connectedCallback = function () {
                    var _this = this;
                    _super.prototype.connectedCallback.call(this);
                    this.init().then(function () {
                        _this._initialized = true;
                        _this.loadNewUrl();
                    });
                };
                return XtalFetch;
            }(xtal.elements['InitMerge'](Polymer.Element)));
            customElements.define(XtalFetch.is, XtalFetch);
        }
        customElements.whenDefined('dom-module').then(function () {
            console.log('dom-module loaded.  Polymer.Element = ');
            console.log(Polymer.Element);
        });
        customElements.whenDefined('xtal-ball').then(function () { return initXtalFetch(); });
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-fetch.js.map