/**
 * @name Search Form View
 * @module Search
 * @memberOf Views
 */
define([
    'BB',
    'backbone',
    'dust'
], function (BB, Backbone, dust) {
    return BB.view_definitions.searchForm = Backbone.View.extend({
        template: 'tpl_search_form',

        events: {

        },

        render: function(){
            var view = this;
            dust.render(this.template, this.model.toJSON(), function(err, out) {
                view.$el.html(out);
            });
        }
    });
});