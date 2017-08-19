var Repo = require("mongoose").model("Repo")


export.list = function(req, res) {
	Repo.find(
	{
		id: req.id
	}, function(err, repo, next){
		if(err) {
			return next(err);
		} else {
			res.json(repo);
		}
	});
}


exports.create = function(req, res, next) {
    var repoSave = new Repo(req.body);
    repoSave.save(function(err) {
        if (err) {
            return next(err);
        } else {
            res.json(repoSave);
        }
    });
};


exports.update = function(req, res, next) {
	Repo.findByIdAndUpdate(req.repo.id, req.body, function(err, updateEvent){
		if(err) {
			return next(err);

		} else {
			res.json(updateEvent);
		}
	});
};

exports.get = function(req, res, next) {
	Repo.find({id: req.id}).exec(function(err, event) {
		if(err) {
			return next(err);
		} else {
			res.json(event);
		}
	});
}