var crystal;
(function (crystal) {
    var elements;
    (function (elements) {
        elements.jsXtaInitTagName = 'js-xtal-init';
        function nextDomBindElement(el) {
            var nextElement = el.nextElementSibling;
            while (nextElement) {
                var isAttr = nextElement.getAttribute('is');
                if (isAttr && (isAttr == 'dom-bind')) {
                    break;
                }
                nextElement = nextElement.nextElementSibling;
            }
            return nextElement;
        }
        elements.nextDomBindElement = nextDomBindElement;
        function nextNonScriptSibling(el) {
            var nextElement = el.nextElementSibling;
            if (!nextElement)
                return null;
            var tagName = nextElement.tagName;
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
            var h = dest.$$hashKey;
            //for (let i = 0, ii = src.length; i < ii; ++i) {
            //const obj = src[i];
            if ((typeof obj !== 'object') && (typeof obj !== 'function')) {
                return;
            }
            var keys = Object.keys(obj);
            for (var j = 0, jj = keys.length; j < jj; j++) {
                var key = keys[j];
                var src = obj[key];
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
            var htmlActionContext;
            for (var i = 0, ii = actions.length; i < ii; i++) {
                var action = actions[i];
                if (Array.isArray(action)) {
                    performCustElActions(action, target);
                    continue;
                }
                if (action.debug) {
                    debugger;
                }
                var doFn = action.do;
                if (doFn && typeof (doFn === 'function')) {
                    var polymerAction = action;
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
                for (var key in action) {
                    if (target['get'] && target['set']) {
                        //polymer element
                        var currVal = target['get'](key);
                        var newOrExtendedVal = action[key];
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
            var inner = element['getEffectiveChildNodes']()[0].nodeValue;
            if (isTS) {
                inner = util.stripTypings(inner);
            }
            var actionGetter = eval(inner);
            var actions;
            if (typeof actionGetter === 'function') {
                var context = {
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
        var util;
        (function (util) {
            function stripTypings(text) {
                //const tokenArray = multiSplit(text, [';', ','])
                var tokenArray = text.split(' ');
                for (var i = 0, ii = tokenArray.length; i < ii; i++) {
                    var token = tokenArray[i];
                    switch (token) {
                        case 'const':
                            if (i + 2 < ii) {
                                var nextToken = tokenArray[i + 1];
                                if (nextToken.indexOf(':') > -1) {
                                    tokenArray[i + 1] = nextToken.replace(':', '');
                                    tokenArray[i + 2] = '';
                                }
                            }
                            continue;
                    }
                }
                var text2 = tokenArray.join(' ');
                var tokenArray2 = splitPairs(text2, { lhs: '(', rhs: ')' });
                for (var i = 0, ii = tokenArray2.length; i < ii; i++) {
                    var token = tokenArray2[i];
                    if (token === '(' && i + 2 < ii) {
                        if (tokenArray2[i + 2] != ')') {
                            throw "Invalid expression";
                        }
                        var args = tokenArray2[i + 1].split(',');
                        var newArgs = args.map(function (s) { return substringBefore(s, ';'); });
                        tokenArray2[i + 1] = newArgs.join(',');
                    }
                }
                return tokenArray2.join('');
            }
            util.stripTypings = stripTypings;
            function splitPairs(text, pair) {
                var returnObj = [];
                var region = [];
                for (var i = 0, ii = text.length; i < ii; i++) {
                    var chr = text[i];
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
                var iPos = value.indexOf(search);
                if (iPos < -1)
                    return value;
                return value.substr(0, iPos);
            }
            util.substringBefore = substringBefore;
        })(util = elements.util || (elements.util = {}));
    })(elements = crystal.elements || (crystal.elements = {}));
})(crystal || (crystal = {}));
//# sourceMappingURL=crystal.js.map