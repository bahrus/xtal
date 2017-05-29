module xtal.elements{
    class XtalCheckboxMouseover extends HTMLElement{
        handleMouseOver(){
            console.log(this);
        }
    }
    customElements.define('xtal-checkbox-mouseover', XtalCheckboxMouseover);
}