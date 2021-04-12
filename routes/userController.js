const bcrypt = require('bcryptjs')
const User = require('./User')
const jwt = require('jsonwebtoken');

module.exports = {

    createUser: async (req, res) => {
        
        console.log(req.body);

        try {
            let createdUser = await new User({
                email: req.body.email,
                password: req.body.password
            })
    
            let genSalt = await bcrypt.genSalt(12)
            let hashedPassword = await bcrypt.hash(createdUser.password, genSalt)
            createdUser.password = hashedPassword
            await createdUser.save()
    
            res.json({
                message: "User Created"
            })
        } catch (e) {
            res.status(500).json({
                message: "Something went wrong"
            })
            
        }
    },

    logIn : async(req, res) => {

        console.log('hello');
        
        try {
            let foundEmail   = await User.findOne({email: req.body.email})

            if(!foundEmail){
                throw {
                    message: 'No User found, please sign up!',
                    status: 404
                }
            }

            else {let comparedPassword = await bcrypt.compare(
                req.body.password,
                foundEmail.password )
            
            if(!comparedPassword){
                throw {
                    message: 'Please check your email and password.',
                    status: 401
                }
            }}
            
            let token = jwt.sign({email: foundEmail.email, _id: foundEmail.id}, 'SECRET_KEY', {expiresIn :'7d'})
            console.log(token);
            res.json({
                jwtToken:token
            })

        } catch (error) {

            
        }



    }


}