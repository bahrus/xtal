module xtal.elements{
    interface IXtalBrowserWindow{
        linkOnly: boolean | polymer.IPolymerType,
        sandBox: string | polymer.IPolymerType,
        windowTop: number | polymer.IPolymerType,
        width: string | polymer.IPolymerType,
        collapsedText: string | polymer.IPolymerType,
        clicked: boolean | polymer.IPolymerType
    }
    export class XtalBrowserWindow extends Polymer.Element implements IXtalBrowserWindow {
        static get is() { return 'xtal-browser-window'; }
        linkOnly = false;
        sandBox = '';
        windowTop = 0;
        width = '';
        collapsedText = '►';
        clicked = false;
        static get properties() : IXtalBrowserWindow{
            return {
                linkOnly:{
                    type: Boolean
                },
                sandBox:{
                    type: String
                },
                windowTop:{
                    type: Number
                },
                width:{
                    type: String,
                    value: '90%'
                },
                collapsedText:{
                    type: String,
                    value: '►'
                },
                clicked:{
                    type: Boolean,
                    notify: true,
                    reflectToAttribute: true
                } 
            }

        }
        constructor() {
            super();
        }
        connectedCallback() {
            super.connectedCallback();
        }
        ready(){
            super.ready();
            var aLink = this.children[0];
            aLink.target = '_blank';
            if(this.sandBox){
                var iFrame = this.$.iframe;
                iFrame.setAttribute('sandbox', this.sandBox);
            }
        }
        handleOnLoad(){
            this.$.div_iframe.scrollTop = this.windowTop;
        }
        markClicked(){
            this.clicked = true;
        }
        toggleIFrame(){
            this.clicked = true;
            var aLink = this.children[0];
            if(this.linkOnly){
                window.open(aLink.href);
                return;
            }
            var iFrame = this.$.iframe;
            var toggleButton = this.$.toggle_button;
            var divIFrame = this.$.div_iframe;
            var div_noFrame = this.$.div_noFrame;
            if(divIFrame.style.display ==='none'){
                divIFrame.style.display = 'block';
                div_noFrame.style.display = 'none';
                
                iFrame.src = aLink.href;
                toggleButton.innerText = '▼';
            }else{
                iFrame.src='about:blank';
                divIFrame.style.display = 'none';
                div_noFrame.style.display = 'block';
                toggleButton.innerText = this.collapsedText;
            }
            
        }
    }
}

customElements.define(xtal.elements.XtalBrowserWindow.is, xtal.elements.XtalBrowserWindow);