Steam Backbone Experiment
=========================

Recent discovery that Steam's Big Picture mode has a public JSON API, I decided to tackle some of the issues I have with Steam's storefront and search

You can view the in-development version here: http://steam-backbone.azurewebsites.net/

##Goals
###Key focus areas
* Performance - One of the biggest complaints I've found with Steam's store has to do with navigation. All navigation is done through full-page loads. Instead I'm focusing on building a single-page web application using Backbone and relying on JSON API calls to fetch relevant data for the page being requested.
* UI Responsiveness (Web/Tablet/Mobile)
* Deeper and richer search functionality - Extend searching to cover features available in each game such as steam achievements, cloud save, co-op shooter, singleplayer rpg, etc.

###Stretch goals
* "Big Picture Mode" on web
* Support controller input/navigation
* Experiment with different layouts for pages
 
##Technologies

#####Server Platform
* [Node JS](http://nodejs.org/)
* [Hosted on Azure](http://www.windowsazure.com/)
 
#####Backend
* [Express](http://expressjs.com/)
* [JADE](http://jade-lang.com/)
* [i18next](http://i18next.com/node/)
* [GruntJS](http://gruntjs.com/)

#####Frontend
* [Backbone](http://backbonejs.org/)
* [Underscore](http://underscorejs.org/)
* [jQuery](http://jquery.com/)
* [MomentJS](http://momentjs.com/)
* [SASS](http://sass-lang.com/)
* [DustJS](http://akdubya.github.io/dustjs/)
* [RequireJS](http://requirejs.org/)
* [Bootstrap 3](http://getbootstrap.com/)
* [YepNope](http://yepnopejs.com/)
