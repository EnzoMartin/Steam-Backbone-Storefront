/**
 * Backbone router
 * @module Backbone Router
 * @memberOf Backbone
 */
(function(window){
    define([
        'BB',
        'backbone',
        'jquery',
        'main'
    ], function(BB,Backbone,$,BBS) {
        return Backbone.Router.extend({
            /**
             * Initializes the header, binds the route event to update header, and binds the history push on click
             * @param options {*}
             */
            initialize: function(options){
                var _this = this;

                require(['common'],function(){
                    // Load header and footer views
                    var headerData = options.header;
                    headerData.version = options.version;
                    headerData.name = BB.title;
                    var header = BB.get({view:'header',model:{name:'header',data:headerData}});
                    var footer = BB.get({view:'footer',model:'footer'});

                    // Set up the bind to update the header active links
                    _this.on('route',function(){
                        header.setActive(Backbone.history.fragment);
                    });

                    // Set up the history push on click
                    $(window.document).on('click', 'a[href^="/"]:not([target="_blank"])', function(event) {
                        if (!event.altKey && !event.ctrlKey && !event.metaKey && !event.shiftKey) {
                            var href = this.getAttribute('href');
                            var protocol = this.protocol + '//';

                            if (href.slice(protocol.length) !== protocol) {
                                event.preventDefault();
                                _this.navigate(href, {trigger:true});
                            }
                        }
                    });
                });
            },

            notFound: function(){
                require(['common'],function(){
                    var notFound = BB.get({view:'notFound'});
                    BBA.render(notFound);
                });
            },

            /**
             * Generic loading page route
             */
            renderLoading: function(){
                require(['common'],function(){
                    var loading = BB.get({view:'loading'});
                    BBA.render(loading);
                });
            },

            /**
             * Generic coming soon page
             */
            renderComingSoon: function(){
                require(['common'],function(){
                    var comingSoon = BB.get({view:'comingSoon'});
                    BBA.render(comingSoon);
                });
            },

            /**
             * Home page which renders the current deals
             */
            renderHome: function(){
                require(['games'],function() {
                    var collection = BB.get({collection: 'games'});
                    var home = BB.get({view: 'home', model: {name: 'home', options: {collection: collection}}, collection: collection});
                    home.model.fetch();
                    BBS.render(home);
                });
            },

            /**
             * Featured page
             */
            renderFeatured: function(){
                require(['games'],function() {
                    var collection = BB.get({collection: 'games'});
                    var featured = BB.get({view: 'featured', model: {name: 'featured', options: {collection: collection}}, collection: collection});
                    featured.model.fetch();
                    BBS.render(featured);
                });
            },

            /**
             * Render a single game, fetches the latest data from the server, also creates it if not in the collection
             * @param id
             */
            renderGame: function(id){
                require(['games','game'],function() {
                    var collection = BB.get({collection: 'games'});
                    var model = collection.get(id);

                    if (typeof model === 'undefined') {
                        // Game not found, create and fetch it
                        model = collection.add(new BB.model_definitions.game({steam_appid: id}));
                        model.fetch();
                    }

                    var game = BB.get({view: 'game', model: model, collection: collection});
                    BBS.render(game);
                });
            },

            /**
             * Search page and results
             */
            renderSearch: function(){
                require(['games','search'],function() {
                    var collection = BB.get({collection: 'games'});
                    var search = BB.get({view: 'search', model: 'search', collection: collection});
                    BBS.render(search);
                });
            },

            routes: {
                ''                                  :'renderHome',
                'loading'                           :'renderLoading',
                'coming-soon'                       :'renderComingSoon',
                'featured'                          :'renderFeatured',
                'game/:id'                          :'renderGame',
                'search/*'                          :'renderSearch',

                // 404 Page
                '*notFound'                         :'notFound' // This should always be last as it handles our 404 page
            }
        });
    });
}(window));