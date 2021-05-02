const bcrypt = require('bcryptjs')
const User = require('./User')
const jwt = require('jsonwebtoken');

module.exports = {

    createUser: async (req, res) => {
      

        try {
         
            let findUser = await User.findOne({email: req.body.email})
            
           
            if(findUser){
                throw {
                    message: 'Email already exists!',
                    status: 409
                }
            } 

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
            if(e.status === 409){
                res.status(e.status).json({
                    message: e.message
                })
            } else
            res.status(500).json({
                message: "Something went wrong"
            })
            
        }
    },

    logIn : async(req, res) => {

    
        
        try {
            console.log('trying');
            console.log(process.env.SECRET_KEY);
            let foundEmail   = await User.findOne({email: req.body.email})
           
            if(!foundEmail || foundEmail === null){
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
            
            let token = jwt.sign({email: foundEmail.email, _id: foundEmail.id}, process.env.SECRET_KEY, {expiresIn :'7d'})
           
            res.json({
                jwtToken:token
            })
        } catch (error) {

           if(error.status === 404){
               res.status(error.status).json({
                   message: error.message
               })
           }else if(error.status === 401){
            res.status(error.status).json({
                message: error.message
            })


        }
    }
    },

    addDeck: async(req, res) => {

       
        try {
            let email =req.body.email
            console.log(req.body.deck);
            let foundUser = await User.findOne({email});
            let oldDecks = [...foundUser.decks]
            let newDecks = oldDecks.concat([req.body.deck])

            await User.findOneAndUpdate({
                email: req.body.email
            }, {
                decks: newDecks
            }) 

        } catch (error) {
            console.log(error);
        }
    },
    getDecks: async(req,res) => {

        let email = req.body.email
        try {
            let foundUser = await User.findOne({email});

            res.json({data: foundUser})
        } catch (error) {
            
        }
    },
    deleteDeck: async(req,res) => {
        let email = req.body.email
        try {
            let foundUser = await User.findOne({email});


            let editedDecks = foundUser.decks.filter((item) => {
                return item.id !== req.body.id
            })

            console.log(editedDecks);
            await User.findOneAndUpdate({
                email: req.body.email
            }, {
                decks: editedDecks
            })  
           
        } catch (error) {
            
        }

    }, 
    addKanji: async(req,res) => {
        let email = req.body.email
    //   console.log(req.body);
        try {
            let foundUser = await User.findOne({email});
            console.log('hello2');
         let newDecks = foundUser.decks.map((item) => {
           
                if(item.id === req.body.deck.id){
                    console.log(req.body);
                    item.kanji.push(req.body.kanji)
                    return item
                } else return item
            })
            console.log('hello3');
           
            console.log(newDecks);
            

           
            await User.findOneAndUpdate({
                email: req.body.email
            }, {
                decks: newDecks
            })  
           
        } catch (error) {
            
        }
    },
    deleteKanji : async (req, res) => {
        
        let email = req.body.email
        try {
            
            let foundUser = await User.findOne({email});

            // console.log(foundUser.decks)

            let NewDecks = foundUser.decks.map((item) => {
                if (item.id === req.body.id){
                     item.kanji = req.body.kanji
                     return item
                } else {
                    return item
                }
            })

            
            console.log(NewDecks);
            // foundUser.decks = NewDecks
            // console.log(foundUser);

            // console.log(req.body.kanji.length);

            

            
            await User.findOneAndUpdate({
                email: req.body.email
            }, {
                decks: NewDecks
            })  

            
        } catch (error) {
            
        }
    }


}