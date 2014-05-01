/**
 * Header view
 * @module Header View
 * @listens module:Lib#event:alert
 * @memberOf Views/Common
 */
define([
    'BB',
    'BBA',
    'backbone',
    'dust'
], function(BB,BBA,Backbone,dust) {
    return BB.view_definitions.header = Backbone.View.extend({
        el: '#header',

        template: 'tpl_header',

        events: {
            'click #logout a'               : 'logout',
            'submit #nav-login-form'        : 'submit'
        },

        initialize: function(){
            this.on('alert',this.triggerAlert,this);
            this.listenTo(this.model,'change:loggedIn',this.render);
            this.listenTo(this.model,'error',this.showError);
            this.render();
            this.setActive(Backbone.history.fragment);
        },

        /**
         * Spawns a new alert
         * @param data {*} Data to pass to the alert
         */
        triggerAlert: function(data){
            var alertHtml;
            var $container;
            if(data.static){
                dust.render('tpl_alert_static', data, function(err, out){
                    alertHtml = out;
                });
                $container = $('#static-alerts');
            } else {
                var view = BB.get({view: {name: 'alert',reset: true},model: {name: 'alert',reset:true,data: data}});
                alertHtml = view.render().el;
                $container = this.$el.find('#alert-container');
            }

            if(!data.static || data.static && data.id && !$container.find('#'+data.id).length){
                var alert = $container.append(alertHtml);

                if(data.static){
                    alert.alert();
                }
            }
        },

        /**
         * Changes the active menu item in the header based off the new route
         * @param href string URL fragment
         */
        setActive: function(href){
            var split = href.split('/');
            var path = '/' + split[0];
            this.$el.find('li.active').removeClass('active');

            var link = this.$el.find('a[href="' + path + '"]');

            if(!link.length){
                link = this.$el.find('a[data-href="' + path + '"]');
            }

            link.parent('li').addClass('active');

            if(link.hasClass('dropdown-toggle')){
                this.$el.find('a[href="/' + href + '"]').parent('li').addClass('active');
            }
        },

        logout: function(event){
            event.preventDefault();
            this.model.logout();
        },

        submit: function(event){
            event.preventDefault();
            var form = event.target;

            var i = 0;
            var length = event.target.length;
            var data = {};
            while(i < length){
                var element = form.elements[i];
                if(element.name != ''){
                    if(element.type === 'checkbox'){
                        data[element.name] = element.checked;
                    } else {
                        data[element.name] = element.value;
                    }
                }
                i++;
            }

            this.model.login(data,true);
            this.$el.find('#nav-login-form').addClass('loading');
        },

        showError: function(error){
            this.$el.find('#nav-login-form').removeClass('loading');
            BBA.alert({title:'Login failed',message:error.responseJSON.error,type:'danger'});

        },

        render: function(){
            var view = this;
            dust.render(this.template, this.model.toJSON(), function(err, out) {
                view.$el.html(out);
            });
        }
    });
});