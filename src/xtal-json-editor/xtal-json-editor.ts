declare var JSONEditor;
module xtal.exports{
    customElements.whenDefined('xtal-ball').then(() =>{
        class XtalJsonEditor extends Polymer.Element{
            static get is(){return 'xtal-json-editor';}
            static get properties(){
                return{
                    /**
                    * The expression to observe and transform when it changes.
                    */
                    watch:{
                        type: Object,
                        observer: 'onWatchChange'
                    },
                }
            }

            ready(){
                super.ready();
                var json = {
                    "Array": [1, 2, 3],
                    "Boolean": true,
                    "Null": null,
                    "Number": 123,
                    "Object": {"a": "b", "c": "d"},
                    "String": "Hello World"
                };
                this.onWatchChange(json);
            //     const jsonEditorDependency : xtal.elements.IDynamicJSLoadStep[] = [
            //         {src: this.resolveUrl('jsoneditor.min.js')}
            //     ]
            //     xtal.elements.downloadJSFilesInParallelButLoadInSequence(slickJSDependencies, () => {
            }
            onWatchChange(newVal){
                const options = {};
                const editor = new JSONEditor(this, options);
                editor.set(newVal);

                // // get json
                // var json = editor.get();
            }
        }
        customElements.define(XtalJsonEditor.is, XtalJsonEditor);
    });
}