const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
const uniqueValidator = require("mongoose-unique-validator");
const userSchema = Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String },
});
userSchema.plugin(uniqueValidator);

userSchema.pre(/save|update|create/i, function(next) {
    let user = this;
    if (!user.isModified('password')) return next();

    bcrypt.genSalt(10, function(err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});
userSchema.methods.authenticate = function(plainPassword){
    return new Promise((resolve,reject)=>{
        bcrypt.compare(plainPassword, this.password, function(err, result) {
            if(err)return reject;
            return resolve(result);
        });
    })
}

module.exports = mongoose.model("User", userSchema);
