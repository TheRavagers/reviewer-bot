var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var UserPreferedReviewersSchema = new Schema({
    user_id: Number,

    username: {
        type: String
    },
    
    repo: {
        type: String
    },

    repo_id: Number

});


mongoose.model('UserPreferedReviewers', UserPreferedReviewersSchema);
module.exports = UserPreferedReviewersSchema;