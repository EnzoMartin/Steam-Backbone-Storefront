/**
 * Global application models
 * @module Footer Model
 */
define([
    'BB',
    'BBA',
    'backbone'
], function(BB,BBA,Backbone) {
    return BB.model_definitions.footer = Backbone.Model.extend({
        defaults: {
            version: ''
        },

        initialize: function(){
            this.set({version:BBA.version});
        }
    });
});