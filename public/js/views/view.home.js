(function (window){
    requirejs([
        'jquery',
        'underscore',
        'backbone',
        'dust',
        'BB'
    ], function($, _, Backbone, dust, BB) {
        _.extend(BB.view_definitions,{
            home: Backbone.View.extend({
                id: 'home',

                title: 'Home',

                template: 'tpl_home',

                events: {

                },

                render: function(){
                    return {};
                }
            })
        });
    });
})(window);