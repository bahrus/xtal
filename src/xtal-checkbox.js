var xtal;
(function (xtal) {
    var elements;
    (function (elements) {
        function initXtalCheckbox() {
            class XtalCheckbox extends Polymer.Element {
                constructor() {
                    super(...arguments);
                    this.isChecked = false;
                    this.indeterminate = false;
                }
                static get is() { return 'xtal-checkbox'; }
                static get properties() {
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
                }
                checkedChangeHandler(newVal) {
                    //this.$.checkbox.checked = newVal;
                }
                indeterminateChangeHandler(newVal) {
                    this.$.checkbox.indeterminate = newVal;
                }
                handleClickEvent(mouseEvent, ea) {
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
                }
                ready() {
                    super.ready();
                    if (this.indeterminate)
                        this.$.checkbox.indeterminate = true;
                }
            }
            customElements.define(XtalCheckbox.is, XtalCheckbox);
        }
        initXtalCheckbox();
    })(elements = xtal.elements || (xtal.elements = {}));
})(xtal || (xtal = {}));
//# sourceMappingURL=xtal-checkbox.js.map