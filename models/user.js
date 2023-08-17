const mongoose = require('mongoose')
const {DateTime} = require('luxon')

const Schema = mongoose.Schema

const UserSchema = new Schema (
    {
        email: {type: String, minLength: 3, maxLength: 20, unique: true, required: true},
        password: {type: String, minLength: 3, required: true},
        first_name: { type: String, minLength: 2, maxLength: 15, required: true},
        last_name: {type: String, minLength: 2, maxLength: 15, required: true},
        creation: { type: Date, default: Date.now()},
        membership: {type: Boolean, default: false},
        admin: { type: Boolean, default: false},
        messages: [ { type: Schema.Types.ObjectId, ref: "Message"}]
    }
)

UserSchema.virtual("url").get(function () {
    return `/board/user/${this._id}`
})

UserSchema.virtual("fullname").get(function () {
    let fullname = ""
    if (this.first_name && this.last_name) {
        fullname = ` ${this.first_name} ${this.last_name}`;
      }
    return fullname;
})

UserSchema.virtual("creation_formatted").get( function () {
    return DateTime.fromJSDate(this.creation).toFormat('yyyy-MM-dd')
})

UserSchema.virtual("membership_status").get( function () {
    if (this.membership) {
        return 'ACQUIRED'
    } else {
        return 'NOT ACQUIRED'
    }
})

module.exports = mongoose.model("User", UserSchema)