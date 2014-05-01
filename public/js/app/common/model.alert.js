/**
 * Model
 * @module Alert
 * @memberOf Models/Common
 */
define([
    'BB',
    'backbone'
], function(BB,Backbone) {
    return BB.model_definitions.alert = Backbone.Model.extend({
        defaults: {
            type   : 'info',
            title  : '',
            message: ''
        }
    });
});