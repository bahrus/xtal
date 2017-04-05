module xtal.elements{
    interface IXtalCheckboxProperties{
        isChecked: boolean | polymer.PropObjectType,
        indeterminate: boolean | polymer.PropObjectType,
    }
    function initXtalCheckbox(){
        class XtalCheckbox extends Polymer.Element implements IXtalCheckboxProperties{
            static get is(){return 'xtal-checkbox';}
            static get properties() : IXtalCheckboxProperties{
                return {
                    isChecked: {
                        type: Boolean,
                        observer: 'checkedChangeHandler',
                        notify: true,
                        reflectToAttribute: true,
                    },
                    indeterminate:{
                        type: Boolean,
                        observer: 'indeterminateChangeHandler',
                        notify: true,
                        reflectToAttribute: true,
                    }
                };
            }
            isChecked: boolean = false;
            indeterminate: boolean = false;
            checkedChangeHandler(newVal){
                //this.$.checkbox.checked = newVal;
            }
            indeterminateChangeHandler(newVal){
                this.$.checkbox.indeterminate = newVal;
            }
            handleClickEvent(mouseEvent, ea){
                console.log({handleClickEvent: {mouseEvent: mouseEvent, ea: ea, checked: this.$.checkbox.checked}})
                this.isChecked = this.$.checkbox.checked;  //this fires a non bubbling event "is-checked"
                //this.fire('checkbox-checked', this.isChecked);
                this.dispatchEvent(new CustomEvent('checkbox-checked', {
                    bubbles: true,
                    composed: true,
                    detail:{
                        isChecked: this.isChecked
                    }
                    
                } as CustomEventInit));
            }
            ready(){
                super.ready()
                if(this.indeterminate) this.$.checkbox.indeterminate = true;
            }
        }
        customElements.define(XtalCheckbox.is, XtalCheckbox);
    }
    customElements.whenDefined('xtal-ball').then(()=> initXtalCheckbox());
    
}