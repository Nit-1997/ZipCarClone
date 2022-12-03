module.exports =  (passport, user) =>{
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
        function (req, email, password, done) {
            console.log("here");
            //hashing the password
            let generateHash = function (password) {
                return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
            };

            // select * from users where email = abc@gmail.com limit 1
            // CALL findUser(email)
            User.findOne({
                where: {
                    email: email
                }
            }).then(function (user) {
                if (user) {
                    res.flash("error", 'That email is already taken');
                    return done(null, false);
                } else {
                    let userPassword = generateHash(password);
                    let data =
                        {
                            email: email,
                            type: req.body.type,
                            password: userPassword,
                            name: req.body.name,
                            contact: req.body.contact,
                            createdAt: new Date()
                        };

                    // CALL createUser(email , type ...)

                    User.create(data).then( (newUser, created)=>{
                        if (!newUser) {
                            return done(null, false);
                        }
                        if (newUser) {
                            req.flash("success", "Welcome to ZipCar " + newUser.name);
                            return done(null, newUser);
                        }
                    });
                }
            });

        }
    ));


    //login
    passport.use('local-signin', new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, email, password, done) {
            let User = user;
            let isValidPassword = function (userpass, password) {
                return bCrypt.compareSync(password, userpass);
            }
            User.findOne({
                where: {
                    email: email
                }
            }).then(function (user) {
                if (!user) {
                    res.flash("error", 'Email does not exist');
                    return done(null, false);
                }
                if (!isValidPassword(user.password, password)) {
                    res.flash("error", 'Incorrect password.');
                    return done(null, false);
                }
                let userinfo = user.get();
                return done(null, userinfo);
            }).catch(function (err) {
                console.log("Error:", err);
                return done(null, false);
            });
        }
    ));

}