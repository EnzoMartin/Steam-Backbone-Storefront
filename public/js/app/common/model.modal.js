/**
 * Global application models
 * @module Modal Model
 */
define([
    'BB',
    'backbone'
], function(BB,Backbone) {
    return BB.model_definitions.modal = Backbone.Model.extend({
        defaults: {
            button       : 'info',
            subtitle     : false,
            buttonText   : 'Confirm',
            title        : 'Confirm',
            message      : 'Please confirm your selection'
        }
    });
});