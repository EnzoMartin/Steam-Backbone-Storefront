(function(window,BB,$){
	window.BB.router = Backbone.Router.extend({
		initialize: function(){
            // Load header and footer views
			var header = BB.get({view:'header',model:'header'});
			var footer = BB.get({view:'footer',model:'footer'});

            // Set up the bind to update the header active links
			this.on('route',function(){
				header.set_active(Backbone.History.prototype.getHash(window));
			});
		},

		render_home: function(){
			var home = BB.get({view:'home'});
			WR.render(home);
		},

		render_loading: function(){
			var loading = BB.get({view:'loading'});
			WR.render(loading);
		},

		render_coming_soon: function(){
			var coming_soon = BB.get({view:'coming_soon'});
			WR.render(coming_soon);
		},

		routes:{
			'home'                 :'render_home',
			'loading'              :'render_loading',
			'coming-soon'          :'render_coming_soon'
		}
	});
}(window,window.BB,jQuery));