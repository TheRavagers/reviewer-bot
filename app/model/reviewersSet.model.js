var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var ReviewerSchema = new Schema({

    pr_id: Number,

    pr_number: Number,

    user_id: Number,
    
    repo: {
        type: String
    },

    repo_id: Number

});


mongoose.model('Reviewer', ReviewerSchema);

module.exports = ReviewerSchema;