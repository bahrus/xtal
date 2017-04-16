///<reference path="../../node_modules/@types/jsoneditor/index.d.ts"/>

//type JSONEditor =  jsoneditor.JSONEditor;
module xtal.exports{
    interface IXtalJsonEditorProperties{
        watch: object | polymer.PropObjectType,
        options: jsoneditor.JSONEditorOptions | polymer.PropObjectType
    }
    customElements.whenDefined('xtal-ball').then(() =>{
        /**
         * Polymer based web component wrapper around the JSON Editor api
         * https://github.com/josdejong/jsoneditor
         */
        class XtalJsonEditor extends Polymer.Element implements IXtalJsonEditorProperties{
            static get is(){return 'xtal-json-editor';}
            watch: object;
            options: jsoneditor.JSONEditorOptions;
            static get properties() : IXtalJsonEditorProperties{
                return{
                    /**
                    * The expression that points to an object to edit.
                    */
                    watch:{
                        type: Object,
                        observer: 'onPropsChange'
                    },
                    /**
                     * JsonEditor options, implements jsoneditor.JSONEditorOptions
                     */
                    options:{
                        type: Object,
                        observer: 'onPropsChange'
                    }
                }
            }
            private _jsonEditor: JSONEditor
            get jsonEditor(){
                return this._jsonEditor
            }
            onPropsChange(newVal){
                if(!this.watch) return;
                this.$.xcontainer.innerHTML = '';
                this._jsonEditor = new JSONEditor(this.$.xcontainer as HTMLElement, this.options);
                this._jsonEditor.set(this.watch);
            }
        }
        customElements.define(XtalJsonEditor.is, XtalJsonEditor);
    });
}