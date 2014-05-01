/**
 * Common modal view
 * @module Modal
 * @memberOf Views/Common
 */
define([
    'BB',
    'backbone',
    'dust'
], function(BB,Backbone,dust) {
    return BB.view_definitions.modal = Backbone.View.extend({
        events: {
            'click .btn-confirm': 'confirm'
        },

        id: 'confirm-dialogue',

        template: 'tpl_confirm_dialogue',

        /**
         * Confirmation event triggers hiding
         */
        confirm: function(){
            var modal = this;
            var callback = modal.model.callback;
            this.$modal.on('hidden.bs.modal',function(){
                if(typeof callback === 'function'){
                    callback();
                }
                modal.model.destroy();
                modal.remove();
            });
            this.$modal.modal('hide');
        },

        render: function(){
            var _this = this;
            dust.render(this.template, this.model.toJSON(), function(err, out) {
                _this.$modal = _this.$el.html(out).find('#modal');
                _this.$modal.modal();
            });
            return this;
        }
    });
});