const mongoose = require('mongoose');
const config = require('config');

const dbUrl = config.mongoString === 'heroku' ? process.env.MONGO : config.mongoString;

mongoose.connect(dbUrl, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function () {
    console.log('Connected to mongoDB Atlas!');
});

const userSchema = new mongoose.Schema({
    userID: String,
    warns: [
        {
            reason: String,
            moderator: String,
            moderatorTag: String,
            date: Date
        }
    ]
});

userSchema.statics.getUser = async function (userID) {
    const output = await this.findOne({ userID: userID }) || await this.create({ userID: userID });
    return output;
};
userSchema.statics.createWarn = async function (userID, reason, mod, modTag, date) {
    const userEntry = await this.findOne({ userID: userID }) || await this.create({ userID: userID });
    await userEntry.warns.push(
        {
            reason: reason,
            moderator: mod,
            moderatorTag: modTag,
            date: date
        }
    );
    userEntry.save();
};

const users = mongoose.model('users', userSchema);

module.exports = users;