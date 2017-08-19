
var mongoose = require('mongoose')
var Repo = mongoose.model('Repo', require('../app/model/repo.model'))
var User = mongoose.model('User', require('../app/model/user.model'))
var Reviewer = mongoose.model('Reviewer', require('../app/model/reviewersSet.model'))
var UserStatics = mongoose.model('UserStatics', require('../app/model/userStatics.model'))
var UserPreferedReviewers = mongoose.model('UserPreferedReviewers', require('../app/model/userPreferedReviewers.model'))

import GitService from '../services/git/GitService';
import DataService from '../services/RepoService';

var dataServiceObj = new DataService();



export default class DataSeed {


	repoData = (req, res, next) => {

		//console.log('recived request', req.body);

		var repoData = {
			repo_id: req.body.id, 
			repoName: req.body.name, 
			repoType: req.body.description,
			language: req.body.language,
			private: req.body.private,
			author: [req.body.owner.id]
		}

		Repo.create(repoData, function(err) {
	        if (err) {
	        	console.log(err);
	            return next(err);
	        } else {
	        	console.log('Data saved');
	            res.status(200).json(repoData);
	        }
    	});

		
	}

	getRepoData = (req, res, next) => {
		console.log('Data Rec', req.query.repoId)
		dataServiceObj.getRepoDataById(req.query.repoId)
		.then((data)=>{
			res.status(200).json(data);
		});
	} 
}