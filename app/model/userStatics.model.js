var mongoose = require('mongoose'),
    Schema = mongoose.Schema

var UserStaticsSchema = new Schema({
    id: Number,
    days: [Number],
    contributions:Number,
});

mongoose.model('UserStatics', UserStaticsSchema);
module.exports = UserStaticsSchema;