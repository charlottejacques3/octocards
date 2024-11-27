function revealAnswer() {
    answers = document.getElementsByClassName("answer");
    for (var i = 0; i < answers.length; i++) {
        answers.item(i).hidden = false;
    }
}