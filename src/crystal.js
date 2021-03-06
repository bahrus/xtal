var crystal;
(function (crystal) {
    var elements;
    (function (elements) {
        elements.jsXtaInitTagName = 'js-xtal-init';
        function nextDomBindElement(el) {
            let nextElement = el.nextElementSibling;
            while (nextElement) {
                const isAttr = nextElement.getAttribute('is');
                if (isAttr && (isAttr == 'dom-bind')) {
                    break;
                }
                nextElement = nextElement.nextElementSibling;
            }
            return nextElement;
        }
        elements.nextDomBindElement = nextDomBindElement;
        function nextNonScriptSibling(el) {
            let nextElement = el.nextElementSibling;
            if (!nextElement)
                return null;
            let tagName = nextElement.tagName;
            while (nextElement) {
                //let bKeepGoing = false
                switch (tagName) {
                    case 'SCRIPT':
                    case elements.jsXtaInitTagName:
                        //bKeepGoing = true;
                        break;
                    default:
                        return nextElement;
                }
                nextElement = nextElement.nextElementSibling;
                tagName = nextElement.tagName;
            }
            return nextElement;
        }
        elements.nextNonScriptSibling = nextNonScriptSibling;
        function setHashKey(obj, h) {
            if (h) {
                obj.$$hashKey = h;
            }
            else {
                delete obj.$$hashKey;
            }
        }
        function extend(dest, obj, deep) {
            const h = dest.$$hashKey;
            //for (let i = 0, ii = src.length; i < ii; ++i) {
            //const obj = src[i];
            if ((typeof obj !== 'object') && (typeof obj !== 'function')) {
                return;
            }
            const keys = Object.keys(obj);
            for (let j = 0, jj = keys.length; j < jj; j++) {
                const key = keys[j];
                const src = obj[key];
                if (deep && (typeof src === 'object')) {
                    if (src instanceof Date) {
                        dest[key] = new Date(src.valueOf());
                    }
                    else {
                        if (typeof dest[key] !== 'object')
                            dest[key] = Array.isArray(src) ? [] : {};
                        extend(dest[key], [src], true);
                    }
                }
                else {
                    dest[key] = src;
                }
            }
            //}
            setHashKey(dest, h);
            return dest;
        }
        elements.extend = extend;
        function performCustElActions(actions, target) {
            let htmlActionContext;
            for (let i = 0, ii = actions.length; i < ii; i++) {
                const action = actions[i];
                if (Array.isArray(action)) {
                    performCustElActions(action, target);
                    continue;
                }
                if (action.debug) {
                    debugger;
                }
                const doFn = action.do;
                if (doFn && typeof (doFn === 'function')) {
                    const polymerAction = action;
                    if (!htmlActionContext) {
                        htmlActionContext = {
                            element: target,
                        };
                    }
                    htmlActionContext.action = action;
                    doFn(htmlActionContext);
                    continue;
                }
                //#region merge object into custom element
                for (const key in action) {
                    if (target['get'] && target['set']) {
                        //polymer element
                        const currVal = target['get'](key);
                        const newOrExtendedVal = action[key];
                        if (!currVal) {
                            target['set'](key, newOrExtendedVal);
                        }
                        else {
                            //TODO:  untested condition
                            extend(currVal, newOrExtendedVal, true);
                            target['set'](key, currVal);
                        }
                    }
                    else {
                        //data-bind template, e.g.
                        console.log('key', key);
                        target[key] = action[key];
                    }
                }
                //#endregion
            }
        }
        elements.performCustElActions = performCustElActions;
        function evalInner(element, isTS) {
            let inner = element['getEffectiveChildNodes']()[0].nodeValue;
            if (isTS) {
                inner = util.stripTypings(inner);
            }
            const actionGetter = eval(inner);
            let actions;
            if (typeof actionGetter === 'function') {
                const context = {
                    element: element,
                };
                actions = actionGetter(context);
            }
            else {
                actions = actionGetter;
            }
            if (!Array.isArray(actions))
                actions = [actions];
            return actions;
        }
        elements.evalInner = evalInner;
        let util;
        (function (util) {
            function stripTypings(text) {
                //const tokenArray = multiSplit(text, [';', ','])
                const tokenArray = text.split(' ');
                for (let i = 0, ii = tokenArray.length; i < ii; i++) {
                    const token = tokenArray[i];
                    switch (token) {
                        case 'const':
                            if (i + 2 < ii) {
                                const nextToken = tokenArray[i + 1];
                                if (nextToken.indexOf(':') > -1) {
                                    tokenArray[i + 1] = nextToken.replace(':', '');
                                    tokenArray[i + 2] = '';
                                }
                            }
                            continue;
                    }
                }
                const text2 = tokenArray.join(' ');
                const tokenArray2 = splitPairs(text2, { lhs: '(', rhs: ')' });
                for (let i = 0, ii = tokenArray2.length; i < ii; i++) {
                    const token = tokenArray2[i];
                    if (token === '(' && i + 2 < ii) {
                        if (tokenArray2[i + 2] != ')') {
                            throw "Invalid expression";
                        }
                        const args = tokenArray2[i + 1].split(',');
                        const newArgs = args.map(s => substringBefore(s, ';'));
                        tokenArray2[i + 1] = newArgs.join(',');
                    }
                }
                return tokenArray2.join('');
            }
            util.stripTypings = stripTypings;
            function splitPairs(text, pair) {
                const returnObj = [];
                let region = [];
                for (let i = 0, ii = text.length; i < ii; i++) {
                    const chr = text[i];
                    switch (chr) {
                        case pair.rhs:
                        case pair.lhs:
                            returnObj.push(region.join(''));
                            returnObj.push(chr);
                            region = [];
                            break;
                        //case pair.rhs
                        default:
                            region.push(chr);
                    }
                }
                if (region.length > 0) {
                    returnObj.push(region.join(''));
                }
                return returnObj;
            }
            util.splitPairs = splitPairs;
            function substringBefore(value, search) {
                const iPos = value.indexOf(search);
                if (iPos < -1)
                    return value;
                return value.substr(0, iPos);
            }
            util.substringBefore = substringBefore;
        })(util = elements.util || (elements.util = {}));
    })(elements = crystal.elements || (crystal.elements = {}));
})(crystal || (crystal = {}));
//# sourceMappingURL=crystal.js.map