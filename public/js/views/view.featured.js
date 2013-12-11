(function (window){
    requirejs([
        'jquery',
        'underscore',
        'backbone',
        'dust',
        'BB'
    ], function($, _, Backbone, dust, BB) {
        BB.view_definitions.featured = Backbone.View.extend({
            id: 'featured',

            title: 'Featured',

            template: 'tpl_featured',

            events: {

            },

            initialize: function(){
                this.listenTo(this.model, 'sync', this.render);
            },

            render: function(){
                var items = this.model.items();
                var view = this;
                dust.render(this.template, items, function(err, out) {
                    if(err){
                        console.log('RENDER ERROR',err);
                    }
                    view.$el.html(out);
                });
            }
        });
    });
})(window);