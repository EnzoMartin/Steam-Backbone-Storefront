Steam Backbone Experiment
=========================

With my recent discovery of Steam's Big Picture mode having a public JSON API, I decided to tackle some of the issues I have with Steam's storefront and search and see what sorts of possible solutions one could come up with using Node and Backbone as a proof-of-concept/prototype for fun.

You can view the in-development version here: http://steam-backbone.azurewebsites.net/

##Goals
###Key focus areas
* Performance - One of the biggest complaints I've found with Steam's store has to do with navigation. All navigation is done through full-page loads. Instead I'm focusing on building a single-page web application using Backbone and relying on JSON API calls to fetch relevant data for the page being requested. Some pages take up to 1,500ms to load
* Average page load time of ~400ms
* UI Responsiveness (Web/Tablet/Mobile)
* Deeper and richer search functionality - Extend searching to cover features available in each game such as steam achievements, cloud save, co-op shooter, singleplayer rpg, etc.

###Stretch goals
* Average page load time of ~200ms
* "Big Picture Mode" on web
* Support controller input/navigation
* Experiment with different layouts for pages
 
##Technologies

#####Platform
* [Node JS](http://nodejs.org/)
* [Hosted on Azure](http://www.windowsazure.com/)
* [New Relic](http://newrelic.com/)
 
#####Backend
* [Express](http://expressjs.com/)
* [JADE](http://jade-lang.com/)
* [i18next](http://i18next.com/node/)
* [GruntJS](http://gruntjs.com/)
* [MongoDB](http://www.mongodb.org/)

#####Frontend
* [Backbone](http://backbonejs.org/)
* [Underscore](http://underscorejs.org/)
* [jQuery](http://jquery.com/)
* [MomentJS](http://momentjs.com/)
* [SASS](http://sass-lang.com/)
* [DustJS](http://akdubya.github.io/dustjs/)
* [RequireJS](http://requirejs.org/)
* [Bootstrap 3](http://getbootstrap.com/)
