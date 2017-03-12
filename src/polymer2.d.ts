
declare module Polymer{
    export abstract class Element extends HTMLElement{
        connectedCallback();
        ready();
        resolveUrl(path: string);
        $;
        $$;
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
