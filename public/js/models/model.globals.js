(function (window){
    requirejs([
        'underscore',
        'backbone',
        'BB'
    ], function(_, Backbone, BB) {
        BB.model_definitions.modal = Backbone.Model.extend({
            defaults: {
                button       : 'primary',
                'button-text': 'Confirm',
                title        : 'Confirm',
                message      : 'Please confirm your selection'
            }
        });

        BB.model_definitions.alert = Backbone.Model.extend({
            defaults: {
                type   : 'info',
                title  : 'Alert!',
                message: 'This is an alert'
            }
        });

        BB.model_definitions.header = Backbone.Model.extend({
            defaults: {
                version: '0.0.1',
                name   : 'BB Steam'
            }
        });

        BB.model_definitions.footer = Backbone.Model.extend({
            defaults: {
                year     : '0',
                copyright: 'BB Steam'
            },

            initialize: function(){
                var d = new Date();
                this.set({year: d.getFullYear()});
            }
        });
    });
})(window);