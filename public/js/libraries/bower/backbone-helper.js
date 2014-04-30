(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['backbone', 'underscore', 'exports'], function (Backbone, _, exports) {
            return factory(root, exports, Backbone, _);
        });
    } else if (typeof exports !== 'undefined') {
        var Backbone = require('backbone');
        var _ = require('underscore');
        module.exports = factory(root, exports, Backbone, _);
    } else {
        root.BB = factory(root, {}, root.Backbone, root._);
    }
}(this, function (root, BB, Backbone, _) {
    /**
     * @author Enzo Martin <enzo.r.martin@gmail.com>
     * @module backbone/backbone-helper
     * @desc Backbone Helper functions to manage memory/instances smartly by keeping track of instanciated views/models/collections and making sure you don't have multiple instances of anything in the background by accident
     */

    BB = {
        view_definitions : {},
        model_definitions : {},
        collection_definitions : {},
        view_instances : {},
        model_instances : {},
        collection_instances : {}
    };

    // Private functions
    /**
     * Generic method for returning an object
     *
     * @param  {string} item model|collection
     * @param  {object} data
     * @return {instance}
     * @private
     */
    function get_item(item,data){
        var instances = this[item + '_instances'];
        var name = data.name;
        var defined = typeof instances[name] !== 'undefined';
        var instance;

        if(data.reset && defined){
            if(item == "model"){
                instances[name].destroy();
            } else if (item == "collection"){
                instances[name].reset();
            }
            delete instances[name];
            instance = create_item.call(this,item,data);
        } else {
            instance = defined ? instances[name] : create_item.call(this,item,data);
        }
        return instance;
    }

    /**
     * Generic method for creating an object
     *
     * @param  {string} item model|collection
     * @param  {object} data
     * @return {instance}
     * @private
     */
    function create_item(item,data){
        var definitions = this[item + '_definitions'];
        var name = data.name;
        var defined = typeof definitions[name] !== 'undefined';
        var instance;
        if(defined){
            instance = this[item + '_instances'][name] = new definitions[name](data.data || null);
            if(data.options){
                for(var option in data.options){
                    var value = data.options[option];
                    instance[option] = value;
                }
            }
            instance.name = name;
            if(item == 'model'){
                this[item + '_instances'][name].on('destroy',function(){
                    delete this[item + '_instances'][name];
                },this);
            }
        } else {
            console.trace();
            throw new Error(item + ' definition not found: ' + name +'. Did you add it to the BB.' + item + '_definitions object?');
        }
        return instance;
    }

    /**
     * Gets the specified model
     * @param model_data {string|*}
     * @returns {*}
     */
    BB.get_model = function(model_data){
        if(typeof model_data.name === 'undefined'){
            model_data = {name:model_data};
        }
        return get_item.call(this,'model',model_data);
    };

    /**
     * Gets the specified collection
     * @param collection_data {string|*}
     * @returns {*}
     */
    BB.get_collection = function(collection_data){
        if (typeof collection_data.name === 'undefined') {
            collection_data = {name: collection_data};
        }
        return get_item.call(this,'collection',collection_data);
    };

    /**
     * Get the specified view
     * @param view_data {string|*} The view's options to set
     * @param model_data {*} The model to bind to the view's model property
     * @param collection_data The collection to bind to the view's collection property
     * @returns {*}
     */
    BB.get_view = function(view_data,model_data,collection_data){
        if (typeof view_data.name === 'undefined') {
            view_data = {name: view_data};
        }
        var views = this.view_instances;
        var name = view_data.name;
        if(view_data.reset && views[name]){
            views[name].remove();
        }

        return views[name] ? views[name] : this.create_view(view_data,model_data,collection_data);
    };

    /**
     * Creates a view and sets it's options, including fetching and binding it's model/collection, also sets up removal of the view instance when removed
     * @param view_data {*} The view's options to set
     * @param model_data {*} The model to get and it's data
     * @param collection_data {*} The collection to get and it's data
     * @returns {*} The view with it's model and/or collection bound
     */
    BB.create_view = function(view_data,model_data,collection_data){
        var name = view_data.name;
        var view = this.view_definitions[name];
        var model = model_data && !(model_data instanceof Backbone.Model) ? this.get_model(model_data) : model_data;
        var collection = collection_data && !(collection_data instanceof Backbone.Collection) ? this.get_collection(collection_data) : collection_data;
        view = view ? this.view_instances[name] = new view({model: model,collection: collection}) : '';

        if(view_data.options){
            for(var option in view_data.options){
                var value = view_data.options[option];
                view[option] = value;
            }
        }

        this.view_instances[name].on('remove',function(){
            delete this.view_instances[name]
        },this);
        view.name = name;
        return view;
    };

    /**
     * @desc The main function of the helper library, it takes an object with view/collection/model as a key, and an object inside with the name of the type you want, and will return your requested item
     * @param object
     * @returns {{}}
     *
     * @example
     * {
     *	view: {
     *		name: 'view-name',
     *		reset: true, // Delete existing and create new instance
     *		options: {} // Set any number of view parameters like initialize, el, tagName, etc
     *	},
     *	model: {
     *		name: 'model-name',
     *		reset: true, // Delete existing and create new instance
     *		data: {}, // Set model initial data
     *		options: {} // Set any number of model parameters like attributeId, initialize, etc
     *	},
     *	collection: {
     *		name: 'collection-name',
     *		reset: true // Delete existing and create new instance
     *	}
     *}
     */
    BB.get = function(object){
        var item;
        if(object.view){
            item = this.get_view(object.view,object.model,object.collection);
        } else if(object.model){
            item = this.get_model(object.model);
        } else if(object.collection){
            item = this.get_collection(object.collection);
        }
        return item;
    };

    /**
     * Checks if an instance of the given type and name exists and returns true or false
     * @param type string view|model|collection
     * @param name string
     * @returns {boolean}
     */
    BB.exists = function(type,name){
        return typeof this[type + '_instances'][name] !== 'undefined';
    };

    // Upgrading Backbone to fire a remove event when removing a view
    var _super = Backbone.View.prototype.remove;
    Backbone.View.prototype.remove = function(){
        this.trigger('remove');
        return _super.apply(this,arguments);
    };

    return BB;
}));
