/* Library of small useful global functions */
(function(window){
     define(['underscore'], function (_) {
        var Lib = {};

        Lib.alert = function(alert_data){
            var header = this.get({view: {name: 'header'}});
            header.trigger('alert',alert_data);
        };

        Lib.modal = function(data,callback){
            var footer = this.get({view: {name: 'footer'}});
            footer.trigger('modal',data,callback);
        };

        Lib.slugify = function(text){
            text = text.replace(/[^-a-zA-Z0-9,&\s]+/ig,'');
            text = text.replace(/-/gi,"_");
            text = text.replace(/\s/gi,"-");
            return text;
        };

        return Lib;
    });
})(window);