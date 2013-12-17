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
                this.listenTo(this.model, 'change', this.render);
            },

            render: function(){
                var filters = this.model.toJSON();
                console.log(filters);
                var view = this;
                dust.render(this.template, filters, function(err, out) {
                    view.$el.html(out);
                });
            }
        });
    });
})(window);