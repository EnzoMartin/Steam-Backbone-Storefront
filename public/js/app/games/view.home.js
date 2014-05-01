/**
 * @name Homepage View
 * @module Games
 * @memberOf Views
 */
(function (){
    requirejs([
        'BB',
        'backbone',
        'dust'
    ], function(BB,Backbone,dust) {
        return BB.view_definitions.home = Backbone.View.extend({
            id: 'home',

            title: 'Home',

            template: 'tpl_home',

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
})();