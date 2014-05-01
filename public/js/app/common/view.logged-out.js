/**
 * Logged out
 * @module Common
 * @memberOf Views/Common
 */
define([
    'BB',
    'backbone',
    'dust'
], function(BB,Backbone,dust) {
    return BB.view_definitions.loggedOut = Backbone.View.extend({
        id: 'logged-out',

        title: 'Logged out',

        template: 'tpl_logged_out',

        render: function(){
            var _this = this;
            dust.render(this.template, {}, function(err, out) {
                _this.$el.html(out);
            });
        }
    });
});