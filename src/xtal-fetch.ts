module xtal.elements{
    interface IXtalFetchProperties{
        reqInfo: RequestInfo | polymer.PropObjectType,
        reqUrl: string | polymer.PropObjectType,
        reqInit: RequestInit | polymer.PropObjectType,
        debounceTimeInMs: number | polymer.PropObjectType,
        as: string | polymer.PropObjectType,
        result: any | polymer.PropObjectType,
    }
    class XtalFetch extends Polymer.Element implements IXtalFetchProperties{
        reqInfo: RequestInfo;
        reqInit: RequestInit;
        reqUrl: string;
        result: object;
        as = 'text';
        debounceTimeInMs: number
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
                reqUrl:{
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
            if(this.reqUrl){
                const _this = this;
                fetch(this.reqUrl).then(resp =>{
                    resp[_this.as]().then(val =>{
                        _this['_setResult'](val);
                        //_this.notifyPath('result');
                    })
                    
                })
            }
        }
        // ready(){
        //     super.ready();
            
        // }
    }

    customElements.define(XtalFetch.is, XtalFetch);
}