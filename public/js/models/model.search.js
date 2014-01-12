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
                            model.trigger('sync');
                        }
                    });
                }
            },

            get_params: function(){
                var model = this.toJSON();
                var search = window.location.search;
                if(search){
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
            }
        });

        BB.model_definitions.results = Backbone.Model.extend({
            defaults: {
                loading: false,
                error: false
            },

            url: '/search',

            initialize: function(){
                this.collection = BB.get({collection:'games'});
                var model = this;

                if(BB.bootstrapped.results){
                    if(BB.bootstrapped.results.length){
                        BB.bootstrapped.results.forEach(function(item){
                            model.collection.add(new BB.model_definitions.game(item));
                        });
                        this.set({results:BB.bootstrapped.results,bootstrapped:true});
                    } else {
                        this.set({error: 'Nothing matched your search terms, please try different ones'});
                    }
                }
            },

            sync: function(){
                this.set({loading:true,error:false,results:false});
                var model = this;
                $.ajax({
                    url: this.url + window.location.search,
                    contentType: 'application/json',
                    dataType: 'json',
                    success: function(response){
                        var data = {
                            loading: false
                        };
                        if(response.results.length){
                            data.results = response.results;
                            data.results.forEach(function(item){
                                model.collection.add(new BB.model_definitions.game(item));
                            });
                        } else {
                            data.error = 'Nothing matched your search terms, please try different ones';
                        }
                        model.set(data);
                    },
                    error: function(error){
                        model.set({loading:false,error:'Error fetching results, please try again later'});
                    }
                });
            }
        });
    });
})(window);