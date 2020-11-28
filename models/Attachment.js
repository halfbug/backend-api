const mongoose = require('mongoose');

const AttachmentSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, 'Please add the user id'],
    },
    originalName: {
        type: String,
        required: [true, 'Please add the original name'],
    },
    customName: {
        type: String,
    },
    extension: {
        type: String,
        required: [true, 'Please add the extension'],
    },
    mimeType: {
        type: String,
        required: [true, 'Please add the mimeType'],
    },
    relativePath: {
        type: String,
        required: [true, 'Please add the relativePath'],
    },
    relatedTo: {
        type: String,
        required: [true, 'Please add the relatedTo such as goverment_id document'],
    },
});

module.exports = mongoose.model('Attachment', AttachmentSchema);
