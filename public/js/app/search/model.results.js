/**
 * @name Search Results Model
 * @module Search
 * @memberOf Model
 */
define([
    'BB',
    'backbone',
    'jquery'
], function (BB, Backbone, $) {
    return BB.model_definitions.results = Backbone.Model.extend({
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
                    BB.bootstrapped.results = false;
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