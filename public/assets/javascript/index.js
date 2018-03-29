$(document).ready(function() {

    //on click functions for the scrape and save buttons on home page
    var articleContainer = $(".articleContainer");
    $(document).on("click", ".scrape-new", articleScrape);
    $(document).on("click", ".btn.save", articleSave);

    loadPage();
    //function to load the home page
    function loadPage() {
        articleContainer.empty();
        $.get("/api/headlines?saved = false")
        .then(function(data) {
            if (data && data.length) {
                showArticles(data);
            }
            else {
                showEmpty();
            }
        });
    }
    //function to show scraped articles
    function showArticles(articles) {
        var articlePanel = [];
        for (var i = 0; i < articles.length; i++) {
            articlePanel.push(createPanel(articles[i]));
        }
        articleContainer.append(articlePanel);
    }

    //function to create the panel to show the scraped articles
    function createPanel(article) {
        var panel = 
        $(["<div class = 'panel panel-default'>",
        "<div class = 'panel-heading'>",
        "<h3>",
        article.headline,
        "<a class = 'btn btn-success save'>",
        "Save Article",
        "</a>",
        "</h3>",
        "</div>",
        "<div class = 'panel-body'>",
        article.summary,
        "</div>",
        "</div>"
        ].join(""));
        panel.data("_id", article._id);
        return panel;
    }


    //function to show that there are currently no scraped articles
    function showEmpty() {
        var emptyMessage = 
        $(["<div class = 'empty-alert text-center'>",
        "<h3>Either scrape articles or look at saved articles.</h3>",
        "</div>"
    ].join(""));
    articleContainer.append(emptyMessage);
    }

    //function to save articles
    function articleSave() {
        var articleToSave = $(this).parents(".panel").data();
        articleToSave.saved = true;
        $.ajax({
            method: "PATCH",
            url: "/api/headlines",
            data: articleToSave
        })
        .then(function(data) {
            if (data.ok) {
                loadPage();
            }
        });
    }

    //function to scrape new articles
    function articleScrape() {
        $.get("/api/fetch")
        .then(function(data) {
            loadPage();
            bootbox.alert("<h3 class = 'text-center'>" + data.message + "</h3>");
        });
    }
});