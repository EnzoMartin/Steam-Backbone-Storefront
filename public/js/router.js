(function(window){
define([
    'underscore',
    'backbone',
    'BB',
    'main'
], function(_, Backbone, BB, WR) {
	return Backbone.Router.extend({
		initialize: function(){
            var _this = this;

            // Load header and footer views
			var header = BB.get({view:'header',model:'header'});

            // Set up the bind to update the header active links
			this.on('route',function(){
				header.set_active(Backbone.history.fragment);
			});

            $(window.document).on('click', 'a[href^="/"]', function(event) {
                if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
                    var href = this.getAttribute('href');
                    var protocol = this.protocol + '//';

                    if (href.slice(protocol.length) !== protocol) {
                        event.preventDefault();
                        _this.navigate(href, true);
                    }
                }
            });
		},

		render_loading: function(){
			var loading = BB.get({view:'loading'});
			WR.render(loading);
		},

		render_coming_soon: function(){
			var coming_soon = BB.get({view:'coming_soon'});
			WR.render(coming_soon);
		},

        render_home: function(){
            var collection = BB.get({collection:'games'});
            var home = BB.get({view:'home',model:{name:'home',options:{collection:collection}},collection:collection});
            home.model.fetch();
            WR.render(home);
        },

        render_featured: function(){
            var collection = BB.get({collection:'games'});
            var featured = BB.get({view:'featured',model:{name:'featured',options:{collection:collection}},collection:collection});
            featured.model.fetch();
            WR.render(featured);
        },

        render_game: function(id){
            var collection = BB.get({collection:'games'});
            var model = collection.get(id);

            if(typeof model === 'undefined'){
                // Game not found, create and fetch it
                collection.add(new BB.model_definitions.game({id:id}));
                model = collection.get(id);
            }

            model.fetch();
            var game = BB.get({view:'game',model:model,collection:collection});
            WR.render(game);
        },

        render_search: function(){
            var search = BB.get({view:'search',model:'search'});
            WR.render(search);
        },

		routes:{
			'loading'              :'render_loading',
            'coming-soon'          :'render_coming_soon',
            ''                     :'render_home',
            'featured'             :'render_featured',
            'game/:id'             :'render_game',
            'search'               :'render_search'
		}
	});
});
}(window));