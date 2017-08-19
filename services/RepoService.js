var mongoose = require('mongoose')
var Repo = mongoose.model('Repo', require('../app/model/repo.model'))
var User = mongoose.model('User', require('../app/model/user.model'))
var Reviewer = mongoose.model('Reviewer', require('../app/model/reviewersSet.model'))
var UserStatics = mongoose.model('UserStatics', require('../app/model/userStatics.model'))
var UserPreferedReviewers = mongoose.model('UserPreferedReviewers', require('../app/model/userPreferedReviewers.model'))

import GitService from '../services/git/GitService';
import dataService from '../controllers/repo.controller';


export default class DataSeedService {

	getRepoDataById = (id) => {
		return new Promise((resolve, reject)=>{
			Repo.find({repo_id: id}, function(err, data) {
				if(err) {
					return reject(err);
				} else {
					resolve( data );
				}
			});
		})
	} 
}