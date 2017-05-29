module xtal.elements{
    class XtalCheckboxMouseover extends HTMLElement{
        handleMouseOver(){
            console.log(this);
        }
        init(){
            this.addEventListener('mouseover', this.handleMouseOver)
        }
    }
    customElements.define('xtal-checkbox-mouseover', XtalCheckboxMouseover);
}