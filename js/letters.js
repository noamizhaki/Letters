/**
 * Created by User on 1/20/2016.
 */

var words = [];
var word = "";
var heart_amount = 0;
var word_array = [];
var word_left = [];
var hearts = [];
var current_score = 0;
var value_of_heart = 10;

$(document).ready(function () {
    $.get("/words", function (wordss) {
        words = wordss;
        $("#start_btn").click(function () {
            $("#game-start").toggleClass("shown");
            $("#game").toggleClass("shown");
            new_game();
        });
    }, "json");

    $('.box').hover(
        function () {
            $(this).css({"background-color": "red"});
        },

        function () {
            $(this).css({"background-color": ""});
        }
    );

        $("#play_again_btn").click(function () {
             $("#game-over .gamebox-header ol").empty();
            remove_old_stuff()
            $("#game-over").toggleClass("view");
            $("#game").toggleClass("shown");
            new_game();
        });
});

function create_hearts(num) {
    for (var i = 0; i < num; i++) {
        jQuery('<img>', {
            id: "heart" + i,
            class: "heart",
            src: './images/heart.png',
        }).appendTo('.hearts-holder');
        var heart = $("#heart" + i);
        hearts.push(heart);
    }
}

function create_score(heart_num) {
    if (current_score == 0) {
        current_score = heart_num * value_of_heart;
    }
    else {
        current_score += heart_num * value_of_heart;
    }
    $("#score").html(current_score);
}

function update_score_after_lost() {
    current_score = current_score - value_of_heart;
    $("#score").html(current_score);
}

function new_array_letters() {
    word_array = word.split('');
    word_left = word.split('');
}
function create_letters(word) {
    var my_array_word = word_array.slice(0);
    var letters_left = my_array_word.length - 1;
    for (letters_left; letters_left >= 0; letters_left--) {
        var ran_letter_index = Math.floor((Math.random() * letters_left));
        var letter = my_array_word[ran_letter_index];
        jQuery('<div/>', {
            data: {letter: letter},
            correct_index: word_array.indexOf(letter),
            class: 'letter shadowed letter_box',
            text: letter
        }).appendTo('.letters');
        my_array_word.splice(ran_letter_index, 1);
    }
}

function create_placeholders() {
    var amount = word_array.length - 1;
    for (var i = 0; i <= amount; i++) {
        jQuery('<div/>', {
            data: {letter: word_array[i]},
            class: 'letter placeholder box accept_drag',
        }).appendTo('.guess-holder');
    }
    $('.accept_drag').droppable({
        accept: ".letter_box",
        drop: function (event, ui) {
            if ($(this).data("letter") === ui.draggable.data("letter")) {
                ui.draggable.css('color', 'green');
                ui.draggable.draggable({revert: false});
                ui.draggable.draggable('disable');

                $(ui.draggable).css('position', 'absolute');
                $(ui.draggable).css('top', $(this).position().top);
                $(ui.draggable).css('left', $(this).position().left);
                var index = word_left.indexOf(ui.draggable.data("letter"));
                word_left.splice(index, 1);
                if (word_left.length == 0) {
                    setTimeout(new_game(), 1000);
                }
            }
            else {
                ui.draggable.css('color', 'red');
                ui.draggable.draggable({revert: true});
                setTimeout(function () {
                    ui.draggable.css('color', 'white');
                }, 1000);
                update_score_after_lost();
                remove_heart();
            }

        }
    });
}
function remove_heart() {
    if (hearts.length == 1) {
        hearts[hearts.length - 1].fadeOut("slow");
        setTimeout(game_over(), 2000);
    }
    else {
        hearts[0].fadeOut("slow");
        hearts.shift();
    }
}


function new_game() {
    remove_old_stuff();
    $(".main-title").removeClass("hidden");
    var word_num = Math.floor((Math.random() * words.length));
    word = words[word_num];
    new_array_letters();
    create_letters(word);
    create_placeholders();
    $('.letter_box').draggable({revert: 'invalid'});
    heart_amount = Math.ceil(word_array.length / 2);
    create_hearts(heart_amount);
    create_score(heart_amount)
}

function remove_old_stuff() {
    $(".letters").empty();
    $(".guess-holder").empty();
    $(".hearts-holder").empty();
    hearts = [];
    word_array = [];
    word_left = [];
    word = '';
    heart_amount = 0;
}

function game_over() {
    remove_old_stuff();
    $.post("/game_over", {score: current_score},function(data){
        console.log(data);
        $(".main-title").toggleClass("hidden");
        //$(".gamebox-header").addClass("hidden");
        $(".user-score").html(current_score);
        current_score = 0;
        var scoreList = $("#game-over .gamebox-header ol");
        for (var i = 0; i < data.length; i++) {
            if (data[i] == current_score){
                var score = $('<li/>', { text: data[i], class: "user-place"});
                scoreList.append(score);
            }
            else {
                var score = $('<li/>', {text: data[i]});
                scoreList.append(score);
            }
        }
        $("#game").toggleClass("view");
        $("#game-over").toggleClass("view");
    },"json");
}


