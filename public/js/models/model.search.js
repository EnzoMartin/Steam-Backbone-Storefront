(function (window){
    requirejs([
        'underscore',
        'backbone',
        'BB'
    ], function(_, Backbone, BB) {
        BB.model_definitions.search = Backbone.Model.extend({
            defaults: {},

            initialize: function(){
                if(BB.bootstrapped.filters4){
                    this.set(BB.bootstrapped.filters);
                } else {
                    var model = this;
                    $.ajax({
                        url: '/search',
                        dataType: 'json',
                        contentType : 'application/json',
                        success: function(data){
                            model.set(data);
                        }
                    });
                }
            },

            url: '/api/search'
        });
    });
})(window);