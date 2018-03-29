
var scrape = require("../scripts/scrape");

var headlinesController = require("../controllers/headline");

var notesController = require("../controllers/note");

module.exports = function(router) {
    //homepage route
    router.get("/", function(req, res) {
        res.render("home");
    });
    //saved article page route
    router.get("/saved", function(req, res) {
        res.render("saved");
    });

    //code to show the number of returned scraped articles
    router.get("/api/fetch", function(req, res) {
        headlinesController.fetch(function(err, docs) {
            if (!docs || docs.insertedCount === 0) {
                res.json({
                    message: "No new news to report."
                });
            }
            else {
                res.json({
                    message: "Added " + docs.insertedCount + " new articles today."
                });
            }
        });
    });

    //code to get articles saved in the db
    router.get("/api/headlines", function(req, res) {
        var query = {};
        if (req.query.saved) {
            query = req.query;
        }
        headlinesController.get(query, function(data) {
            res.json(data);
        });
    });

    //deleting articles
    router.delete("/api/headlines/:id", function(req, res) {
        var query = {};
        query._id = req.params.id;
        headlinesController.delete(query, function(err, data) {
            res.json(data);
        });
    });

    //updating articles
    router.patch("/api/headlines", function(req, res) {
        headlinesController.update(req.body, function(err, data) {
            res.json(data);
        });
    });

    //getting notes for article
    router.get("/api/notes/:headline_id?", function(req, res) {
        var query = {};
        if (req.params.headline_id) {
            query._id = req.params.headline_id;
        }
        notesController.get(query, function(err, data) {
            res.json(data);
        });
    });

    //deleting notes for an article
    router.delete("/api/notes/:id", function(req, res) {
        var query = {};
        query._id = req.params.id;
        notesController.delete(query, function(err, data) {
            res.json(data);
        });
    });

    //posting new notes for an article
    router.post("/api/notes", function(req, res) {
        notesController.save(req.body, function(data) {
            res.json(data);
        });
    });
}    