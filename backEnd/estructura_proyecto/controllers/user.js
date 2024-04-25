require('mongoose');
const Users = require('../models/user');


const addUser = async (email,name,lastname,isActive,roles, password) => {

    // let existUser = await Usr.findOne({ email: email });
    let existUser = false;
     console.log(existUser);
     if(!existUser) {
        console.log(password)
         const cryptoPass = require('crypto').createHash('sha256').update(password).digest('hex');
         console.log(cryptoPass)
         const usr = new Users(
             {              
                 name: name,
                 lastname:lastname,
                 email: email,
                 isActive:isActive,
                 roles: roles,
                 password:cryptoPass
             }
         );
 
         let user = await usr.save(); 
         console.log("usuario nuevo");
         console.log(user);
         return { user }; 
 
     }else{
         return false;
     }
 }   



const getAllUsers = async (limit,offset) => {

    const user = await Users.find({}).limit(limit).skip(offset);

    return Users;
}

const getUser = async(id) => {

    const user = await Users.findById(id);

    // await Usr.findOne({ _id: req.params.id })

    return user;
}

const editUser = async(user) => {

    const result = await Users.findByIdAndUpdate(user._id,user,{new:true});

    return result;
}

const editRoles = async(roles,id) => {

    const result = await Users.findByIdAndUpdate(id,{$set:{roles:roles}},{new:true});

    return result;
}

const deleteUser = async(id) => {

    const result = await Users.findByIdAndDelete(id);

    return result;
}

module.exports = { addUser, getAllUsers, getUser, editUser, editRoles, deleteUser }