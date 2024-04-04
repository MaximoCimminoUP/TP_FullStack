const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const teddySchema = new Schema({

	id:{
		type: int,
		required:true,
		index: {unique: true, dropDups: true}
	},
    
    species:{
		type: String,
		required:true
    },
	model:{
		type: String,
		required:true
    },
    coloursAvailable:{
		type: Array,
		required:true
	},
	stock:{
		type: int,
		required:true
	},
	
	
}, { timestamps: true } ).set('toJSON',{
    transform: (document, object) => {
        object.id = document.id;
        delete object._id;
        delete object.password;
    }
});


const teddy = mongoose.model('teddy',teddySchema);
module.exports = teddy;