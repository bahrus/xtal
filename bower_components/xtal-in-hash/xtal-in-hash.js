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
        function initXtalInHash() {
            var tagName = 'xtal-in-hash';
            if (customElements.get(tagName))
                return;
            /**
            * `xtal-in-hash`
            * Polymer based component that reads the location.hash for a JSON object:
            *  https://mydomain.com/myPath/?queryString=1#myUID1>some-component```json{"prop1": "hello, world"}```
            *
            *
            * @customElement
            * @polymer
            * @demo demo/index.html
            */
            var XtalInHash = (function (_super) {
                __extends(XtalInHash, _super);
                function XtalInHash() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.regExp = /(.*)xtal-in-hash:json```(.*)```(.*)/;
                    _this.propertyEventListeners = {};
                    return _this;
                }
                Object.defineProperty(XtalInHash, "is", {
                    // whereUid: string;
                    get: function () { return tagName; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(XtalInHash, "properties", {
                    get: function () {
                        return {
                            bind: {
                                type: Boolean,
                                observer: 'onPropsChange'
                            },
                            childProps: {
                                type: Boolean,
                                observer: 'onPropsChange'
                            },
                            from: {
                                type: Boolean,
                                observer: 'onPropsChange'
                            },
                            locationHash: {
                                type: Boolean,
                                observer: 'onPropsChange'
                            },
                            topLocationHash: {
                                type: Boolean,
                                observer: 'onPropsChange'
                            },
                            set: {
                                type: Boolean,
                                observer: 'onPropsChange'
                            },
                            showUsage: {
                                type: Boolean,
                                observer: 'onPropsChange'
                            },
                            toFrom: {
                                type: Boolean,
                                observer: 'onPropsChange'
                            },
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                XtalInHash.prototype.onPropsChange = function () {
                    if (this.set && this.childProps && this.from && (this.locationHash || this.topLocationHash)) {
                        var _this_1 = this;
                        var objToAddListernerTo = this.topLocationHash ? window.top : window;
                        objToAddListernerTo.addEventListener('hashchange', function () {
                            _this_1.setPropsFromLocationHash();
                        });
                        if (!this.previousHash) {
                            this.setPropsFromLocationHash();
                        }
                    }
                    else if (this.bind && this.childProps && this.toFrom &&
                        (this.locationHash || this.topLocationHash)) {
                        var _this_2 = this;
                        var objToAddListernerTo = this.topLocationHash ? window.top : window;
                        objToAddListernerTo.addEventListener('hashchange', function () {
                            _this_2.bindPropsToFromLocationHash();
                        });
                        if (!this.previousHash) {
                            this.bindPropsToFromLocationHash();
                        }
                    }
                };
                XtalInHash.prototype.disconnectedCallback = function () {
                    var _this = this;
                    var objToAddListernerTo = this.topLocationHash ? window.top : window;
                    objToAddListernerTo.removeEventListener('hashchange', function () {
                        _this.setPropsFromLocationHash();
                    });
                };
                XtalInHash.prototype.setPropsFromLocationHash = function () {
                    var objToAddListernerTo = this.topLocationHash ? window.top : window;
                    var hash = objToAddListernerTo.location.hash;
                    if (hash === this.previousHash)
                        return;
                    this.previousHash = hash;
                    var splitHash = hash.split(this.regExp);
                    if (!splitHash || splitHash.length !== 5)
                        return;
                    var source = JSON.parse(splitHash[2]);
                    var targets = this.querySelectorAll('[hash-tag]');
                    if (!targets || targets.length === 0)
                        return;
                    targets.forEach(function (target) { return Object.assign(target, source); });
                    return {
                        locationHashObj: source,
                        targets: targets,
                    };
                };
                XtalInHash.prototype.bindPropsToFromLocationHash = function () {
                    var _this = this;
                    var oneWayProcessing = this.setPropsFromLocationHash();
                    if (!oneWayProcessing)
                        return;
                    var locationHashObj = oneWayProcessing.locationHashObj;
                    var targets = oneWayProcessing.targets;
                    for (var key in locationHashObj) {
                        if (!this.propertyEventListeners[key]) {
                            this.propertyEventListeners[key] = true;
                            var snakeCase = Polymer.CaseMap.camelToDashCase(key);
                            for (var i = 0, ii = targets.length; i < ii; i++) {
                                var target = targets[i];
                                target.addEventListener(snakeCase + '-changed', function (e) {
                                    locationHashObj[key] = e.detail.value;
                                    var newJsonString = JSON.stringify(locationHashObj);
                                    var objToAddListernerTo = _this.topLocationHash ? window.top : window;
                                    var hash = objToAddListernerTo.location.hash;
                                    var splitHash = hash.split(_this.regExp);
                                    if (!splitHash || splitHash.length !== 5)
                                        return;
                                    splitHash[2] = 'xtal-in-hash:json```' + newJsonString + '```';
                                    var newHash = splitHash.join('');
                                    objToAddListernerTo.location.hash = splitHash.join('');
                                });
                            }
                            // this.addEventListener(snakeCase + '-changed', e =>{
                            //     debugger;
                            // })
                        }
                    }
                };
                return XtalInHash;
            }(Polymer.Element));
            customElements.define(XtalInHash.is, XtalInHash);
        }
        var syncFlag = 'xtal_elements_in_hash_sync';
        if (window[syncFlag]) {
            customElements.whenDefined('poly-prep-sync').then(function () { return initXtalInHash(); });
            delete window[syncFlag];
        }
        else {
            if (customElements.get('poly-prep') || customElements.get('full-poly-prep')) {
                initXtalInHash();
            }
            else {
                customElements.whenDefined('poly-prep').then(function () { return initXtalInHash(); });
                customElements.whenDefined('full-poly-prep').then(function () { return initXtalInHash(); });
            }
        }
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-in-hash.js.map