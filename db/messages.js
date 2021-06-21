const Joi = require('joi');
const db = require('./connection');

const schema = Joi.object().keys({
    memoryType: Joi.string().required(),
    driveType: Joi.string().required(),
    serial: Joi.string().max(500).required(),
    name: Joi.string().required(),
    amount: Joi.string().pattern(/^[0-9]+$/).required(),
    imageURL: Joi.string().uri({
        scheme: [
            /https?/
        ]
    })
});

const messages = db.get('messages');

function getAll() {
    return messages.find();
}

function create(message) {
    // if (!message.username) message.username = 'Anonymous';

    const result = schema.validate(message);
    if (result.error == null) {
        message.created = new Date();
        return messages.insert(message);
    } else {
        return Promise.reject(result.error);
    }
}

function deleteMessage(id) {
    messages.remove({ "_id": id });
    return messages.find();
}

function editMessage(id, message) {
    messages.update({ _id: id }, { $set: message })
    return { "message": "Edit successful" }
}


module.exports = {
    create,
    getAll,
    deleteMessage,
    editMessage
};