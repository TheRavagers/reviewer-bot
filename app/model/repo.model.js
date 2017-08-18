var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var RepoSchema = new Schema({

    id: Number,

    repoName: {
        type: String
    },

    repoType: {
        type: String,
        trim: true
    },

    language: {
        type: [String]
        
    },

    private: Boolean,

    

    author: {
        type: [Number]
    }

});

mongoose.model('Repo', RepoSchema);