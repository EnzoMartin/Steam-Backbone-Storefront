/**
 * Generic require login routing middleware
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
exports.requiresLogin = function(req,res,next){
	if(!req.isAuthenticated()){
		return res.redirect('/login');
	}
	next();
};

/**
 * User authorizations routing middleware
 * @type {{hasAuthorization: Function}}
 */
exports.user = {
	hasAuthorization: function(req,res,next){
		if(req.profile.id != req.user.id){
			return res.redirect('/users/' + req.profile.id);
		}
		next();
	}
};

/**
 * Page authorizations routing middleware
 * @type {{hasAuthorization: Function}}
 */
exports.page = {
	hasAuthorization: function(req,res,next){
		if(req.page.user.id != req.user.id){
			return res.redirect('/page/' + req.page.id);
		}
		next();
	}
};
