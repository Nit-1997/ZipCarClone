let express = require("express")
    , app = express()
    , config = require('config')
    , methodOverride = require("method-override")
    , bodyParser = require("body-parser")
    , server = require('./server/index.js')
    , models = server.models
    , routes = server.routes
    , functions = server.functions
    , sequelize = models.sequelize;

const PORT = 7000;


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(bodyParser.json({ limit: "50mb" }));

// set up app views handling
app.set('view engine', 'ejs');


// load up app routes
app.get(['/', '/home', '/landing'], (req, res) =>{
    //res.render('landing');
    res.json("landing page");
});


app.listen(PORT, () => {
    console.log("zipcar clone server has started on http://localhost:"+PORT);
});

