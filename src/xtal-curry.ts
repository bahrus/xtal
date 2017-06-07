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
            __inputDebouncer;
            clickMessageOptions = {
                bubbles: true,
                composed: false,
            }as IClickMessageOptions;
            inputMessageOptions = {
                bubbles: true,
                composed: false,
                debounceInterval: 100,
                
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
                        observer: 'registerInputHandler'
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
                    this.addCustomEventListener('click', this.clickEventHandler);
                }
                
            }
            registerInputHandler(newVal){
                if(newVal){

                    if(!this.__inputDebouncer){
                        const _this = this;
                        this.__inputDebouncer = xtal.elements['debounce']((e) =>{
                            if(!this.inputMessageOptions.detailFn){
                                this.inputMessageOptions.detailFn = (e: Event) => {
                                    const src = e.srcElement as HTMLInputElement
                                    return {
                                        name: src.name,
                                        value: src.value,
                                    }
                                }
                            
                            }
                            _this.dispatchEvent(new CustomEvent(this.inputMessage, {
                                detail:   _this.inputMessageOptions.detailFn ? _this.inputMessageOptions.detailFn(e) : null,
                                bubbles:  _this.inputMessageOptions.bubbles,
                                composed: _this.inputMessageOptions.composed
                            } as CustomEventInit));
                        }, this.inputMessageOptions.debounceInterval);
                    }
                    this.addCustomEventListener('input', this.__inputDebouncer);
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

            // inputEventHandler(e: Event){
                
            //     console.log('in inputEventHandler');
            //     xtal.elements['debounce'](() =>{
            //         console.log('debouncer');
            //         _this.dispatchEvent(new CustomEvent(this.inputMessage, {
            //             detail:   _this.inputMessageOptions.detailFn ? _this.clickMessageOptions.detailFn(e) : null,
            //             bubbles:  _this.inputMessageOptions.bubbles,
            //             composed: _this.inputMessageOptions.composed
            //         } as CustomEventInit));
            //     }, this.inputMessageOptions.debounceInterval)
                
            // }
        }
        customElements.define(XtalCurry.is, XtalCurry)
    }
    customElements.whenDefined('xtal-ball').then(() => initXtalCurry());
}