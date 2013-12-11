// requestAnimationFrame() shim by Paul Irish
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function(callback){
			window.setTimeout(callback,1000 / 60);
		};
}());

$.extend(window,{
	WRCON: null
});

(function(window,document,$){
	WRCON = function(){
		// Object Variables
		this.main_ele = '#content';
        this.$el = null;
		this.default_route = 'home';
		this.files_loaded = [];
		this.timers = {};
		this.title = 'WRCON';
		this.Lib = Lib || false;
	};

	WRCON.prototype = {
        /**
         * Pass in the view to render as the main active view, it will recycle the previously active view unless persist is passed in
         * @param view {*} View object
         * @param persist {boolean} If the view should not be recycled
         */
		render: function(view,persist){
            var _this = this;
			if(typeof this.current_view !== 'undefined' && !persist){
				var old_view = window.BB.get({view: this.current_view});
				old_view.remove();
				delete window.BB.view_instances[this.current_view];
			}
			this.current_view = view.name;
			document.title = view.title || this.title;
            dust.render(view.template, view.render(), function(err, out) {
                if(err){
                    console.log('RENDER ERROR',err);
                }
                view.$el.html(out);
                _this.$el.html(view.$el);
                view.delegateEvents();
            });
		},

        /**
         * Set the options passed in and cache the primary selector
         * @param options
         */
		set_options: function(options){
			var scope = this;
			for (var index in options) {
				var option = options[index];
				scope[index] = option;
			}

            // Cache the content selector
			this.$el = $(this.main_ele);
		},

        /**
         * Initializes the main object, makes references to the lib's properties, applies options if passed in, starts backbone's router
         * @param options
         */
		init: function(options){
            // Create references to the lib's properties
			if(this.Lib){
				var lib = new this.Lib();
				for(var i in lib){
					this[i] = lib[i];
				}
			}

            // Set the options
			this.set_options(options);

            // Set up the primary route if not set
			if(typeof window.location.hash === 'undefined' || window.location.hash == ''){
				window.location.hash = this.default_route;
			}

            // Make new instance of the router
			this.active_router = new BB.router();
			Backbone.history.start();
		}
	};
}(window,document,jQuery));