var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');
var RepoSchema = new Schema({
    repoName: {
        type : String
        
    },
    repoType: {
        type : String
        trim: true
    },
    language: {
        type : String
        trim: true
    },
    author: {
        type : [Schema.Types.ObjectId]
    }
    
});

mongoose.model('Repo', RepoSchema);