(function (window){
    requirejs([
        'underscore',
        'backbone',
        'BB'
    ], function(_, Backbone, BB) {
        BB.model_definitions.search = Backbone.Model.extend({
            defaults: {},

            initialize: function(){
                var model = this;
                if(BB.bootstrapped.filters){
                    this.set(BB.bootstrapped.filters);
                } else {
                    $.ajax({
                        url: '/api/filters',
                        dataType: 'json',
                        contentType : 'application/json',
                        success: function(data){
                            model.set(data);
                        }
                    });
                }
            },

            get_params: function(){
                var model = this.toJSON();
                var search = window.location.search.substring(1).split('&');
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
                            if(option.id == param[1] || option.name == param[1]){
                                option.active = true;
                            }
                            o++;
                        }
                    } else {
                        model[param[0]] = param[1];
                    }
                    i++;
                }
                this.set(model);
            }
        });

        BB.model_definitions.results = Backbone.Model.extend({
            defaults: {},

            url: '/api/search',

            initialize: function(){
                this.collection = BB.get({collection:'games'});
                var model = this;

                if(BB.bootstrapped.results){
                    BB.bootstrapped.results.forEach(function(item){
                        model.collection.add(new BB.model_definitions.game(item));
                    });
                    this.set({results:BB.bootstrapped.results});
                }
            }
        });
    });
})(window);