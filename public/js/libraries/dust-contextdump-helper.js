(function (dust) {
    function jsonFilter(key, value) {
        if (typeof value === "function") {
            return value.toString();
        }
        return value;
    }

    /**
     * contextDump helper
     * @param key specifies how much to dump.
     * "current" dumps current context. "full" dumps the full context stack.
     * @param to specifies where to write dump output.
     * Values can be "console" or "output". Default is output.
     */
    dust.helpers.contextDump = function (chunk, context, bodies, params) {
        var p = params || {};
        var to = p.to || 'output';
        var key = p.key || 'current';
        var dump;

        to = dust.helpers.tap(to, chunk, context);
        key = dust.helpers.tap(key, chunk, context);
        if (key !== 'current') {
            if(key === 'full'){
                dump = JSON.stringify(context.stack, jsonFilter, 2);
            } else {
               dump = JSON.stringify(context.stack.head[key], jsonFilter, 2);
            }
        } else {
            dump = JSON.stringify(context.stack.head, jsonFilter, 2);
        }

        if (to === 'console') {
            _console.log(dump);
            return chunk;
        } else {
            return chunk.write(dump);
        }
    };
})(typeof exports !== 'undefined' ? module.exports = require('dustjs-linkedin-helpers') : dust);