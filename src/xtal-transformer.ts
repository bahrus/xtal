module xtal.elements{
    function initXtalTransformer(){
        interface IJSTransformerContext{
            element: XtalTransformer,
        }
        interface XtalTransformerArgument{
            context?: IJSTransformerContext
        }
        interface XtalTransformerProperties{
            watch: object | polymer.PropObjectType,
            result: object | polymer.PropObjectType,
            argument: XtalTransformerArgument | polymer.PropObjectType,
            
        }
        /**
        * '<xtal-transformer>' is a Polymer based custom element, that watches for a property of the parent custom element,
        * and applies a JavaScript method in the host custom element via event handling. 
        */
        class XtalTransformer extends Polymer.Element implements XtalTransformerProperties{
            
            /**
            * Fired  when the watched object changes.  Consumers of this component subscribe to this event, 
            * in order to apply transforms on the object, and pass back other.
            *
            * @event ready-for-processing
            */
            static get is(){return 'xtal-transformer';}
            static get properties() : XtalTransformerProperties{
                return {
                    /**
                     * The expression to observe and transform when it changes.
                     */
                    watch:{
                        type: Object,
                        observer: 'onPropsChange'
                    },
                    /**
                     * The expression for where to place the result of the transformation
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
            argument: XtalTransformerArgument;
            //wrapObjectWithPath: string;

            
        



            onPropsChange(newVal){
                var arg = this.argument;
                if(!arg){
                    arg = {};
                };
                arg.context = {
                    element: this,
                };
                var detail = {obj: newVal, arg: arg};
                //this.fire('transform', detail);
                this.dispatchEvent(new CustomEvent('ready-for-processing', {
                    detail: detail
                }));
                this['_setResult'](detail.obj);

            }

        }

        customElements.define(XtalTransformer.is, XtalTransformer);        
    }
    customElements.whenDefined('poly-prep').then(() =>initXtalTransformer());

}