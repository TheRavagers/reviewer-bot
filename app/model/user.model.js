var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var UserSchema = new Schema({
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


mongoose.model('User', UserSchema);
module.exports = UserSchema;



// {
//       "login": "mdewey",
//       "id": 1793923,
//       "avatar_url": "https://avatars2.githubusercontent.com/u/1793923?v=4",
//       "gravatar_id": "",
//       "url": "https://api.github.com/users/mdewey",
//       "html_url": "https://github.com/mdewey",
//       "followers_url": "https://api.github.com/users/mdewey/followers",
//       "following_url": "https://api.github.com/users/mdewey/following{/other_user}",
//       "gists_url": "https://api.github.com/users/mdewey/gists{/gist_id}",
//       "starred_url": "https://api.github.com/users/mdewey/starred{/owner}{/repo}",
//       "subscriptions_url": "https://api.github.com/users/mdewey/subscriptions",
//       "organizations_url": "https://api.github.com/users/mdewey/orgs",
//       "repos_url": "https://api.github.com/users/mdewey/repos",
//       "events_url": "https://api.github.com/users/mdewey/events{/privacy}",
//       "received_events_url": "https://api.github.com/users/mdewey/received_events",
//       "type": "User",
//       "site_admin": false
//     }