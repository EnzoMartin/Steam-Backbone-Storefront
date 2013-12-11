(function(window,$,_,dust,BB){
	_.extend(window.BB.view_definitions,{
		header: Backbone.View.extend({
			events: {

			},

			el: '#header',

			initialize: function(){
				this.body = $('body');
				this.on('alert',this.trigger_alert,this);
				this.render();
			},

			trigger_alert: function(data){
				var alert = BB.get({view: {name: 'alert',reset: true},model: {name: 'alert',data: data}});
				this.$el.find('.navbar').append(alert.render().el);
			},

			set_active: function(event){
				var path = (typeof event === 'object') ? $(event.currentTarget).attr('href') : '#' + event.split('/')[0];
				this.$el.find('li').removeClass('active');
				this.$el.find('a[href=' + path + ']').parent('li').addClass('active');
			},

			render: function(){
                var _this = this;
                dust.render('tpl_header', this.model.toJSON(), function(err, out) {
                    _this.$el.html(out);
                });
			}
		}),

		footer: Backbone.View.extend({
			el: '#footer',

			initialize: function(){
				this.on('modal',this.trigger_modal,this);
				this.render();
				this.$el.show();
			},

			trigger_modal: function(data,callback){
				var modal = BB.get({view: {name: 'modal',reset: true},model: {name: 'modal',data: data,options: {callback: callback}}});
				this.$el.append(modal.render().el);
				modal.$modal.modal();
			},

			render: function(){
                var _this = this;
                dust.render('tpl_footer', this.model.toJSON(), function(err, out) {
                    _this.$el.html(out);
                });
			}
		}),

		coming_soon: Backbone.View.extend({
			id: 'coming-soon',

			title: 'Coming Soon!',

			render: function(){
                var _this = this;
                dust.render('tpl_coming_soon', {}, function(err, out) {
                    _this.$el.html(out);
                });
			}
		}),

		loading: Backbone.View.extend({
			el: '#content',

			title: 'Loading',

			render: function(){
                var _this = this;
                dust.render('tpl_loading', {}, function(err, out) {
                    _this.$el.html(out);
                });
			}
		}),

		alert: Backbone.View.extend({
			events: {
				'.close': 'hide_alert'
			},

			id: 'header-alert',

			className: 'hide',

			show_alert: function(){
				var view = this;
				this.error_timeout = window.setTimeout(function(){
					view.hide_alert();
				},2500);
			},

			hide_alert: function(){
				var view = this;
				clearTimeout(this.error_timeout);
				this.$el.fadeOut(300,function(){
					view.remove();
				});
			},

			render: function(){
				this.show_alert();
                var _this = this;
                dust.render('tpl_alert', this.model.toJSON(), function(err, out) {
                    _this.$el.html(out).fadeIn(300);
                });
				return this;
			}
		}),

		modal: Backbone.View.extend({
			events: {
				'click .btn-confirm': 'confirm'
			},

			id: 'confirm-dialogue',

			initialize: function(){
				this.render();
			},

			confirm: function(){
				var modal = this;
				this.$modal.on('hidden',function(){
					if(typeof modal.model.callback !== 'undefined'){
						modal.model.callback();
					}
					modal.model.destroy();
					modal.remove();
				});
				this.$modal.modal('hide');
			},

			render: function(){
                var _this = this;
                dust.render('tpl_confirm_dialogue', this.model.toJSON(), function(err, out) {
                    _this.$el.html(out);
                });
				this.$modal = this.$el.find('#modal');
				return this;
			}
		})
	});
}(window,jQuery,_,dust,window.BB));