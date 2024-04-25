const mongoose = require('mongoose');
const { required } = require('yargs');
const Schema = mongoose.Schema;

const stuffedAnimalSchema = new Schema({
    id: {
        type: Number,  
        required: true,
        index: {unique: true, dropDups: true} 
       
    },
    species: {
        type: String,
        required: true
    },
    model: {
        type: String,
        required: true
    },
    coloursAvailable: {
        type: [String], 
        required: true,
		validate: {
			validator: function(value)
			{
				return value.length >0; 
			},
			message: 'At least one colour needs to be selected'
		}
    },
    stock: {
        type: Number, 
        required: true
    }
}, { timestamps: true });


stuffedAnimalSchema.set('toJSON', {
    transform: (document, object) => {
        object.id = document.id;
        delete object._id; 
        delete object.__v; 
    }
});



const stuffedAnimal = mongoose.model('Plushy', stuffedAnimalSchema); 
module.exports = stuffedAnimal;