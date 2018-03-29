var request = require("request");
var cheerio = require("cheerio");

var scrape = function(cb) {
    request("http://www.nytimes.com", function(err, res, body) {
        var $ = cheerio.load(body);

        var articles = [];

        $(".theme-summary").each(function(i, element) {
            var head = $(this).children(".story-heading").text().trim();
            var sum = $(this).children(".summary").text().trim();
            var data = {
                headline: head,
                summary: sum
            };
            articles.push(data);
        });
        cb(articles);
    });
};

module.exports = scrape;