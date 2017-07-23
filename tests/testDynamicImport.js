var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    function test() {
        return __awaiter(this, void 0, void 0, function* () {
            // import('./testLib').then(lib =>{
            //     console.log(lib.diag(5, 7));
            // })
            const lib = yield new Promise(function (resolve_1, reject_1) { require(['./testLib'], resolve_1, reject_1); });
            console.log(lib.diag(5, 7));
        });
    }
    test();
});
//# sourceMappingURL=testDynamicImport.js.map