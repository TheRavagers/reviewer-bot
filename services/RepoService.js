var mongoose = require('mongoose')
var Repo = mongoose.model('Repo', require('../app/model/repo.model'))
var User = mongoose.model('User', require('../app/model/user.model'))
var Reviewer = mongoose.model('Reviewer', require('../app/model/reviewersSet.model'))
var UserStatics = mongoose.model('UserStatics', require('../app/model/userStatics.model'))
var UserCommits = mongoose.model('Commit', require('../app/model/commits.model'))
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

	upsertRepo = (data) => {
		return new Promise((resolve, reject)=>{
			Repo.findOneAndUpdate({repo_id:data.repo_id}, data,{
				upsert:true
			}, function(err, data) {
				if(err) {
					return reject(err);
				} else {
					resolve( data );
				}
			});
		});
	}

	/*
	* Get user data
	*/
	getUserDataById = (id) => {
		return new Promise((resolve, reject)=>{
			User.find({id: id}, function(err, data) {
				if(err) {
					return reject(err);
				} else {
					resolve( data );
				}
			});
		})
	}

	upsertUserData = (data)=>{
		return new Promise((resolve, reject)=>{
			User.findOneAndUpdate({id: data.id}, data, {
				upsert: true
			},  function(err, data) {
				if(err) {
					return reject(err);
				} else {
					resolve( data );
				}
			});
		})
	}

	getReviewerDataById = (id) => {
		return new Promise((resolve, reject)=>{
			Reviewer.find({repo_id: id}, function(err, data) {
				if(err) {
					return reject(err);
				} else {
					resolve( data );
				}
			});
		})
	}

	getUserStaticsDataById = (id) => {
		return new Promise((resolve, reject)=>{
			UserStatics.find({id: id}, function(err, data) {
				if(err) {
					return reject(err);
				} else {
					resolve( data );
				}
			});
		})
	}

	upsertUserStatics = (data) => {
		return new Promise((resolve, reject)=>{
			UserStatics.findOneAndUpdate({id: id}, data, {
				upsert: true
			},  function(err, data) {
				if(err) {
					return reject(err);
				} else {
					resolve( data );
				}
			});
		})
	}

	getRepoCommitsByRepoId = (repoId)=>{
		return new Promise((resolve, reject)=>{
			UserCommits.find({repo_id: repoId}, function(err, data) {
				if(err) {
					return reject(err);
				} else {
					resolve( data );
				}
			});
		})
	}

	userRepoCommits = (data)=>{
		return new Promise((resolve, reject)=>{
			UserCommits.findOneAndUpdate({sha: data.sha}, data, {
				upsert: true
			},  function(err, data) {
				if(err) {
					return reject(err);
				} else {
					resolve( data );
				}
			});
		})
	}

	insertReviewersToMongo = (data)=>{
		return new Promise((resolve, reject)=>{
			UserPreferedReviewers.findOneAndUpdate({user_id: data.user_id,repo_id:data.repo_id}, data, {
				upsert: true
			},  function(err, data) {
				if(err) {
					return reject(err);
				} else {
					resolve( data );
				}
			});
		});
	}

	getRepoReviewers = (filter)=>{
		/**
		 * filter {repo_id:1, user_id:3}
		 */
		return new Promise((resolve, reject)=>{
			UserPreferedReviewers.find(filter, function(err, data) {
				if(err) {
					return reject(err);
				} else {
					resolve( data );
				}
			});
		});
	}
}