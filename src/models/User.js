const mongoose = require('mongoose');
const { Schema } = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now }
});

//This method encrypts the password sent by the user
UserSchema.methods.encryptPassword = async(password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = bcrypt.hash(password, salt);
    return hash;
};

/* This method compares the password sent by the user
 to sign in with the password encrypted stored*/
//Arrow function is not used because it does not allow using THIS
UserSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', UserSchema);