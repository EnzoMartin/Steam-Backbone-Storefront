/**
 * Footer view
 * @module Footer
 * @memberOf Views/Common
 * @listens module:Lib#event:modal
 */
define([
    'BB',
    'backbone',
    'dust'
], function(BB,Backbone,dust) {
    return BB.view_definitions.footer = Backbone.View.extend({
        el: '#footer',

        template: 'tpl_footer',

        initialize: function(){
            this.on('modal',this.triggerModal,this);
            this.render();
            this.$el.show();
        },

        /**
         * Triggers opening a modal window
         * @param data {*}
         * @param callback function
         */
        triggerModal: function(data,callback){
            var modal = BB.get({view: {name: 'modal',reset: true},model: {name: 'modal',reset:true,data: data,options: {callback: callback}}});
            this.$el.append(modal.render().el);
        },

        render: function(){
            var _this = this;
            dust.render(this.template, this.model.toJSON(), function(err, out) {
                _this.$el.html(out);
            });
        }
    });
});