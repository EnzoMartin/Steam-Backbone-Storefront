(function(window){
define([
    'underscore',
    'backbone',
    'BB',
    'main'
], function(_, Backbone, BB, WR) {
	return Backbone.Router.extend({
		initialize: function(){
            // Load header and footer views
			var header = BB.get({view:'header',model:'header'});
			var footer = BB.get({view:'footer',model:'footer'});

            // Set up the bind to update the header active links
			this.on('route',function(){
				header.set_active(Backbone.History.prototype.getHash(window));
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
            var home = BB.get({view:'home'});
            WR.render(home);
        },

        render_featured: function(){
            var collection = BB.get({collection:'games'});
            var featured = BB.get({view:'featured',model:{name:'featured',options:{collection:collection}},collection:collection});
            featured.model.fetch();
            WR.render(featured);
        },

		routes:{
			'loading'              :'render_loading',
            'coming-soon'          :'render_coming_soon',
            'home'                 :'render_home',
            'featured'             :'render_featured'
		}
	});
});
}(window));