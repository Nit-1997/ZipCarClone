let express = require("express")
    , app = express()
    , config = require('config')
    , methodOverride = require("method-override")
    , bodyParser = require("body-parser")
    , server = require('./server/index.js')
    , models = server.models
    , routes = server.routes
    , cors  = require('cors')
    , flash  = require("connect-flash")
    , functions = server.functions
    , passport  = require('passport')
    , sequelize = models.sequelize
    , session  = require('express-session');

const PORT = 7000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(flash());




// set up app views handling
app.set('view engine', 'ejs');


app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
require('./passport.js')(passport, models.user);

//our own middleware to add current user to all the pages
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();  //very imp as it is a middleware it requires next operation
});

app.use('/',routes);

// load up app routes
app.get(['/', '/home', '/landing'], (req, res) =>{
    let orders = "nitin"
    res.render('home',{orders:orders});
    //res.json("landing page");
});


app.post('/register',passport.authenticate('local-signup', {
    successRedirect: '/landing',
    failureRedirect: '/user/login'
}));

app.post('/signin', passport.authenticate('local-signin', {
    successRedirect: '/landing',
    failureRedirect: '/user/login',
    failureFlash: true,
    successFlash: 'Welcome to Zipcar'
}),(req,res)=>{

});

app.get("/logout",(req,res) => {
    req.logout((err) => {
        if (err){
             return err;
        }
        req.flash("success","logged you out!!");
        res.redirect('/');
    });
});

app.get('/ticket',async (req,res) => {
   res.render('ticket');
});

app.post('/book',async (req,res)=> {
    var paymentId = req.body.razorpay_payment_id;
    console.log('hi', paymentId);

    setTimeout(function () {
        console.log('halo');
        res.render('ticket');
    }, 10)

    // var transaction = models.transaction;

    // var data1 = {
    //     userId:req.user.id,
    //     amount:1800,
    //     paymentId:paymentId,
    //     contact:req.user.contact,
    //     createdAt: new Date()
    // };
    //
    // transaction.create(data1).then(newTransaction=>{
    //     console.log(newTransaction);
    // });

});


app.listen(PORT, () => {
    console.log("zipcar clone server has started on http://localhost:"+PORT);
});

