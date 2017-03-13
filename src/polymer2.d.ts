
declare module Polymer{
    export abstract class Element extends HTMLElement{
        connectedCallback();
        ready();
        resolveUrl(path: string);
        $;
        $$;
        debounce(name: string, fn: Function, timeInMilliSeconds: number);
        importHref(path: string, fnSuccess: Function, fnError: Function);
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
