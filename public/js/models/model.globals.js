(function (window){
    requirejs([
        'underscore',
        'backbone',
        'BB'
    ], function(_, Backbone, BB) {
        var modal = Backbone.Model.extend({
            defaults: {
                'button'     : 'primary',
                'button-text': 'Confirm',
                'title'      : 'Confirm',
                'message'    : "Please confirm your selection"
            }
        });

        var alert = Backbone.Model.extend({
            defaults: {
                'type'   : 'info',
                'title'  : 'Alert!',
                'message': "This is an alert"
            }
        });

        var header = Backbone.Model.extend({
            defaults: {
                version: '0.0.1',
                name   : 'BB Steam'
            }
        });

        var footer = Backbone.Model.extend({
            defaults: {
                year     : '0',
                copyright: 'BB Steam'
            },

            initialize: function(){
                var d = new Date();
                this.set({year: d.getFullYear()});
            }
        });

        return _.extend(BB.model_definitions,{modal: modal,alert: alert,header: header,footer: footer});
    });
})(window);