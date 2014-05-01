/**
 * Generic page not found view
 * @module Not Found
 * @memberOf Views/Common
 */
define([
    'BB',
    'backbone',
    'dust'
], function(BB,Backbone,dust) {
    return BB.view_definitions.notFound = Backbone.View.extend({
        id: 'error-404',

        title: 'Page not found',

        template: 'tpl_not_found',

        render: function(){
            var _this = this;
            dust.render(this.template, {}, function(err, out) {
                _this.$el.html(out);
            });
        }
    });
});