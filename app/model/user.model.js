var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

var UserSchema = new Schema({
    firstName: {
        type : String,
        trim: true
    },
    lastName: {
        type : String,
        trim: true
    },
    email: {
        type : String,
        trim: true,
        match: /.+\@.+\..+/
    },
    username: {
        type : String,
        trim: true,
        unique:true,
        required:true
    },
    repo: [Schema.Types.ObjectId]




    

    
});


mongoose.model('User', UserSchema);