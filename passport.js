const bCrypt = require("bcrypt-nodejs");
const models = require("./server/models");
const sequelize = models.sequelize;

module.exports = (passport, user) => {
    let User = user;
    let LocalStrategy = require('passport-local').Strategy;
    let bCrypt = require('bcrypt-nodejs');


    //serialize
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // deserialize user
    passport.deserializeUser(function (id, done) {
        User.findById(id).then(function (user) {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });

    //signup
    passport.use('local-signup', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            //hashing the password
            // let generateHash = async (password) => {
            //     return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            // };

            try {
                let newlyCreated = await sequelize.query('CALL signup (:email, :type , :pwd , :name , :contact)',
                    {
                        replacements:
                            {
                                email: email,
                                type: req.body.type,
                                pwd: password,
                                name: req.body.name,
                                contact: req.body.contact
                            }
                    });
                newlyCreated  = newlyCreated[0];

                if (!newlyCreated) {
                    let msg = "User creation failure";
                    return done(null, false, {message: msg});
                } else {
                    let msg = "Welcome to ZipCar " + newlyCreated.name;
                    return done(null, newlyCreated, {message: msg});
                }
            } catch (error) {
                if (error.original) {
                    let msg = error.original.sqlMessage;
                    return done(null, false, {message: msg});
                } else {
                    console.log("Error:", error);
                    return done(null, false, {message: error});
                }
            }

            // select * from users where email = abc@gmail.com limit 1
            // CALL findUser(email)


            // let foundUser = await User.findOne({
            //     where: {
            //         email: email
            //     }
            // });
            //
            // let msg;
            //
            // if (foundUser) {
            //     msg = 'That email is already taken';
            //     return done(null, false, {message: msg});
            // } else {
            //     let userPassword = await generateHash(password);
            //     let data =
            //         {
            //             email: email,
            //             type: req.body.type,
            //             password: userPassword,
            //             name: req.body.name,
            //             contact: req.body.contact,
            //             createdAt: new Date()
            //         };
            //
            //     console.log(userPassword);
            //     // CALL createUser(email , type ...)
            //
            //     let newlyCreatedUser = await User.create(data);
            //     if (!newlyCreatedUser) {
            //         msg = "User creation failure";
            //         return done(null, false, {message: msg});
            //     } else {
            //         msg = "Welcome to ZipCar " + newlyCreatedUser.name;
            //         return done(null, newlyCreatedUser, {message: msg});
            //     }
            // }

        }
    ));


    //login
    passport.use('local-signin', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                let User = user;
                // let isValidPassword = async (userpass, password) => {
                //     return  bCrypt.compareSync(password, userpass);
                // }
                // let generateHash = async (password) => {
                //     return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
                // };
                let foundUser = await sequelize.query('CALL login (:email, :pwd)',
                    {
                        replacements:
                            {
                                email: email,
                                pwd: password
                            }
                    });
                foundUser = foundUser[0];


                // console.log(foundUser);


                // let foundUser = await User.findOne({
                //     where: {
                //         email: email
                //     }
                // });
                // let msg;
                // if (!foundUser) {
                //     msg = 'Email does not exist';
                //     return done(null, false, {message: msg});
                // }
                // if (await !isValidPassword(foundUser.password, password)) {
                //     msg = 'Incorrect password.';
                //     return done(null, false, {message: msg});
                // }
                // let userinfo = foundUser.get();
                let msg = "Welcome to ZipCar " + foundUser.name;
                return done(null, foundUser , {message : msg});
            } catch (error) {
                if (error.original.sqlMessage) {
                    let msg = error.original.sqlMessage;
                    return done(null, false, {message: msg});
                } else {
                    console.log("Error:", error);
                    let msg = error;
                    return done(null, false, {message: msg});
                }
            }
        }
    ));

}