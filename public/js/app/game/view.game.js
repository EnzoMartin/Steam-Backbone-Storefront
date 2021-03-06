/**
 * @name Game View
 * @module Game
 * @memberOf Views
 */
(function (window){
    requirejs([
        'BB',
        'backbone',
        'dust'
    ], function(BB,Backbone,dust) {
        return BB.view_definitions.game = Backbone.View.extend({
            id: 'game-detail',

            title: function(){
                return this.model.get('name') || 'Loading';
            },

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
                window.document.title = this.title();
            }
        });
    });
})(window);