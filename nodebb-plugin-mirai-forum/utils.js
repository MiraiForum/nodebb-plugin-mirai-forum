
const codeRegex = /\<(pre|code)\>.*?\<\/\1\>/gs;
const code_tmpPlaceHolderRegex = /\!\!CCDC_\#(?:.+?)\#/g

function cholder() {
    return "!!CCDC_#" + Date.now() + Math.random() + "#";
}

module.exports = {
    /**
     * @param {string} src 
     * @param {string | RegExp} rep 
     * @param { (s:string) => string } replacer 
     * @returns {string}
     */
    str_replaceNotMatch: function (src, rep, replacer) {
        var start = 0;
        var result = [];
        src.replace(rep, function (value) {
            let regionStart = arguments[arguments.length - 2];

            result.push(replacer(src.substring(start, regionStart)));

            result.push(value);
            start = regionStart + value.length;
            return value;
        });
        result.push(replacer(src.substring(start)));
        return result.join("");
    },
    /**
     * @param {string} src 
     * @param { (s: string) => string } processor
     * @returns {string} 
     */
    str_earse_code: function (src, processor) {
        let rsp = src;
        let storages = {};
        rsp = rsp.replace(codeRegex, (v) => {
            let id = cholder();
            storages[id] = v;
            return id;
        });

        rsp = processor(rsp);
        rsp = rsp.replace(code_tmpPlaceHolderRegex, (v) => {
            let tmp = storages[v];
            if (tmp === undefined) { return '$$ERROR_CODE_NOT_FOUND$$'; }
            return tmp
        })

        return rsp;
    },
};
