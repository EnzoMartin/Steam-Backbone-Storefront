/**
 * Library of small useful global functions
 * @module Lib
 */
define(['BB'], function(BB){
    var Lib = {};

    /**
     * Spawns an alert dialogue
     * @param alertData {*}
     * @example BBA.alert({title:'Title',message:'Secondary text',type:'danger',static:false})
     * @event module:Lib#alert
     */
    Lib.alert = function(alertData){
        var header = BB.get({view:'header'});
        header.trigger('alert', alertData);
    };

    /**
     * Pops a modal window
     * @param data {*}
     * @param [callback] function Executed when user clicks the confirm button
     * @example BBA.modal({button:'success',buttonText:'Confirm',title:'Confirm action',subtitle:'Small text next to title',message:'Please confirm your selection'},function(){ return true; })
     * @event module:Lib#modal
     */
    Lib.modal = function(data,callback){
        var footer = BB.get({view:'footer'});
        footer.trigger('modal', data, callback);
    };

    /**
     * Returns a slug of the input
     * @param text string
     * @returns string
     */
    Lib.slugify = function(text){
        text = text.replace(/[^-a-zA-Z0-9,&\s]+/ig, '');
        text = text.replace(/-/gi, "_");
        text = text.replace(/\s/gi, "-");
        return text;
    };

    /**
     * Converts input to it's effective size
     * @param bytes number|string Convert to proper size
     * @returns string
     */
    Lib.bytesToSize = function(bytes){
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return '0 Bytes';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    };

    /**
     * UUIDv4 generator from https://gist.github.com/jed/982883
     * @param a
     * @returns {string}
     */
    Lib.uuid = function(a){
        return a                // if the placeholder was passed, return
            ? (                 // a random number from 0 to 15
            a ^                 // unless b is 8,
                Math.random()   // in which case
                    * 16        // a random number from
                    >> a / 4    // 8 to 11
            ).toString(16)      // in hexadecimal
            : (                 // or otherwise a concatenated string:
            [1e7] +             // 10000000 +
                -1e3 +          // -1000 +
                -4e3 +          // -4000 +
                -8e3 +          // -80000000 +
                -1e11           // -100000000000,
            ).replace(          // replacing
                /[018]/g,       // zeroes, ones, and eights with
                Lib.uuid        // random hex digits
            )
    };

    return Lib;
});