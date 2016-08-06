let fs = require('fs');
let express = require('express');
var bodyParser = require('body-parser');
let deploy = require('./deploy');

module.exports = function(config) {

    let app = express();

    // get list of sites
    let sites = fs.readdirSync('sites');

    let server = app
        .use(bodyParser.json())
        .listen(config.port.express, function () {
            console.log('express:'+config.port.express)
        });

    app.post('/github-deploy', (req,res) => {
        res.json({});
        deploy(req.body);
    })

    if (config.dev) {
        // just load one site @ localhost's hostname
        require(`../sites/${config.devSite}/site.js`)({
            app,
            config,
            express,
            site:config.devSite
        });
    }
    else {
        // load them all
        sites.forEach(site => {

            require(`../sites/${site}/site.js`)({app, config, express, site});

        });
    }

}
