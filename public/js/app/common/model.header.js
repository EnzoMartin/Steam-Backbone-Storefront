/**
 * Global application models
 * @module Header Model
 */
define([
    'BB',
    'backbone'
], function(BB,Backbone) {
    return BB.model_definitions.header = Backbone.Model.extend({
        defaults: {
            version: '0.0.1',
            name   : '',
            referral: '/',
            loggedIn: false
        },

        /**
         * Login to backend
         * @param data {*}
         * @param [stay] boolean
         */
        login: function(data,stay){
            data.referral = this.get('referral');
            var _this = this;
            $.ajax({
                method: 'POST',
                url: '/login',
                data: JSON.stringify(data),
                success: function(user){
                    _this.set(user).trigger('loggedIn');
                    if(!stay){
                        window.history.back();
                    }
                },
                error: function(error){
                    if(error.status != 302){
                        _this.trigger('error',error);
                    }
                }
            });
        },

        logout: function(){
            var _this = this;
            $.ajax({
                method: 'POST',
                url: '/logout',
                success: function(){
                    _this.set({loggedIn:false}).trigger('loggedOut');
                },
                error: function(error){
                    if(error.status != 302){
                        _this.trigger('error',error);
                    }
                }
            });
        }
    });
});