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
        function initXtalPromix() {
            /**
             * "Promix" is a portmeanteau of "promise" and "mixin" (dropping the "in" for brevity).//
             */
            var XtalPromix = (function (_super) {
                __extends(XtalPromix, _super);
                function XtalPromix() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Object.defineProperty(XtalPromix, "is", {
                    get: function () { return 'xtal-promix'; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(XtalPromix, "properties", {
                    get: function () {
                        return {};
                    },
                    enumerable: true,
                    configurable: true
                });
                XtalPromix.prototype.decrementUnresolvedElements = function () {
                    this.unresolvedElements--;
                    if (this.unresolvedElements === 0) {
                        //this.readyToSetAttributes();
                        var thingsToShow = this.querySelectorAll('[until="ready"]');
                        console.log({ thingsToShow: thingsToShow });
                        for (var i = 0, ii = thingsToShow.length; i < ii; i++) {
                            var thingToShow = thingsToShow[i];
                            thingToShow.style.display = 'block';
                        }
                    }
                };
                //setAttributesOnReady;
                XtalPromix.prototype.connectedCallback = function () {
                    _super.prototype.connectedCallback.call(this);
                    var dependencies = this.querySelectorAll('[is="mixin"]');
                    var len = dependencies.length;
                    this.unresolvedElements = len;
                    for (var i = 0; i < len; i++) {
                        var dependency = dependencies[i];
                        var tagName = dependency.tagName.toLowerCase();
                        this.processTag(tagName);
                    }
                };
                XtalPromix.prototype.processTag = function (tagName) {
                    if (XtalPromix.alreadyApplied[tagName]) {
                        this.decrementUnresolvedElements();
                        return;
                    }
                    XtalPromix.alreadyApplied[tagName] = true;
                    var _this = this;
                    customElements.whenDefined(tagName).then(function () {
                        var posOfLastSlash = tagName.lastIndexOf('-');
                        var superClassTagName = tagName.substr(0, posOfLastSlash);
                        customElements.whenDefined(superClassTagName).then(function () {
                            var superClass = customElements.get(superClassTagName).prototype;
                            var mixinClass = customElements.get(tagName).prototype;
                            for (var _i = 0, _a = Object.getOwnPropertyNames(mixinClass); _i < _a.length; _i++) {
                                var key = _a[_i];
                                if (key === 'constructor')
                                    continue;
                                superClass[key] = mixinClass[key];
                            }
                            if (mixinClass.init) {
                                var allSuperClassElements = document.querySelectorAll(superClassTagName); //TODO!
                                for (var i = 0, ii = allSuperClassElements.length; i < ii; i++) {
                                    var el = allSuperClassElements[i];
                                    el['init']();
                                }
                            }
                            _this.decrementUnresolvedElements();
                        });
                    });
                };
                XtalPromix.alreadyApplied = {};
                return XtalPromix;
            }(Polymer.Element));
            customElements.define(XtalPromix.is, XtalPromix);
        }
        customElements.whenDefined('xtal-ball').then(function () { return initXtalPromix(); });
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-promix.js.map