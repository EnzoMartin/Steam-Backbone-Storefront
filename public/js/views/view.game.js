(function (window){
    requirejs([
        'jquery',
        'underscore',
        'backbone',
        'dust',
        'BB'
    ], function($, _, Backbone, dust, BB) {
        BB.view_definitions.game = Backbone.View.extend({
            id: 'game-detail',

            title: 'Game Detail',

            template: 'tpl_game_detail',

            events: {

            },

            initialize: function(){
                this.listenTo(this.model, 'sync', this.render);
            },

            render: function(){
                var model = this.model.toJSON();
                var view = this;
                dust.render(this.template, model, function(err, out) {
                    view.$el.html(out);
                });
            }
        });
    });
})(window);