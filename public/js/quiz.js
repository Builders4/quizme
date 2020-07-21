console.log('goooooooooooooooooooood');
var listArr = JSON.parse(document.getElementById('allData').dataset.test);
var correctIdx;
(function () {
    var questions = [];
    let allDefinitions = listArr.map(val => val.definition);
    Question.prototype.choicesGenerator = function () {
        this.choices = randomChoices(allDefinitions, this.correctAnswer);
    }
    function Question(obj) {
        this.question = `What  is the definition of ${obj.word} ?`;
        this.choices;
        this.correctAnswer = obj.definition
        this.choicesGenerator();
        questions.push(this);
    }
    listArr.forEach((element,idx) => {
        correctIdx= idx;
        new Question(element)});
    console.log(questions);

    function randomChoices(allDefinitions, correctAnswer) {
        let randomIdxArr = [];
        let definitionsArr = [];

        for (let index = 0; index < (allDefinitions.length-1) && index < 4; index++) {
            let a= 4;
            while (true) {
                let tempIdx = getRandomInt(0, allDefinitions.length);
                if (!randomIdxArr.includes(tempIdx) && tempIdx != correctIdx) {
                    randomIdxArr.push(tempIdx);
                    definitionsArr.push(allDefinitions[tempIdx]);
                    break;
                }
            }
        }
        return definitionsArr;
    }
    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }
    // var questions = [{
    //     question: "What is 2*5?",
    //     choices: [2, 5, 10, 15, 20],
    //     correctAnswer: 2
    // }, {
    //     question: "What is 3*6?",
    //     choices: [3, 6, 9, 12, 18],
    //     correctAnswer: 4
    // }, {
    //     question: "What is 8*9?",
    //     choices: [72, 99, 108, 134, 156],
    //     correctAnswer: 0
    // }, {
    //     question: "What is 1*7?",
    //     choices: [4, 5, 6, 7, 8],
    //     correctAnswer: 3
    // }, {
    //     question: "What is 8*8?",
    //     choices: [20, 30, 40, 50, 64],
    //     correctAnswer: 4
    // }];

    var questionCounter = 0; //Tracks question number
    var selections = []; //Array containing user choices
    var quiz = $('#quiz'); //Quiz div object

    // Display initial question
    displayNext();

    // Click handler for the 'next' button
    $('#next').on('click', function (e) {
        e.preventDefault();

        // Suspend click listener during fade animation
        if (quiz.is(':animated')) {
            return false;
        }
        choose();

        // If no user selection, progress is stopped
        if (isNaN(selections[questionCounter])) {
            alert('Please make a selection!');
        } else {
            questionCounter++;
            displayNext();
        }
    });

    // Click handler for the 'prev' button
    $('#prev').on('click', function (e) {
        e.preventDefault();

        if (quiz.is(':animated')) {
            return false;
        }
        choose();
        questionCounter--;
        displayNext();
    });

    // Click handler for the 'Start Over' button
    $('#start').on('click', function (e) {
        e.preventDefault();

        if (quiz.is(':animated')) {
            return false;
        }
        questionCounter = 0;
        selections = [];
        displayNext();
        $('#start').hide();
    });

    // Animates buttons on hover
    $('.button').on('mouseenter', function () {
        $(this).addClass('active');
    });
    $('.button').on('mouseleave', function () {
        $(this).removeClass('active');
    });

    // Creates and returns the div that contains the questions and 
    // the answer selections
    function createQuestionElement(index) {
        var qElement = $('<div>', {
            id: 'question'
        });

        var header = $('<h2>Question ' + (index + 1) + ':</h2>');
        qElement.append(header);

        var question = $('<p>').append(questions[index].question);
        qElement.append(question);

        var radioButtons = createRadios(index);
        qElement.append(radioButtons);

        return qElement;
    }

    // Creates a list of the answer choices as radio inputs
    function createRadios(index) {
        var radioList = $('<ul>');
        var item;
        var input = '';
        for (var i = 0; i < questions[index].choices.length; i++) {
            item = $('<li>');
            input = '<input type="radio" name="answer" value=' + i + ' />';
            input += questions[index].choices[i];
            item.append(input);
            radioList.append(item);
        }
        return radioList;
    }

    // Reads the user selection and pushes the value to an array
    function choose() {
        selections[questionCounter] = +$('input[name="answer"]:checked').val();
    }

    // Displays next requested element
    function displayNext() {
        quiz.fadeOut(function () {
            $('#question').remove();

            if (questionCounter < questions.length) {
                var nextQuestion = createQuestionElement(questionCounter);
                quiz.append(nextQuestion).fadeIn();
                if (!(isNaN(selections[questionCounter]))) {
                    $('input[value=' + selections[questionCounter] + ']').prop('checked', true);
                }

                // Controls display of 'prev' button
                if (questionCounter === 1) {
                    $('#prev').show();
                } else if (questionCounter === 0) {

                    $('#prev').hide();
                    $('#next').show();
                }
            } else {
                var scoreElem = displayScore();
                quiz.append(scoreElem).fadeIn();
                $('#next').hide();
                $('#prev').hide();
                $('#start').show();
            }
        });
    }

    // Computes score and returns a paragraph element to be displayed
    function displayScore() {
        var score = $('<p>', { id: 'question' });

        var numCorrect = 0;
        for (var i = 0; i < selections.length; i++) {
            if (selections[i] === questions[i].correctAnswer) {
                numCorrect++;
            }
        }

        score.append('You got ' + numCorrect + ' questions out of ' +
            questions.length + ' right!!!');
        return score;
    }
})();