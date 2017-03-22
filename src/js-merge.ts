module xtal.elements{
    interface JSMergeProperties{
        wrapObjectWithPath: string | polymer.PropObjectType,
        watch: object | polymer.PropObjectType,
        result: object | polymer.PropObjectType,
    }
    class JSMerge extends Polymer.Element implements JSMergeProperties{
        static get is(){return 'js-merge';}
        static get properties() : JSMergeProperties{
            return {
                /**
                 * Wrap the incoming object inside a new empty object, with key equal to this value.
                 * E.g. if the incoming object is {foo: 'hello', bar: 'world'}
                 * and wrap-object-with-path = 'myPath'
                 * then the source object which be merged into is:
                 * {myPath: {foo: 'hello', bar: 'world'}}
                 */
                wrapObjectWithPath:{
                    type: String
                },
                /**
                * The expression to observe and transform when it changes.
                */
                watch:{
                    type: Object,
                    observer: 'onWatchChange'
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
        /**
        * Fired when a transform is in progress.
        *
        * @event transform
        */

        _objectsToMerge: Function[];

        wrapObjectWithPath: string;
        watch: object;
        result: object;

       /**
       * Deep merge two objects.
       * Inspired by Stackoverflow.com/questions/27936772/deep-object-merging-in-es6-es7
       * @param target
       * @param source
       * 
       */
        mergeDeep(target, source) {
            if(typeof target !== 'object') return;
            if(typeof source !== 'object') return;
            for (const key in source) {
                const sourceVal = source[key];
                const targetVal = target[key];
                if(!sourceVal) continue; //TODO:  null out property?
                if(!targetVal){
                    target[key] = sourceVal;
                    continue;
                }
                if(Array.isArray(sourceVal) && Array.isArray(targetVal)){
                    //warning!! code below not yet tested
                    if(targetVal.length > 0 && typeof targetVal[0].id === 'undefined') continue;
                    for(var i = 0, ii = sourceVal.length; i < ii; i++){
                        const srcEl = sourceVal[i];
                        if(typeof srcEl.id === 'undefined') continue;
                        const targetEl = targetVal.find(function(el){return el.id === srcEl.id;});
                        if(targetEl){
                            this.mergeDeep(targetEl, srcEl);
                        }else{
                            targetVal.push(srcEl);
                        }
                    }
                    continue;
                }
                switch(typeof sourceVal){
                    case 'object':
                        switch(typeof targetVal){
                            case 'object':
                                this.mergeDeep(targetVal, sourceVal);
                                break;
                            default:
                                target[key] = sourceVal;
                                break;
                        }
                        break;
                    default:
                        target[key] = sourceVal;
                }
            }
            return target;
        }

        onWatchChange(newVal){
            let transformedObj;
            if(this.wrapObjectWithPath) {
                transformedObj  = {};
                transformedObj[this.wrapObjectWithPath] = newVal;
            }else{
                transformedObj = newVal;
            }
            if(!this._objectsToMerge){
                try{
                    this._objectsToMerge = eval(this.innerText);
                }catch(e){
                    console.error("Unable to parse " + this.innerText);
                }
            }
            if(this._objectsToMerge && transformedObj){
                for(let i  = 0, ii = this._objectsToMerge.length; i < ii; i++)
                {
                    const objToMerge = this._objectsToMerge[i];
                    switch(typeof(objToMerge)){
                        case 'object':
                            this.mergeDeep(transformedObj, objToMerge);
                            break;
                        default:
                            throw 'TODO:  error message'
                        
                    }
                }
            }
            this['_setResult'](transformedObj);
        }
    }
    customElements.define(JSMerge.is, JSMerge);
}