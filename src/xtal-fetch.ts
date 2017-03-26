module xtal.elements{
    interface IXtalFetchProperties{
        reqInfo: RequestInfo | polymer.PropObjectType,
        href: string | polymer.PropObjectType,
        reqInit: RequestInit | polymer.PropObjectType,
        debounceTimeInMs: number | polymer.PropObjectType,
        as: string | polymer.PropObjectType,
        result: any | polymer.PropObjectType,
        insertResults: boolean | polymer.PropObjectType,
    }
    function initXtalFetch(){
        class XtalFetch extends Polymer.Element implements IXtalFetchProperties{
            reqInfo: RequestInfo;
            reqInit: RequestInit;
            href: string;
            result: object;
            as = 'text';
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
                    reqInfo: {
                        type: Object,
                    },
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
                if(this.href){
                    const _this = this;
                    fetch(this.href).then(resp =>{
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
            
        }
        customElements.define(XtalFetch.is, XtalFetch);
    }
    //function waitForPolymerElement(){if(typeof Polymer === 'undefined' || Polymer.Element === undefined){setTimeout(waitForPolymerElement, 50);return;}
        initXtalFetch();
   // }
    //waitForPolymerElement();

    
}