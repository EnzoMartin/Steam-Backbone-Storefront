/**
 * Common alert view
 * @module Alert
 * @memberOf Views/Common
 */
define([
    'BB',
    'backbone',
    'dust'
], function(BB,Backbone,dust) {
    return BB.view_definitions.alert = Backbone.View.extend({
        events: {
            '.close': 'hideAlert'
        },

        id: 'header-alert',

        template: 'tpl_alert',

        /**
         * Display the alert and set a timer for when the alert will remove itself
         */
        showAlert: function(){
            var view = this;
            this.errorTimeout = window.setTimeout(function(){
                view.hideAlert();
            },3500);
        },

        /**
         * Hide the alert and remove the view
         */
        hideAlert: function(){
            var view = this;
            clearTimeout(this.errorTimeout);
            this.$el.fadeOut(300,function(){
                view.remove();
            });
        },

        render: function(){
            this.showAlert();
            var _this = this;
            dust.render(this.template, this.model.toJSON(), function(err, out) {
                _this.$el.html(out).fadeIn(300);
            });
            return this;
        }
    });
});