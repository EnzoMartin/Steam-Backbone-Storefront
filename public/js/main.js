/**
 * Collections
 * @desc All of the Backbone collections for the application
 * @namespace Collections
 * @memberOf Backbone
 */

/**
 * Models
 * @desc All of the Backbone models for the application
 * @namespace Models
 * @memberOf Backbone
 */

/**
 * Views
 * @desc All of the Backbone views for the application
 * @namespace Views
 * @memberOf Backbone
 */

/**
 * Common Views
 * @namespace Common
 * @memberOf Views
 */

/**
 * Common Models
 * @namespace Common
 * @memberOf Models
 */

/**
 * Backbone Application
 * @desc This is our front end Backbone application
 * @namespace Backbone
 */

/**
 * @module Main
 * @desc Set up our application and establish some basic methods we'll be needing
 * @memberOf Backbone
 */
(function (root, factory) {
    define([
        'backbone',
        'BB',
        'lib',
        'socket.io',
        'exports'
    ], function (Backbone, BB, lib, Socket, exports) {
        return factory(root, exports, Backbone, BB, lib, Socket);
    });
}(this, function (root, BBA, Backbone, BB, Lib, Socket) {
	BBA = {
		// Object Variables
		main_ele: '#content',
        $el: null,
		title: 'Application',
		headline: 'powered by Backbone',
		Lib: typeof Lib !== 'undefined'? Lib : false
	};

    /**
     * Pass in the view to render as the main active view, it will recycle the previously active view unless persist is passed in
     * @param view {*} View object
     */
    BBA.render = function(view){
        var _this = this;
        if(view.name !== this.currentView){
            if(this.currentView){
                var oldView = BB.get({view: this.currentView});

                // Remove any subviews
                if(oldView.subViews){
                    var oldKeys = Object.keys(oldView.subViews);
                    var j = 0;
                    var jLen = oldKeys.length;
                    while(j < jLen){
                        oldView.subViews[oldKeys[j]].remove();
                        j++;
                    }
                }

                oldView.remove();
            }

            // Save the name of the new current view
            this.currentView = view.name;
            var title = false;
            var titleType = typeof view.title;

            if(titleType !== 'undefined'){
                // If the view has title set, either set it to the string or run the title function
                if(titleType === 'function'){
                    title = view.title();
                } else {
                    title = view.title;
                }
            }

            // Set our new title
            this.setTitle(title);

            // Insert and render the new view
            _this.$el.html(view.$el);
            view.render();

            // Bind the sub view events and render
            if(view.subViews){
                var keys = Object.keys(view.subViews);
                var i = 0;
                var len = keys.length;
                while(i < len){
                    var subView = BB.get(view.subViews[keys[i]]);
                    view.subViews[keys[i]] = subView;
                    if(typeof subView.bindEvents === 'function'){
                        subView.bindEvents();
                    }
                    subView.render();
                    i++;
                }
            }

            // Bind the events
            if(typeof view.bindEvents === 'function'){
                view.bindEvents();
            }
        }
    };

    /**
     * Sets the document's title to be what is specified by the view with the app headline appended, or just the app name if title is not specified
     * @param title string|boolean
     */
    BBA.setTitle = function(title){
        root.document.title = title? title + ' - ' + this.headline : this.title + ' - ' + this.headline;
    };

    /**
     * Set the options passed in and cache the primary selector
     * @param options {*}
     */
    BBA.setOptions = function(options){
        for (var index in options) {
            this[index] = options[index];
        }

        // Cache the main content selector
        this.$el = $(this.main_ele);
    };

    /**
     * Initializes the main object, makes references to the lib's properties, applies options if passed in, starts backbone's router
     * @param router {*}
     * @param options {*}
     * @param routerData {*}
     */
    BBA.init = function(router,options,routerData){
        // Create references to the lib's properties
        if(this.Lib){
            for(var i in this.Lib){
                this[i] = this.Lib[i];
            }
        }

        // Set the options
        this.setOptions(options);

        if(routerData.header.loggedIn){
            // Connect socket
            var socket = Socket.connect('/app');
            this.socket = socket;

            this.socket.onBind = function (eventName, callback, scope) {
                function wrapper() {
                    scope = scope || socket;
                    callback.apply(scope, arguments);
                }

                socket.on(eventName, wrapper);

                return function () {
                    socket.removeListener(eventName, wrapper);
                };
            };

            this.socket.emitBind = function (eventName, data, callback, scope) {
                socket.emit(eventName, data, function () {
                    if (callback) {
                        scope = scope || socket;
                        callback.apply(scope, arguments);
                    }
                });
            };

            // Send version when connecting and reconnecting
            this.socket.on('connect',function(){
                socket.emit('version',routerData.version);
            });

            var _this = this;
            // If receiving reload message, this means the client is outdated
            this.socket.on('reload',function(){
                _this.alert({id:'version-alert',icon:'fa-exclamation-triangle',title:'New version available',message:'- A new version of BB Steam has been released, please refresh the page',type:'info',static:true});
            });
        }

        // Make new instance of the router
        this.router = new router(routerData);
        // Start backbone history with history push
        Backbone.history.start({pushState: true});
    };

    return BBA;
}));