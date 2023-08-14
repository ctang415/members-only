const mongoose = require('mongoose')
const {DateTime} = require('luxon')

const Schema = mongoose.Schema

const MessageSchema = new Schema (
    {
        poster: { type: Schema.Types.ObjectId, ref: "User"},
        title: { type: String, required: true},
        timestamp: { type: Date, default: Date.now},
        message: { type: String, required: true}
    }
)

MessageSchema.virtual("url").get(function () {
    return `board/post/${this._id}`
})

MessageSchema.virtual("timestamp_formatted").get( function () {
    return DateTime.fromJSDate(this.timestamp).toFormat('yyyy-MM-dd')
})


module.exports = mongoose.model("Message", MessageSchema)