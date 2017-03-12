
declare module Polymer{
    export abstract class Element{
        connectedCallback();
        ready();
        $;
        children: any[];
    }
}

declare namespace polymer{
    export interface IPolymerType{
        type: Function,
        value?: any,
        notify?: boolean,
        reflectToAttribute?: boolean,
        readOnly?: boolean,
        observer?: string,
    }
}
