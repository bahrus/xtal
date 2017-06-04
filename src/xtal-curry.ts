module xtal.elements{
    export interface IMessageOptions{
        bubbles?: boolean,
        composed?: boolean,
        detailFn?: (e: Event) => object,
    }
    export interface IClickMessageOptions extends IMessageOptions{

    }
    export interface IInputMessageOptions extends IMessageOptions{
        debounceInterval?: number,
    }
    export interface IXtalCurryProperties{
        clickMessage : string | polymer.PropObjectType,
        inputMessage: string | polymer.PropObjectType,
        clickMessageOptions: IClickMessageOptions | polymer.PropObjectType
        inputMessageOptions: IInputMessageOptions | polymer.PropObjectType
    }
    function initXtalCurry(){
        
        class XtalCurry extends Polymer.Element implements IXtalCurryProperties{
            clickMessage:string;inputMessage:string;
            eventListeners : {[key: string]: (e: Event) => void} = {};
            clickMessageOptions = {
                bubbles: true,
                composed: false,
            }as IClickMessageOptions;
            inputMessageOptions = {
                bubbles: true,
                composed: false,
                debounceInterval: 100,
                detailFn: e => {
                    const src = e.srcElement as HTMLInputElement
                    return {
                        name: src.name,
                        value: src.value,
                    }
                }
            } as IInputMessageOptions;

            static get is() {return 'xtal-curry';}
            static get properties() : IXtalCurryProperties{
                return {
                    clickMessage:{
                        type: String,
                        observer: 'registerClickHandler',
                    },
                    inputMessage:{
                        type: String,
                    },
                    inputMessageOptions:{
                        type: Object,
                    },
                    clickMessageOptions:{
                        type: Object
                    }
                }
            }
            disconnectedCallback(){
                super.disconnectedCallback();
                for(const key in this.eventListeners){
                    this.removeEventListener(key, this.eventListeners[key]);
                }
            }
            registerClickHandler(newVal){
                if(newVal){
                    this.addCustomEventListener(newVal, this.clickEventHandler);
                }
                
            }
            registerInputHandler(newVal){
                if(newVal){
                    this.addCustomEventListener(newVal, this.inputEventHandler);
                }
            }
            addCustomEventListener(key: string, listener: (e: Event) => void){
                this.eventListeners[key] = listener;
                this.addEventListener(key, listener);
            }
            
            clickEventHandler(e: Event){
                this.dispatchEvent(new CustomEvent(this.clickMessage, {
                    detail:   this.clickMessageOptions.detailFn ? this.clickMessageOptions.detailFn(e) : null,
                    bubbles:  this.clickMessageOptions.bubbles,
                    composed: this.clickMessageOptions.composed
                } as CustomEventInit));
            }

            inputEventHandler(e: Event){
                this.dispatchEvent(new CustomEvent(this.inputMessage, {
                    detail:   this.inputMessageOptions.detailFn ? this.clickMessageOptions.detailFn(e) : null,
                    bubbles:  this.inputMessageOptions.bubbles,
                    composed: this.inputMessageOptions.composed
                } as CustomEventInit));
            }
        }
        customElements.define(XtalCurry.is, XtalCurry)
    }
}