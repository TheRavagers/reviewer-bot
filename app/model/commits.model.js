var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var CommitSchema = new Schema({
    sha: String,
    tree: [{
        path: String,
        url:String
    }],
    repo_id:Number,``
    repo_name:String
});


mongoose.model('Commit', CommitSchema);

module.exports = CommitSchema;
