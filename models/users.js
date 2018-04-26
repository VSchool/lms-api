const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const { Schema } = mongoose;
const options = { discriminatorKey: "kind" };

const userSchema = new Schema({
    email: {
        unique: true,
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    avatar: {
        type: String,
        default: ""
    },
    name: {
        f: {
            required: true,
            type: String
        },
        l: {
            required: true,
            type: String
        }
    },


}, options);

userSchema.pre("save", function (next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });
});
userSchema.methods.secure = function () {
    const user = this.toObject();
    //remove sensitive info from user object before sending it back to client
    delete user.password;
    delete user.permissions;
    return user;
}
userSchema.methods.auth = function (pwdAttempt, cb) {
    bcrypt.compare(pwdAttempt, this.password, cb);
}

const UserModel = mongoose.model("Users", userSchema);

const AdminUserModel = UserModel.discriminator("AdminUser", new Schema({
    permissions: {
        admin: {
            default: true,
            type: Boolean
        },
        rootAccess: {
            default: false,
            type: Boolean
        }
    }
}, options));

const StudentUserModel = UserModel.discriminator("StudentUser", new Schema({
    cohortId: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cohorts"
    },
    passed: {
        type: Boolean,
        default: false
    }
}, options));

module.exports = {
    UserModel,
    AdminUserModel,
    StudentUserModel
}