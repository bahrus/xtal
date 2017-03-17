module xtal.elements{
    interface IXtalFetchProperties{
        reqInfo: RequestInfo | polymer.PropObjectType,
        reqUrl: string | polymer.PropObjectType,
        reqInit: RequestInit | polymer.PropObjectType,
        debounceTimeInMs: number | polymer.PropObjectType,
        result: any | polymer.PropObjectType,
    }
    export class XtalFetch extends Polymer.Element implements IXtalFetchProperties{
        reqInfo: RequestInfo;
        reqInit: RequestInit;
        reqUrl: string;
        result: object;
        debounceTimeInMs: number
        static get is(){return 'xtal-fetch';}
        static get properties() : IXtalFetchProperties{
            return {
                debounceTimeInMs:{
                    type: Number
                },
                reqInfo: {
                    type: Object,
                },
                reqInit:{
                    type: Object
                },
                reqUrl:{
                    type: String,
                    observer: 'loadNewUrl'
                },
                /**
                * The expression for where to place the result.
                */
                 result:{
                    type: String,
                    notify: true,
                    readOnly: true
                },
            }
        }
        loadNewUrl(){
            if(this.reqUrl){
                const _this = this;
                fetch(this.reqUrl).then(resp =>{
                    resp.text().then(txt =>{
                        _this['_setResult'](txt);
                        //_this.notifyPath('result');
                    })
                    
                })
            }
        }
        // ready(){
        //     super.ready();
            
        // }
    }

    customElements.define(xtal.elements.XtalFetch.is, xtal.elements.XtalFetch);
}