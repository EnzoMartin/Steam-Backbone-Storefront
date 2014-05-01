/**
 * @name Search Model
 * @module Search
 * @memberOf Model
 */
(function (window){
    requirejs([
        'BB',
        'backbone',
        'jquery'
    ], function(BB,Backbone,$) {
        return BB.model_definitions.search = Backbone.Model.extend({
            defaults: {},

            initialize: function(){
                var model = this;
                if(BB.bootstrapped.filters){
                    this.set(BB.bootstrapped.filters);
                    BB.bootstrapped.filters = false;
                } else {
                    $.ajax({
                        url: '/api/filters',
                        dataType: 'json',
                        contentType : 'application/json',
                        success: function(data){
                            model.set(data);
                            model.trigger('sync');
                        }
                    });
                }
            },

            getParams: function(){
                var model = this.toJSON();
                var search = window.location.search;
                if(search){
                    var params = {};
                    search = search.substring(1).split('&');
                    var i = 0;
                    var len = search.length;
                    while(i < len){
                        var param = search[i].split('=');
                        if(param[1] != '' && model[param[0]]){
                            var options = model[param[0]];
                            var o = 0;
                            var len_o = options.length;
                            while(o < len_o){
                                var option = options[o];
                                option.active = option.id == param[1] || option.name == param[1];
                                o++;
                            }
                            params[param[0]] = options;
                        } else {
                            params[param[0]] = param[1];
                        }
                        i++;
                    }
                    this.set(params);
                }
            }
        });
    });
})(window);