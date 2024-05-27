var result;
var score = 0;
var backgroundImageArray = [];

function nextQuestion() {
    const n1 = Math.floor(Math.random() * 5);
    const n2 = Math.floor(Math.random() * 6);
    document.getElementById("n1").innerHTML = n1;
    document.getElementById("n2").innerHTML = n2;
    result = n1 + n2;
    return result
};

function evaluateAnswer(answer, prediction) {
    if (answer === prediction) {
        score ++;
        if (score === 6) {
            alert("You Win!");
            backgroundImageArray = [];
            score = 0;
        } else {
            console.log("Right");
            link = "images/background" + score + ".svg";
            backgroundImageArray.push('url("'+ link +'")');
        }
        
    } else {
        if (score > 0) {
            score --;
        } else {
            score == 0;
        }
        console.log("Wrong");
        backgroundImageArray.pop()
    }
    document.body.style.backgroundImage = backgroundImageArray;
};

