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
        function initXtalCheckbox() {
            var XtalCheckbox = (function (_super) {
                __extends(XtalCheckbox, _super);
                function XtalCheckbox() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.isChecked = false;
                    _this.indeterminate = false;
                    return _this;
                }
                Object.defineProperty(XtalCheckbox, "is", {
                    get: function () { return 'xtal-checkbox'; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(XtalCheckbox, "properties", {
                    get: function () {
                        return {
                            isChecked: {
                                type: Boolean,
                                observer: 'checkedChangeHandler',
                                notify: true,
                                reflectToAttribute: true,
                            },
                            indeterminate: {
                                type: Boolean,
                                observer: 'indeterminateChangeHandler',
                                notify: true,
                                reflectToAttribute: true,
                            }
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                XtalCheckbox.prototype.checkedChangeHandler = function (newVal) {
                    //this.$.checkbox.checked = newVal;
                };
                XtalCheckbox.prototype.indeterminateChangeHandler = function (newVal) {
                    this.$.checkbox.indeterminate = newVal;
                };
                XtalCheckbox.prototype.handleClickEvent = function (mouseEvent, ea) {
                    console.log({ handleClickEvent: { mouseEvent: mouseEvent, ea: ea, checked: this.$.checkbox.checked } });
                    this.isChecked = this.$.checkbox.checked; //this fires a non bubbling event "is-checked"
                    //this.fire('checkbox-checked', this.isChecked);
                    this.dispatchEvent(new CustomEvent('checkbox-checked', {
                        bubbles: true,
                        composed: true,
                        detail: {
                            isChecked: this.isChecked
                        }
                    }));
                };
                XtalCheckbox.prototype.ready = function () {
                    _super.prototype.ready.call(this);
                    if (this.indeterminate)
                        this.$.checkbox.indeterminate = true;
                };
                return XtalCheckbox;
            }(Polymer.Element));
            customElements.define(XtalCheckbox.is, XtalCheckbox);
        }
        customElements.whenDefined('xtal-ball').then(function () { return initXtalCheckbox(); });
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-checkbox.js.map