const path = require('path');
const mongoose = require('mongoose');

const { Schema } = mongoose;
const generalSchema = new Schema({ // Схема
    usersTree:

        [{

            userId: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },


            parentId: {
                type: Schema.Types.ObjectId,

            }


        }],
    companyId: {
        type: Schema.Types.ObjectId,
        ref: 'Company',
    }
}, { timestamps: true }); // Настройки схемы, в данном случае добавить поле createdAt, updatedAt (когда создали документ, когда обновили документ)


const modelname = path.basename(__filename, '.js'); // Название модели совпадает с названием файла модели. Тут мы получаем имя файла без расширения .js
const model = mongoose.model(modelname, generalSchema); // собственно создаем модель
module.exports = model;

