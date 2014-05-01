/**
 * @name Search Results View
 * @module Search
 * @memberOf Views
 */
define([
    'BB',
    'backbone',
    'dust'
], function (BB, Backbone, dust) {
    return BB.view_definitions.results = Backbone.View.extend({
        //TODO: Add pagination
        template: 'tpl_search_results',

        id: 'search-results',

        events: {
            'click .label': 'search'
        },

        initialize: function(){
            this.listenTo(this.model, 'change', this.render);
        },

        search: function(event){
            event.preventDefault();
            history.pushState({}, document.title, event.currentTarget.href);
            this.trigger('url');
            this.model.sync();
        },

        render: function(){
            var view = this;
            dust.render(this.template, this.model.toJSON(), function(err, out) {
                view.$el.html(out);
            });
        }
    });
});