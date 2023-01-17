window.onload = function(){
    let donation = document.getElementById('donation');
    let color = 0;
    setInterval(function () {
        color = color + 1 % 360;
        donation.style.color = "hsl(" + color + ", 100%, 50%)"; // hsl(0, 100%, 50%)
    }, 5);
    let chooser = 1;
    let name = ''
    let i = 1;
    let elementsarray = [];
    while (i!==14) {
        elementsarray.push(document.getElementById(`${i}`));
      i++;
    }
    elementsarray.forEach(function(elem, index) {
        elem.addEventListener("click", function() {
            chooser = (index + 1);
            name = elem.innerText;
            document.getElementById('nameTest').innerText = `Выбранный тест : ${name}`
            elem.style.color = "#99FF66";
            setTimeout(function() {
                elem.style.color = "white";
            }, (500));

        });
    });

    class FileRead {
        constructor(result) {
            this.result = result;
        }
    }
    class Question {
        constructor(strings, answer, marker) {
            this.strings = strings;
            this.answer = answer;
            this.marker = marker;
        }
    }
    function shuffle(array) {
        array.reverse();
        let firststring = array.pop();
        let currentIndex = array.length,  randomIndex;


        // While there remain elements to shuffle.
        while (currentIndex != 0) {
            // Pick a remaining element.
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;

            // And swap it with the current element.
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        array.push(firststring);
        array.reverse();
        return array;
    }
    document.querySelector('button').addEventListener('click', function viewResult(){
        document.getElementById('blockQuestion').innerHTML = '';
        let file = document.getElementById(`${chooser}Test`).innerHTML;
        let reader = new FileRead(file);
            let marker = false;
            let counterQuestionsandAns = 0;
            let arrQuestions = [];
            let quest = '';
            let allquest = [];
            let counterallquest = 0;
            let answer = 0;
            let i = 0;
            while(i !== reader.result.length) {
                quest += reader.result[i];
                if (reader.result[i] === '@' || (reader.result[i] === '+' && reader.result[i+1] === '+' && reader.result[i+2] === '+')){
                    allquest[counterallquest] = quest.replace(/.$/,"");
                    allquest[counterallquest] = allquest[counterallquest].replace(/(\r\n|\n|\r)/gm, "");
                    allquest[counterallquest] = allquest[counterallquest].replace(/\s+/g,' ');
                    allquest[counterallquest] = allquest[counterallquest].trimEnd();

                    counterallquest++;
                    quest = '';
                }
                if (reader.result[i] === '+' && (reader.result[i+1] === '0' || reader.result[i+1] === '1') && (reader.result[i+2] === '0' || reader.result[i+2] === '1')){
                    while(reader.result[i] != 1){
                        i++;
                        answer++;
                    }
                    answer--;
                }

                if(reader.result[i] === '&') {
                    marker = true;
                }

                if (reader.result[i] == '*' && reader.result[i+1] == '1') {
                    arrQuestions[counterQuestionsandAns] = new Question(allquest,allquest[answer+1], marker);
                    counterQuestionsandAns++;
                    allquest = [];
                    counterallquest = 0;
                    answer = 0;
                    quest = "";
                    marker = false;
                }
                i++;
            }
            let random_start = 0; // От какого генерировать
            let random_end = arrQuestions.length-1; // До какого генерировать
            let arrayresult = [];

            let allCycles = document.getElementsByName('tentacles')[0].value-1;

            let arraynumbers = [];

            for(i=random_start;i<=random_end;i++){
                arraynumbers.push(i);
            }

            for(let countCycles = 0; countCycles<=allCycles; countCycles++){
                arrayresult.push(arraynumbers.splice(Math.random()*arraynumbers.length,1)[0]);
            }
            console.log(arrayresult);
            let arrWrongQuestions = [];
            let t = 0;
            let f = true;
            let result = 0;
            let allquestions = document.createElement('div');
            allquestions.innerText = `Общее число вопросов в файле ${arrQuestions.length}`
            document.getElementById('blockQuestion').appendChild(allquestions);
            let res = document.createElement('div');
            document.getElementById('blockQuestion').appendChild(res);
            res.innerText = `Итоговый результат:  ${result}/${arrayresult.length}  ${(result/arrayresult.length*100).toFixed(2)}%`;
            res.style.paddingTop = "10px";
            for (let i = 0; i < arrayresult.length; i++) {
                let question = document.createElement('div');
                if(arrQuestions[arrayresult[i]].marker !== true) {
                    shuffle(arrQuestions[arrayresult[i]].strings);
                }
                if(arrQuestions[arrayresult[i]].strings[0][0] == '1'){
                    question.innerText = i+1 + ".  " + arrQuestions[arrayresult[i]].strings[0].slice(4);
                } else {
                    question.innerText = i+1 + ".  " + arrQuestions[arrayresult[i]].strings[0];
                }
                question.style.paddingBottom = "5px";
                question.style.paddingTop = "5px";
                question.style.borderTop = "solid";
                document.getElementById('blockQuestion').appendChild(question);
                for (let j = 1; j< arrQuestions[arrayresult[i]].strings.length; j++) {
                    let answer = document.createElement('div');
                    answer.innerText = arrQuestions[arrayresult[i]].strings[j].slice(2);
                    answer.style.cursor = 'pointer';
                    answer.style.paddingLeft = '10px';
                    answer.style.marginBottom = '15px';
                    answer.style.marginTop = '15px';
                    answer.style.borderLeft = 'solid';
                    answer.addEventListener('click', function choose(){
                        if(answer.innerText.localeCompare(arrQuestions[arrayresult[i]].answer.slice(3)) === 0) {
                            answer.style.color = "#99FF66"
                            result++;
                            res.innerText = `Итоговый результат:  ${result}/${arrayresult.length}  ${(result/arrayresult.length*100).toFixed(2)}%`;
                            answer.removeEventListener('click', choose);
                        } else {
                            answer.style.color = "#FF0000"
                            arrWrongQuestions[t] = arrQuestions[arrayresult[i]];
                            t++;
                            rightanswer.innerText = "Правильный ответ: " + arrQuestions[arrayresult[i]].answer.slice(2);
                            f = !f;
                            answer.removeEventListener('click', choose);
                        }

                    })
                    document.getElementById('blockQuestion').appendChild(answer);

            }
                let rightanswer = document.createElement('div');
                rightanswer.innerText = "Правильный ответ";
                rightanswer.style.marginTop = "10px";
                rightanswer.style.marginBottom = "10px";
                document.getElementById('blockQuestion').appendChild(rightanswer);

            }
            let wrong = document.createElement('div');
            document.getElementById('blockQuestion').appendChild(wrong);
            wrong.innerText = `Вывести неправильные ответы`;
            wrong.style.cursor = 'pointer';
            wrong.style.borderTop = "solid";
            wrong.addEventListener('click', function (){
                for (let i = 0; i < arrWrongQuestions.length; i++){
                    if(arrWrongQuestions[i]?.strings[0] === arrWrongQuestions[i-1]?.strings[0]){
                        continue
                    }
                    let wrongquestion = document.createElement('div');
                    wrongquestion.innerText = arrWrongQuestions[i].strings[0].slice(4);
                    wrongquestion.style.paddingTop = "25px";
                    wrongquestion.style.paddingBottom = "5px";
                    document.getElementById('blockQuestion').appendChild(wrongquestion);
                    let wrongquestionanswer = document.createElement('div');
                    wrongquestionanswer.innerText = arrWrongQuestions[i].answer.slice(3);
                    document.getElementById('blockQuestion').appendChild(wrongquestionanswer);

                }
            })

    })
};