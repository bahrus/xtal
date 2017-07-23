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
        function serialize(form, asObject) {
            if (!form || form.nodeName !== "FORM") {
                return;
            }
            //var i, j, q = [];
            var q;
            var p;
            if (asObject) {
                p = {};
            }
            else {
                q = [];
            }
            for (var i = form.elements.length - 1; i >= 0; i = i - 1) {
                var elm = form.elements[i];
                if (elm.name === "") {
                    continue;
                }
                if (elm.name.indexOf('_ignore_') === 0) {
                    continue;
                }
                var val = void 0;
                if (q) {
                    val = encodeURIComponent(elm.value);
                }
                else {
                    val = elm.value;
                }
                switch (elm.nodeName) {
                    case 'INPUT':
                        switch (elm.type) {
                            case 'text':
                            case 'hidden':
                            case 'password':
                            case 'button':
                            case 'reset':
                            case 'submit':
                                if (q) {
                                    q.push(elm.name + "=" + val);
                                }
                                else {
                                    p[elm.name] = val;
                                }
                                break;
                            case 'checkbox':
                            case 'radio':
                                if (elm.checked) {
                                    if (q) {
                                        q.push(elm.name + "=" + val);
                                    }
                                    else {
                                        if (p[elm.name]) {
                                            p[elm.name] = [];
                                        }
                                        p[elm.name]['push'](val);
                                    }
                                }
                                break;
                            case 'file':
                                break;
                        }
                        break;
                    case 'TEXTAREA':
                        if (q) {
                            q.push(elm.name + "=" + val);
                        }
                        else {
                            p[elm.name] = val;
                        }
                        break;
                    case 'SELECT':
                        switch (elm.type) {
                            case 'select-one':
                                if (q) {
                                    q.push(elm.name + "=" + val);
                                }
                                else {
                                    p[elm.name] = val;
                                }
                                break;
                            case 'select-multiple':
                                var selm = elm;
                                var options = selm.options;
                                for (var j = options.length - 1; j >= 0; j = j - 1) {
                                    if (options[j]['selected']) {
                                        var val2 = void 0;
                                        if (q) {
                                            val2 = encodeURIComponent(options[j]['value']);
                                        }
                                        else {
                                            val2 = options[j]['value'];
                                        }
                                        if (q) {
                                            q.push(elm.name + "=" + val);
                                        }
                                        else {
                                            if (!p[elm.name]) {
                                                p[elm.name] = [];
                                            }
                                            p[elm.name]['push'](val);
                                        }
                                    }
                                }
                                break;
                        }
                        break;
                    case 'BUTTON':
                        switch (elm.type) {
                            case 'reset':
                            case 'submit':
                            case 'button':
                                if (q) {
                                    q.push(elm.name + "=" + val);
                                }
                                else {
                                    if (!p[elm.name]) {
                                        p[elm.name] = [];
                                    }
                                    p[elm.name]['push'](val);
                                }
                                break;
                        }
                        break;
                }
            }
            if (q) {
                return q.join("&");
            }
            else {
                return p;
            }
        }
        function validateInputElement(inputEl) {
            var val = inputEl.value;
            if (inputEl.required && val.length === 0)
                return false;
            if (inputEl.maxLength != -1 && val.length > inputEl.maxLength)
                return false;
            if (inputEl.pattern) {
                var regExp = new RegExp(inputEl.pattern);
                if (!regExp.test(val))
                    return false;
            }
            //TODO:  set class?
            return true;
        }
        function initXtalForm() {
            var XtalForm = (function (_super) {
                __extends(XtalForm, _super);
                function XtalForm() {
                    var _this = _super !== null && _super.apply(this, arguments) || this;
                    _this.disabled = false;
                    _this.recomputeOnEnable = false;
                    return _this;
                }
                Object.defineProperty(XtalForm, "is", {
                    get: function () { return 'xtal-form'; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(XtalForm, "properties", {
                    get: function () {
                        return {
                            disabled: {
                                type: Boolean,
                                observer: 'onDisabledChange'
                            },
                            serializedForm: {
                                type: Object,
                                notify: true,
                                readOnly: true,
                            },
                            computedRequestUrl: {
                                type: String,
                                notify: true,
                                readOnly: true,
                            },
                            computedRequestBody: {
                                type: String,
                                notify: true,
                                readOnly: true,
                            }
                        };
                    },
                    enumerable: true,
                    configurable: true
                });
                XtalForm.prototype.validate = function (formElm, serializedForm) {
                    if (!formElm)
                        formElm = this.querySelector('form');
                    if (!serializedForm)
                        serializedForm = serialize(formElm, true);
                    var validator = this.querySelector('js-validator');
                    var customValidatorFns;
                    if (validator) {
                        customValidatorFns = eval(validator.innerText);
                    }
                    if (customValidatorFns) {
                        for (var _i = 0, customValidatorFns_1 = customValidatorFns; _i < customValidatorFns_1.length; _i++) {
                            var customValidatorFn = customValidatorFns_1[_i];
                            if (!customValidatorFn(serializedForm))
                                return false;
                        }
                    }
                    return true;
                };
                XtalForm.prototype.updateInfo = function (formElm) {
                    if (!formElm)
                        formElm = this.querySelector('form');
                    if (this.disabled) {
                        this.recomputeOnEnable = true;
                        return;
                    }
                    var formData = serialize(formElm, true);
                    if (!this.validate(formElm, formData))
                        return;
                    this['_setSerializedForm'](formData);
                    var queryString = serialize(formElm, false);
                    var method = formElm.method.toLowerCase();
                    var action = formElm.action;
                    console.log(method);
                    switch (method) {
                        case 'get':
                            var delim = action.indexOf('?') > -1 ? '&' : '?';
                            this['_setComputedRequestUrl'](action + delim + queryString);
                            this['_setComputedRequestBody']('');
                            break;
                        case 'post':
                            this['_setComputedRequestUrl'](action);
                            this['_setComputedRequestBody'](queryString);
                            break;
                    }
                };
                XtalForm.prototype.ready = function () {
                    _super.prototype.ready.call(this);
                    var formElm = this.querySelector('form');
                    if (!formElm)
                        throw 'Need a form inside this element';
                    var childInputs = formElm.querySelectorAll('input');
                    for (var i = 0, ii = childInputs.length; i < ii; i++) {
                        var childInput = childInputs[i];
                        childInput['_value'] = childInput.value;
                        Object.defineProperty(childInput, "value", {
                            get: function () { return this._value; },
                            set: function (v) {
                                this._value = v;
                                if (!validateInputElement(this))
                                    return;
                                this.updateInfo(formElm);
                            }
                        });
                    }
                    this.updateInfo(formElm);
                };
                XtalForm.prototype.onDisabledChange = function (newVal) {
                    if (newVal)
                        this.updateInfo(null);
                };
                return XtalForm;
            }(Polymer.Element));
            customElements.define(XtalForm.is, XtalForm);
        }
        customElements.whenDefined('xtal-ball').then(function () { return initXtalForm(); });
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-form.js.map