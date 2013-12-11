(function(window,$,_){
    _.extend(window.BB.view_definitions,{
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
}(window,jQuery,_));