const mongoose = require('mongoose')

const Schema = mongoose.Schema

const UserSchema = new Schema (
    {
        email: {type: String, minLength: 3, maxLength: 20, unique: true, required: true},
        password: {type: String, minLength: 3, maxLength: 20, required: true},
        first_name: { type: String, minLength: 2, maxLength: 15, required: true},
        last_name: {type: String, minLength: 2, maxLength: 15, required: true},
        membership: {type: Boolean, default: false},
        messages: [ { type: Schema.Types.ObjectId, ref: "Message"}]
    }
)

UserSchema.virtual("url").get(function () {
    return `board/user/${this._id}`
})

UserSchema.virtual("fullname").get(function () {
    let fullname = ""
    if (this.first_name && this.last_name) {
        fullname = `${this.last_name}, ${this.first_name}`;
      }
    return fullname;
})

module.exports = mongoose.model("User", UserSchema)