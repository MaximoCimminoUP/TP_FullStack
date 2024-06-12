const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const pokemonSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true, 
        index: { unique: true, dropDups: true }
    },
    evolutions: {
        type: [String],
        required: true,
        validate: {
            validator: function (value) {
                return Array.isArray(value); 
            },
            message: 'Evolutions should be an array of strings'
        }
    },
    image: {
        type: String,
        required: true
    },
    shinyImage: {
        type: String
    },
    accessories: {
        type: [{
            name: String,
            image: String
        }],
        required: true,
        validate: {
            validator: function (value) {
                return value.length >= 0; 
            },
            message: 'Accessories cannot be less than 0'
        }
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be negative']
    }
}, { timestamps: true });

pokemonSchema.set('toJSON', {
    transform: (document, object) => {
        object.id = document._id;
        delete object._id;
        delete object.__v;
    }
});

const Pokemon = mongoose.model('Pokemon', pokemonSchema);
module.exports = Pokemon;
