function flipCard(idNum) {
    var question = document.getElementById("question-" + idNum);
    var answer = document.getElementById("answer-" + idNum);
    if (answer.hidden) {
        answer.hidden = false
        question.hidden = true
    } else if (question.hidden) {
        answer.hidden = true
        question.hidden = false
    }
}