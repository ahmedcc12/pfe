const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt')
const validator = require('validator')

const userSchema = new Schema({
    email:{ 
        type : String,
        required: true,
        unique: true
    },
    name:{ 
        type : String,
        required: true,
        unique: true
    },
    password:{ 
        type : String,
        required: true,
        },
    //role , has to be either admin or user
    role: {
        type: String,
        required: true,
        enum: ['admin', 'user']
    },
    access: [String]
});

//static login method
userSchema.statics.login = async function(email, password) {
    if (!email || !password ) {
        throw new Error('All fields are required');
    }
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            return user;
        }
        throw new Error('Invalid password');
    }
    throw new Error('Invalid email');
}

// static signup method
userSchema.statics.signup = async function(email, name, password, role, access)  {

    if (!email || !name || !password || !role) {
        throw new Error('All fields are required');
    }
    if(role !== 'admin' && role !== 'user'){
        throw new Error('Invalid role');
    }
    if (!validator.isEmail(email)) {
        throw new Error('Invalid email');
    }
   /* if(!validator.isStrongPassword(password)){
        throw new Error('password not strong enough');
    }*/

    const exists = await this.findOne({ email });

    if (exists) {
        throw new Error('User already exists');
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)

    const user = await this.create({email,name,password: hash,role,access})

    return user

}

module.exports = mongoose.model('User', userSchema);
