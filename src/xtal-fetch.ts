module xtal.elements{
    // interface IFetchRequest{
    //     credentials?: 'include' | 'omit'
    // }
    interface IXtalFetchProperties{
        reqInit: RequestInit| polymer.PropObjectType,
        href: string | polymer.PropObjectType,
        debounceTimeInMs: number | polymer.PropObjectType,
        as: string | polymer.PropObjectType,
        result: any | polymer.PropObjectType,
        insertResults: boolean | polymer.PropObjectType,
    }
    function initXtalFetch(){
        class XtalFetch  extends xtal.elements['InitMerge'](Polymer.Element)  implements IXtalFetchProperties{
            reqInit = {
                credentials: 'include'
            } as RequestInit;
            href: string;
            result: object;
            as = 'text';
            _initialized = false;
            debounceTimeInMs: number;
            insertResults: boolean;
            static get is(){return 'xtal-fetch';}
            static get properties() : IXtalFetchProperties{
                return {
                    /**
                     * Possible values are 'text' and 'json'
                     */
                    as:{
                        type: String
                    },
                    debounceTimeInMs:{
                        type: Number
                    },
                    // reqInfo: {
                    //     type: Object,
                    // },
                    reqInit:{
                        type: Object
                    },
                    insertResults:{
                        type: Boolean
                    },
                    href:{
                        type: String,
                        observer: 'loadNewUrl'
                    },
                    /**
                     * The expression for where to place the result.
                     */
                    result:{
                        type: Object,
                        notify: true,
                        readOnly: true
                    },
                }
            }
            loadNewUrl(){
                if(!this._initialized) return;
                if(this.href){
                    const _this = this;
                    fetch(this.href, this.reqInit).then(resp =>{
                        resp[_this.as]().then(val =>{
                            _this['_setResult'](val);
                            if(typeof val === 'string' && this.insertResults){
                                this.innerHTML = val;
                            }
                            //_this.notifyPath('result');
                        });
                        
                    })
                }
            }

            connectedCallback(){
                super.connectedCallback();
                this.init().then(() => {
                    this._initialized = true;
                    this.loadNewUrl();
                });
            }
            
        }
        customElements.define(XtalFetch.is, XtalFetch);
    }
    
    customElements.whenDefined('xtal-ball').then(() => initXtalFetch());
    
}