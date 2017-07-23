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
        function initXtalPrep() {
            var XtalPrep = (function (_super) {
                __extends(XtalPrep, _super);
                function XtalPrep() {
                    return _super !== null && _super.apply(this, arguments) || this;
                }
                Object.defineProperty(XtalPrep, "is", {
                    get: function () { return 'xtal-prep'; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(XtalPrep, "properties", {
                    get: function () {
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
                    },
                    enumerable: true,
                    configurable: true
                });
                XtalPrep.prototype.checkAndDumpWhenReady = function () {
                    var _this = this;
                    var containerElement = document.querySelector(this.selector);
                    if (!containerElement)
                        return;
                    var custElName = containerElement.tagName.toLowerCase();
                    customElements.whenDefined(custElName).then(function () {
                        if (_this.jsModel) {
                            var model = eval(_this.jsModel);
                            containerElement[_this.targetProp] = model;
                        }
                        else {
                            containerElement.innerHTML = _this.innerHTML;
                        }
                    });
                };
                return XtalPrep;
            }(Polymer.Element));
        }
        customElements.whenDefined('xtal-ball').then(function () { return initXtalPrep(); });
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-prep.js.map