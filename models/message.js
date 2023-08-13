const mongoose = require('mongoose')

const Schema = mongoose.Schema

const MessageSchema = new Schema (
    {
        poster: { type: Schema.Types.ObjectId, ref: "User"},
        title: { type: String, required: true},
        timestamp: { type: Date.now},
        message: { type: String, required: true}
    }
)

MessageSchema.virtual("url").get(function () {
    return `board/post/${this._id}`
})


module.exports = mongoose.model("Message", MessageSchema)