module xtal.elements{
    interface IJSTransformerContext{
        element: JSTransformer,
        count: number
    }
    interface JSTransformerArgument{
        context?: IJSTransformerContext
    }
    interface JSTransformerProperties{
        watch: object | polymer.PropObjectType,
        result: object | polymer.PropObjectType,
        argument: JSTransformerArgument | polymer.PropObjectType,
        
    }
    customElements.whenDefined('xtal-ball').then(() =>{
        /**
        * '<js-transformer>' is a Polymer based custom element, that watches for a property of the parent custom element,
        * applies either a JavaScript method in the parent custom element via event handling, 
        * and / or it transforms the object based on a global (namespaced)
        * common function contained within the tag (use hidden attribute)
        */
        class JSTransformer extends Polymer.Element implements JSTransformerProperties{
            static get is(){return 'js-transformer';}
            static get properties() : JSTransformerProperties{
                return {
                    /**
                     * The expression to observe and transform when it changes.
                     */
                    watch:{
                        type: Object,
                        observer: 'onPropsChange'
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
                     * Configuration argument to pass to the transformer
                     */
                    argument:{
                        type: Object
                    },
                    
                }
            }
            watch: object;
            result: object;
            argument: JSTransformerArgument;
            wrapObjectWithPath: string;
            /**
            * Fired twice when a transform is in progress.  Once before 
            *
            * @event transform
            */
            _transformerFns: Function[];
        



            onPropsChange(newVal){
                if(!this._transformerFns){
                    try{
                        this._transformerFns = eval(this.innerText);
                    }catch(e){
                        console.error("Unable to parse " + this.innerText);
                    }
                }
                
                var arg = this.argument;
                if(!arg){
                    arg = {};
                };
                arg.context = {
                    element: this,
                    count: 0,
                };
                var detail = {obj: newVal, arg: arg};
                //this.fire('transform', detail);
                this.dispatchEvent(new CustomEvent('transform', {
                    detail: detail
                }));
                arg.context.count++;
                let transformedObj = detail.obj;
                if(this._transformerFns ){
                    for(let i  = 0, ii = this._transformerFns.length; i < ii; i++)
                    {
                        const transformerFnOrObj = this._transformerFns[i];
                        switch(typeof(transformerFnOrObj)){
                            case 'function':
                                transformedObj = transformerFnOrObj(transformedObj, arg);
                                break;
                            default:
                                throw 'TODO:  error message'
                        }
                        arg.context.count++;

                    }
                }


                detail.obj = transformedObj;
                this.dispatchEvent(new CustomEvent('transform', {
                    detail: detail
                }));
                delete arg.context;
                this['_setResult'](detail.obj);

            }

            connectedCallback(){
                super.connectedCallback();
                
                if(!Array.isArray(this._transformerFns)) delete this._transformerFns;
            }
        }

        customElements.define(JSTransformer.is, JSTransformer);
    })

}