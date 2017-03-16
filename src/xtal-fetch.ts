module xtal.elements{
    interface IXtalFetchProperties{
        reqInfo: RequestInfo | polymer.IPolymerPropertyInfo,
        reqURL: string | polymer.IPolymerPropertyInfo,
        reqInit: RequestInit | polymer.IPolymerPropertyInfo,
        debounceTimeInMs: number | polymer.IPolymerPropertyInfo,
    }
    export class XtalFetch extends Polymer.Element implements IXtalFetchProperties{
        reqInfo: RequestInfo;
        reqInit: RequestInit;
        reqURL: string;
        debounceTimeInMs: number
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
                reqURL:{
                    type: String,
                }
            }
        }
    }
}