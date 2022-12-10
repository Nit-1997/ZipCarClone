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
                let foundUser = await sequelize.query('CALL login (:email, :pwd)',
                    {
                        replacements:
                            {
                                email: email,
                                pwd: password
                            }
                    });
                foundUser = foundUser[0];
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