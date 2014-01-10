(function (dust) {
    /**
     * contextDump helper
     * @param arr specifies how much to dump.
     * "current" dumps current context. "full" dumps the full context stack.
     * @param val specifies where to write dump output.
     * Values can be "console" or "output". Default is output.
     */
    dust.helpers.indexOf = function (chunk, context, bodies, params) {
        var p = params || {};
        var arr = p.arr;
        var val = p.val;

        arr = dust.helpers.tap(arr, chunk, context);
        val = dust.helpers.tap(val, chunk, context);

        console.log('array',arr)
        console.log('value',val)

        console.log('index',arr.indexOf(val));
        return chunk.write();
    };
})(typeof exports !== 'undefined' ? module.exports = require('dustjs-linkedin-helpers') : dust);