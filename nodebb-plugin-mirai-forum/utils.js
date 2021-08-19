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
};
