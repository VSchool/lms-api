const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const { Schema } = mongoose
const { ObjectId } = Schema.Types

const options = { discriminatorKey: "type", timestamps: true }


/* * * * * * */
/* BASE USER */
/* * * * * * */
const baseUserSchema = new Schema({
    name: {
        first: {
            type: String,
            required: true
        },
        last: {
            type: String,
            required: true
        }
    },
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
    }
}, options)

// Create a virtual fullName property (doesn't get saved to
// DB but is part of the object that comes back from the DB)
baseUserSchema.virtual("fullName").get(function () {
    return `${this.name.first} ${this.name.last}`
})

// Hash password before save to DB and ensure StudentUsers are admin: false
baseUserSchema.pre("save", async function () {
    try {
        // hash the password
        this.password = await bcrypt.hash(this.password, 10)

        // if student user, ensure (again) `admin` is false
        if (this.type === "StudentUser") {
            this.admin = false
        }
    } catch (e) {
        throw new Error(e)
    }
})

baseUserSchema.pre("findOneAndUpdate", async function() {
    try {
        // hash the password and ensure admin is false
        this._update.password = await bcrypt.hash(this._update.password, 10)
        this._update.admin = false
    } catch (e) {
        throw new Error(e)
    }
})

baseUserSchema.methods.secure = function () {
    // Include virtuals (fullName) in the created object
    const user = this.toObject({ virtuals: true })
    //remove sensitive info from user object before sending it back to client
    delete user.password
    // delete user._id
    return user
}

baseUserSchema.methods.auth = async function(pwdAttempt) {
    // returns promise that resolves to true or false
    return await bcrypt.compare(pwdAttempt, this.password)
}

const BaseUser = mongoose.model("User", baseUserSchema)


/* * * * * * * */
/* ADMIN USER  */
/* * * * * * * */

const AdminUser = BaseUser.discriminator("AdminUser", new Schema({
    admin: {
        type: Boolean,
        default: true
    },
}, options))


/* * * * * * * * * */
/*  STUDENT USER   */
/* * * * * * * * * */

// `courseSchema` is for use in the embedded
// courses array in StudentUser model below
const courseSchema = new Schema({
    course: {
        type: ObjectId,
        ref: "Course"
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    finishDate: Date,
    currentModule: {
        type: Schema.Types.ObjectId,
        ref: "Module"
    }
})

const StudentUser = BaseUser.discriminator("StudentUser", new Schema({
    courses: [courseSchema],
    admin: {
        type: Boolean,
        default: false
    }
}, options))

module.exports = {
    AdminUser,
    StudentUser,
    BaseUser
}
