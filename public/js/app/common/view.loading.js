/**
 * Generic loading view
 * @module Loading
 * @memberOf Views/Common
 */
define([
    'BB',
    'backbone',
    'dust'
], function(BB,Backbone,dust) {
    return BB.view_definitions.loading = Backbone.View.extend({
        id: 'loading',

        title: 'Loading',

        template: 'tpl_loading',

        render: function(){
            var _this = this;
            dust.render(this.template, {}, function(err, out) {
                _this.$el.html(out);
            });
        }
    });
});