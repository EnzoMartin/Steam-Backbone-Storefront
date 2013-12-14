(function (window){
    requirejs([
        'jquery',
        'underscore',
        'backbone',
        'dust',
        'BB'
    ], function($, _, Backbone, dust, BB) {
        BB.view_definitions.search = Backbone.View.extend({
            id: 'search',

            title: 'Search',

            template: 'tpl_search',

            events: {

            },

            initialize: function(){
                this.listenTo(this.model, 'sync', this.render);
            },

            render: function(){
                var items = this.model.toJSON();
                var view = this;
                dust.render(this.template, items, function(err, out) {
                    view.$el.html(out);
                });
            }
        });
    });
})(window);