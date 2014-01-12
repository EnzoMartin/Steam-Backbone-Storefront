(function (window){
    requirejs([
        'jquery',
        'underscore',
        'backbone',
        'dust',
        'BB'
    ], function($, _, Backbone, dust, BB) {
        BB.view_definitions.search = Backbone.View.extend({
            id: 'search',

            title: 'Search',

            template: 'tpl_search',

            events: {
                'submit #search-form': 'submit_form'
            },

            initialize: function(){
                this.listenTo(this.model, 'sync', this.renderForm);
                this.subviews = {};
                this.subviews.resultsView = BB.get({view:'search_results',model:'results'});
                this.subviews.formView = BB.get({view:'search_form',model:this.model});

                if(!this.subviews.resultsView.model.get('bootstrapped') && window.location.search){
                    this.subviews.resultsView.model.sync();
                } else {
                    this.model.unset('bootstrapped');
                }
            },

            submit_form: function (event) {
                event.preventDefault();

                // Grab form elements from the event object
                var elements = event.target.elements;

                var url = [];
                var i = 0;
                var len = elements.length;
                while(i < len){
                    var input = elements[i];
                    if(input.nodeName === 'INPUT' || input.nodeName === 'SELECT'){
                        var value = input.value;
                        if(input.type == 'select-multiple'){
                            for (var j in input.selectedOptions) {
                                value = input.selectedOptions[j].value;
                                if(value){
                                    url.push(input.name + '=' + encodeURIComponent(input.selectedOptions[j].value));
                                }
                            }
                        } else {
                            if(value){
                                url.push(input.name + '=' + encodeURIComponent(input.value));
                            }
                        }
                    }
                    i++;
                }

                // Push the new URL
                history.pushState({}, document.title, '?' + url.join('&'));

                // Fetch the results
                this.subviews.resultsView.model.sync();
            },

            render: function(){
                var view = this;
                dust.render(this.template, {}, function(err, out) {
                    view.$el.html(out);
                    view.$el.find('#search-form').html(view.renderForm());
                    view.$el.find('#search-results').replaceWith(view.renderResults());
                });
            },

            renderForm: function(){
                // Update the params
                this.model.get_params();
                this.subviews.formView.render();
                return this.subviews.formView.el;
            },

            renderResults: function(){
                this.subviews.resultsView.render();
                return this.subviews.resultsView.el;
            }
        });

        // TODO: Add displaying current search params
        BB.view_definitions.search_form = Backbone.View.extend({
            template: 'tpl_search_form',

            events: {

            },

            render: function(){
                var view = this;
                dust.render(this.template, this.model.toJSON(), function(err, out) {
                    view.$el.html(out);
                });
            }
        });

        //TODO: Add pagination
        BB.view_definitions.search_results = Backbone.View.extend({
            template: 'tpl_search_results',

            id: 'search-results',

            events: {

            },

            initialize: function(){
                this.listenTo(this.model, 'change', this.render);
            },

            render: function(){
                var view = this;
                dust.render(this.template, this.model.toJSON(), function(err, out) {
                    view.$el.html(out);
                });
            }
        });
    });
})(window);