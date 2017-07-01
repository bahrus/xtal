module xtal.elements{
    // interface IFetchRequest{
    //     credentials?: 'include' | 'omit'
    // }
    interface IXtalFetchProperties{
        as: string | polymer.PropObjectType,
        debounceTimeInMs: number | polymer.PropObjectType,
        fetch: boolean | polymer.PropObjectType,
        forEach: string | polymer.PropObjectType,
        href: string | polymer.PropObjectType,
        inEntities: any[] | polymer.PropObjectType,
        insertResults: boolean | polymer.PropObjectType,
        reqInit: RequestInit| polymer.PropObjectType,
        result: any | polymer.PropObjectType,
        setPath: string | polymer.PropObjectType,
    }
    function initXtalFetch(){
        class XtalFetch  extends xtal.elements['InitMerge'](Polymer.Element)  implements IXtalFetchProperties{
            /**
            * Fired  when the watched object changes.  Consumers of this component subscribe to this event, 
            * in order to apply transformers on the object.
            *
            * @event EntityInfoReceived
            */
            reqInit: RequestInit;
            href: string; inEntities: any[]; result: object; forEach; fetch; setPath;
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
                    /**
                     * Needs to be true for any request to be made.
                     */
                    fetch:{
                        type:Boolean,
                        observer: 'loadNewUrl'
                    },
                    /**
                     * A comma delimited list of keys to pluck from in-entities
                     */
                    forEach:{
                        type: Boolean
                    },
                    /**
                     * Base url
                     */
                    href:{
                        type: String,
                        observer: 'loadNewUrl'
                    },
                    /**
                     * An array of entities that forEach keys will be plucked from.
                     * Fetch requests will be made iteratively (but in parallel) for each such entity
                     */
                    inEntities:{
                        type: Array,
                        observer: 'loadNewUrl'
                    },
                    /**
                     * Place the contents of the fetch inside the tag itself.
                     */
                    insertResults:{
                        type: Boolean
                    },
                    /**
                     * The second parameter of the fetch call.  
                     * See, e.g. https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch
                     */
                    reqInit:{
                        type: Object
                    },
                    
                    
                    /**
                     * The expression for where to place the result.
                     */
                    result:{
                        type: Object,
                        notify: true,
                        readOnly: true
                    },

                    /**
                     * When looping through entities, calling fetch, place the results of the fetch in the path specified by this 
                     * property.
                     */
                    setPath:{
                        type: String,
                        value: 'result'
                    }
                }
            }
            loadNewUrl(){
                if(!this._initialized) return;
                if(!this.fetch) return;
                if(this.href){
                    const _this = this;
                    if(this.forEach){
                        if(!this.inEntities) return;
                        this.inEntities.forEach(entity => {
                            const keys = this.forEach.split(',');
                            let href = this.href;
                            for(const key of keys){
                                href = href.replace(':' + key, entity[key]);
                            }
                            fetch(href, this.reqInit).then(resp =>{
                                resp[_this.as]().then(val =>{
                                    entity[this.setPath] = val;
                                });
                            
                            })
                        })
                    }else{
                        fetch(this.href, this.reqInit).then(resp =>{
                            resp[_this.as]().then(val =>{
                                _this['_setResult'](val);
                                if(typeof val === 'string' && this.insertResults){
                                    this.innerHTML = val;
                                }
                            });
                            
                        })
                    }
                    
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
    customElements.whenDefined('dom-module').then(() =>{
        console.log('dom-module loaded.  Polymer.Element = ');
        console.log(Polymer.Element);
    });
    customElements.whenDefined('xtal-ball').then(() => initXtalFetch());
    
}