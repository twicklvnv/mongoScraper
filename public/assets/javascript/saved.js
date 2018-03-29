$(document).ready(function() {
    
    var articleContainer = $(".articleContainer");

    $(document).on("click", ".btn.delete", articleDelete);
    $(document).on("click", ".btn.notes", articleNotes);
    $(document).on("click", ".btn.save", noteSave);
    $(document).on("click", ".btn.note-delete", noteDelete);

    loadPage();

    //function to load the page and show saved articles if any 
    function loadPage() {
        articleContainer.empty();
        $.get("/api/headlines?saved = true").then(function(data) {
            if (data && data.length) {
                showArticles(data);
            }
            else {
                showEmpty();
            }
        });
    }

    //function to show  any saved articles from the db
    function showArticles(articles) {
        var articlePanels = [];
        for (var i = 0; i < articles.length; i++) {
            articlePanels.push(createPanel(articles[i]));
        }
        articleContainer.append(articlePanels);
    }

        //show saved articles in a panel
        function createPanel(article) {
            var panel = 
            $(["<div class = 'panel panel-default'>",
            "<div class = 'panel-heading'>",
            "<h3>",
            article.headline,
            "<a class = 'btn btn-danger delete'>",
            "Delete Article",
            "</a>",
            "<a class = 'btn btn-info notes'>Article Notes</a>",
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


        //function to show that there are no saved articles
        function showEmpty() {
            var emptyMessage = 
            $(["<div class = 'empty-alert text-center'>",
            "<h3>There are no saved articles.</h3>",
            "</div>"
        ].join(""));
        articleContainer.append(emptyMessage);
        };
    


    //function to display any notes for an article
    function showNotes(data) {
        var notesToShow = [];
        var currentNote;
        if (!data.notes.length) {
            currentNote = [
                "<li class = 'list-group-item'>",
                "No notes for this article",
                "</li>"
            ].join("");
            notesToShow.push(currentNote);
        }
        else {
            for (var i = 0; i < data.notes.length; i++) {
                currentNote = $([
                    "<li class = 'list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class = 'btn btn-danger note-delete'>Delete</button>",
                    "</li>"
                ].join(""));
                currentNote.children("button").data("_id", data.notes[i]._id);
                notesToShow.push(currentNote);
            }
        }
        $(".note-container").append(notesToShow);
    }

    //function to delete article from db
    function articleDelete() {
        var articleToDelete = $(this).parents(".panel").data();
        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }).then(function(data) {
            if (data.ok) {
                loadPage();
            }
        });
    }

    //function to create and save a note on an article to the db
    function articleNotes() {
        var currentArticle = $(this).parents(".panel").data();
        $.get("/api/notes/" + currentArticle._id).then(function(data) {
            var modalText = [
                "<div class = 'container-fluid text-center'>",
                "<h3>Article Notes",
                currentArticle._id,
                "</h3>",
                "<hr />",
                "<ul class = 'list-group note-container'>",
                "</ul>",
                "<textarea placeholder = 'new note' rows = '4' cols = '45'></textarea>",
                "<button class = 'btn btn-success save'>Save Note</button>",
                "</div>"
            ].join("");
            bootbox.dialog({
                message: modalText,
                closeButton: true
            });
            var noteData = {
                _id: currentArticle._id,
                notes: data || []
            };
            $(".btn.save").data("article", noteData);
            showNotes(noteData);

        });
    }

    //function to save the note
    function noteSave() {
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();
        if (newNote) {
            noteData = {
                _id: $(this).data("article")._id,
                noteText: newNote
            };
            console.log(noteData);
             $.post("/api/notes", noteData).then(function() {
                 bootbox.hideAll();
             });
           // $.ajax({
                //method: "POST",
                //url: "/api/notes",
                //data: noteData
           // }).then(function(data) {
             //   console.log(data);
           // });
        }
    }

    //function to delete notes
    function noteDelete() {
        var noteToDelete = $(this).data("_id");
        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function() {
            bottbox.hideAll();
        });
    }
})