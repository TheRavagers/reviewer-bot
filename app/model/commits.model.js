var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var CommitSchema = new Schema({
    sha: String,

    tree: [{
        p: String,

    }]

});


mongoose.model('Commit', CommitSchema);

module.exports = CommitSchema;
