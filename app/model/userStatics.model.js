var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var UserStaticsSchema = new Schema({
    id: Number,

    login: {
        type: String
    },
    lastName: {
        type: String
    },
    email: {
        type: String,
        match: /.+\@.+\..+/
    },
    username: {
        type: String
    },
    repo: [Number],

    type: String,

    site_admin: Boolean,

    statics_id: Number 

});


mongoose.model('UserStatics', UserStaticsSchema);