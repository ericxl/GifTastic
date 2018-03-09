$(document).ready(function () {
    var topics = localStorage.topics ? JSON.parse(localStorage.topics) : [];
    var lastActiveButton;

    updateTopicButtons();

    String.prototype.capitalize = function () {
        return this.charAt(0).toUpperCase() + this.slice(1);
    }

    function updateTopicButtons(){
        $("#buttons").empty();

        topics.forEach(function(topic){
            var new_btn = $("<button class='btn-outline-info ml-2' value='" + topic + "'>" + topic + "</button>");

            new_btn.on("click", function (event) {
                if (lastActiveButton !== this) {
                    if (lastActiveButton) {
                        $(lastActiveButton).removeClass("active");
                    }
                    $(this).addClass("active");
                    lastActiveButton = this;
    
                    searchTopic(topic);
                    $(".gif-container").empty();
                }
    
            });
            $("#buttons").append(new_btn);
        });
    }

    function addTopic(topic) {
        topics.push(topic);
        localStorage.topics = JSON.stringify(topics);

        updateTopicButtons();
    }

    function deleteTopics(){
        topics = [];
        localStorage.topics = JSON.stringify(topics);
        $(".gif-container").empty();

        updateTopicButtons();
    }

    function searchTopic(topic){
        topic = topic.trim().replace(/\s+/g, '-').toLowerCase();
        console.log(topic);
        var xhr = $.get("http://api.giphy.com/v1/gifs/search?q=" + topic + "&api_key=Kt83OfPSBZmeY8xlTAJxqIWI8Lv0NQdc&limit=10");
        xhr.done(function (response) {
            if (response.data) {
                for (var i = 0; i < response.data.length; i++){
                    var e = response.data[i];

                    var rating = e.rating;
                    var stillSrc = e.images.fixed_width_still.url;
                    var gifSrc = e.images.fixed_width.url;
                    var card = $("<div class='card border-success'><div class='card-header'><p class='card-text'>Rating: " + rating + "</p></div></div>");
                    var img = $("<img class='card-body' alt='Card image cap'>");
                    img.data("still", stillSrc);
                    img.data("gif", gifSrc);
                    img.attr('src', img.data("still"));

                    img.on("click", function (event) {
                        if ($(this).attr('src') === $(this).data("gif")) {
                            $(this).attr('src', $(this).data("still"));
                        } else {
                            $(this).attr('src', $(this).data("gif"));
                        }
                    });
                    card.append(img);
                    $(".gif-container[data-index='" + i + "']").append(card);
                }
            }

        });
    }

    $("#topic-forms").on("submit", function (e) {
        e.preventDefault();
        let input_text = $("#topic-input").val().trim().capitalize();
        if (input_text && !topics.includes(input_text)) {
            addTopic(input_text);
        }
        $("#topic-input").val("");
    });

    $("#delete-topics").on("click", function (e) {
        e.preventDefault();
        
        deleteTopics();
    });

});