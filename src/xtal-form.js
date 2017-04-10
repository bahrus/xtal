var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        function serialize(form, asObject) {
            if (!form || form.nodeName !== "FORM") {
                return;
            }
            //var i, j, q = [];
            let q;
            let p;
            if (asObject) {
                p = {};
            }
            else {
                q = [];
            }
            for (let i = form.elements.length - 1; i >= 0; i = i - 1) {
                const elm = form.elements[i];
                if (elm.name === "") {
                    continue;
                }
                if (elm.name.indexOf('_ignore_') === 0) {
                    continue;
                }
                let val;
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
                                const selm = elm;
                                const options = selm.options;
                                for (let j = options.length - 1; j >= 0; j = j - 1) {
                                    if (options[j]['selected']) {
                                        let val2;
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
            const val = inputEl.value;
            if (inputEl.required && val.length === 0)
                return false;
            if (inputEl.maxLength != -1 && val.length > inputEl.maxLength)
                return false;
            if (inputEl.pattern) {
                const regExp = new RegExp(inputEl.pattern);
                if (!regExp.test(val))
                    return false;
            }
            //TODO:  set class?
            return true;
        }
        function initXtalForm() {
            class XtalForm extends Polymer.Element {
                constructor() {
                    super(...arguments);
                    this.disabled = false;
                    this.recomputeOnEnable = false;
                }
                static get is() { return 'xtal-form'; }
                static get properties() {
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
                }
                validate(formElm, serializedForm) {
                    if (!formElm)
                        formElm = this.querySelector('form');
                    if (!serializedForm)
                        serializedForm = serialize(formElm, true);
                    const validator = this.querySelector('js-validator');
                    let customValidatorFns;
                    if (validator) {
                        customValidatorFns = eval(validator.innerText);
                    }
                    if (customValidatorFns) {
                        for (const customValidatorFn of customValidatorFns) {
                            if (!customValidatorFn(serializedForm))
                                return false;
                        }
                    }
                    return true;
                }
                updateInfo(formElm) {
                    if (!formElm)
                        formElm = this.querySelector('form');
                    if (this.disabled) {
                        this.recomputeOnEnable = true;
                        return;
                    }
                    const formData = serialize(formElm, true);
                    if (!this.validate(formElm, formData))
                        return;
                    this['_setSerializedForm'](formData);
                    const queryString = serialize(formElm, false);
                    const method = formElm.method.toLowerCase();
                    const action = formElm.action;
                    switch (method) {
                        case 'get':
                            const delim = action.indexOf('?') > -1 ? '&' : '?';
                            this['_setComputedRequestUrl'] = action + delim + queryString;
                            this['_setcomputedRequestBody'] = '';
                            break;
                        case 'post':
                            this['_setComputedRequestUrl'] = action;
                            this['_setcomputedRequestBody'] = queryString;
                            break;
                    }
                }
                ready() {
                    super.ready();
                    const formElm = this.querySelector('form');
                    if (!formElm)
                        throw 'Need a form inside this element';
                    const childInputs = formElm.querySelectorAll('input');
                    for (let i = 0, ii = childInputs.length; i < ii; i++) {
                        const childInput = childInputs[i];
                        childInput['_value'] = childInput.value;
                        Object.defineProperty(childInput, "value", {
                            get: function () { return this._value; },
                            set: function (v) {
                                this._value = v;
                                if (!validateInputElement(this))
                                    return;
                                this.updateInfo(formElm);
                                //if(_thisForm['auto'] && formElm.checkValidity()) {
                            }
                        });
                    }
                    this.updateInfo(formElm);
                }
            }
            customElements.define(XtalForm.is, XtalForm);
        }
        customElements.whenDefined('xtal-ball').then(() => initXtalForm());
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-form.js.map