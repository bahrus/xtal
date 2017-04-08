module xtal.elements{
    interface IXtalPrepProperties{
        selector: string | polymer.PropObjectType,
        targetProp: string | polymer.PropObjectType,
        jsModel: string | polymer.PropObjectType
    }
    function initXtalPrep(){
        class XtalPrep extends Polymer.Element implements IXtalPrepProperties{
            selector;
            targetProp;
            jsModel;
            static get is(){return 'xtal-prep';}
            static get properties() : IXtalPrepProperties{
                return{
                    /**
                     * CSS selector for a target custom element to dump the inner contents of the tag
                     */
                    selector:{
                        type: String
                    },
                    /**
                     * check if property exists on element.  When it does, element is ready to dump contents
                    */
                    targetProp:{
                        type: String
                    },
                    /**
                     * Name of a global variable where model for inner contents is derived
                    */
                    jsModel:{
                        type: String
                    },

                }
            }
            checkAndDumpWhenReady(){
                const containerElement = document.querySelector(this.selector) as HTMLElement; 
                if(!containerElement) return;
                const custElName = containerElement.tagName.toLowerCase();
                customElements.whenDefined(custElName).then(() => {
                    if(this.jsModel){
                        const model = eval(this.jsModel);
                        containerElement[this.targetProp] = model;
                    }else{
                        containerElement.innerHTML = this.innerHTML;
                    }
                })
                
            }
        }
    }
    customElements.whenDefined('xtal-ball').then(() => initXtalPrep());
}