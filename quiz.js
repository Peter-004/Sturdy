/**
 *@author: Opemipo Adebayo Peter
 * At least, this works for rutgers canvas, You can test it with your school's Canvas and add it to the list below to verify the code's
 * universal applicability
 * Rutgers,
 */

function saveTextFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
 //Future version can get course title from local/session storage, also, tackle input answers in future(maths, econs, finance quizzes)
console.log("Sturdy launch was successful.");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "trigger-action") {
    
    let quest = [];
    let ans = [];
    let txt = document.querySelectorAll(".text");
    let iframe = document.getElementById('preview_frame');//getting iframe tag doesn't work, there's also CORS policy
    let hiddenAns, quizTitle;
    if(!iframe){//We know that there's no iframe to display quiz summary, unless canvas starts advertising...
        hiddenAns = document.querySelector(".alert")?.innerText.match(/\b(Correct answers are hidden|be available)\b/gi);//ans are hidden
        quizTitle = document.getElementById("quiz_title").innerText || "quizsolution";
    }
    if(txt.length === 0){//if txt is null, user is in submission records, check for iframes
        console.log("checking for iframe...");
        if (iframe) {
            console.log("found iframe for quiz submission instead");
            let iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
            txt = iframeDocument.querySelectorAll('.text');//change hidden,title from undefined to iframe's DOM
            hiddenAns = iframeDocument.querySelector(".alert")?.innerText.match(/\b(Correct answers are hidden|be available)\b/gi);
            quizTitle = iframeDocument.getElementById("quiz_title").innerText || "quizsolution";
        }    
    }
    if(hiddenAns)alert("Correct answers have been hidden by your teacher and are protected by the server");//Now we're sure of hidden ans
    txt.forEach(t =>{
        quest.push(t.querySelector(".question_text").innerText);
        let corrAns = hiddenAns ? t.querySelectorAll('.selected_answer') : t.querySelectorAll('.correct_answer');
        let correct = [];
        corrAns.forEach(el =>{
            let ans = el.innerText.replace(/\bCorrect Answer\b/g, "").replace(/Correct!\s*/, "");
            correct.push(ans);
        })
        ans.push(correct);
    })
    console.log("questions: ",quest);console.log("answers: ",ans);
    let content = `!!Correct answers are displayed by default. If you saw an hidden answer alert before downloading, then 
    the answers below are your selected answers. \n ${quizTitle}`;
    if(quest.length == ans.length){//quest will always equal ans length...redundant
        for(var i = 0;i<quest.length;i++){
            content += `\n${i+1}. ${quest[i]} \n **Answer:: ${ans[i]}**`;
        }
        saveTextFile(`${quizTitle} Quiz.txt`,content);
        alert("The file has been downloaded");//Delete later...
    }
    else{
        alert("Inconsistent number of questions and answers");
    } 
    }
});
