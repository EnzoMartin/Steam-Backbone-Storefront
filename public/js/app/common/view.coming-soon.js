/**
 * Generic coming soon
 * @module Coming Soon
 * @memberOf Views/Common
 */
define([
    'BB',
    'backbone',
    'dust'
], function(BB,Backbone,dust) {
    return BB.view_definitions.comingSoon = Backbone.View.extend({
        id: 'coming-soon',

        title: 'Coming Soon!',

        template: 'tpl_coming_soon',

        render: function(){
            var _this = this;
            dust.render(this.template, {}, function(err, out) {
                _this.$el.html(out);
            });
        }
    });
});