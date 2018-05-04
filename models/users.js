const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const {Schema} = mongoose;
const {ObjectId} = Schema.Types;

const options = {discriminatorKey: "kind"};

const userSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: ""
    },
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        }
    }
}, options);

// Create a virtual fullName property (doesn't get saved to
// DB but is part of the object that comes back from the DB)
userSchema.virtual("fullName").get(function () {
    return `${this.name.first} ${this.name.last}`;
});

userSchema.pre("save", function (next) {
    bcrypt.hash(this.password, 10, (err, hash) => {
        if (err) return next(err);
        this.password = hash;
        next();
    });
});

userSchema.methods.secure = function () {
    // Include virtuals (fullName) in the created object
    const user = this.toObject({virtuals: true});
    //remove sensitive info from user object before sending it back to client
    delete user.password;
    delete user.permissions;
    return user;
}
userSchema.methods.auth = function (pwdAttempt, cb) {
    bcrypt.compare(pwdAttempt, this.password, cb);
}

const UserModel = mongoose.model("User", userSchema);

const AdminUserModel = UserModel.discriminator("AdminUser", new Schema({
    permissions: {
        admin: {
            type: Boolean,
            default: true
        },
        rootAccess: {
            type: Boolean,
            default: false
        }
    }
}, options));

const StudentUserModel = UserModel.discriminator("StudentUser", new Schema({
    cohortId: {
        type: ObjectId,
        required: true,
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