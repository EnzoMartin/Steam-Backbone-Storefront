var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GameSchema = new Schema({
	title: {type: String,trim: true},
	slug: {type: String,trim: true},
	body: {type: String,trim: true},
	createdAt: {type: Date,default: Date.now},
	updatedAt: {type: Date,default: Date.now},
	deletedAt: {type: Date},
	published: {'type': Boolean,'default': false}
});

mongoose.model('Page',PageSchema);