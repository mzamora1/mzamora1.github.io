"use strict";
const navbar = getElement("nav");
const instructions = getElement("instructions");
const playing = getElement("playing");
const stats = getElement("stats");
const celebrate = getElement("celebrate");
const lose = getElement("lose");
const userInput = getElement("userInput");
const diffDropdown = getElement("difficulty");
const failSound = getElement("failSound");
const canvas = getElement("canvas");
const ctx = canvas.getContext("2d");
var mousePressed = false;
var userX, userY;
var circleArray;
var loseTimer, canvasTimer;
var game;


async function searchContent(title){ //returns a string from wiki
    let contentUrl = "https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=revisions&contentmodel=text&rvprop=content&rvparse&format=json&titles=";
    let response = await fetch(contentUrl + title); //wait for page to load
    let json = await response.json();
    let pageId = Object.keys(json["query"]["pages"])[0]
    let wikiText = String(json["query"]["pages"][pageId]["revisions"][0]["*"]); //wikiAPI returns html code for the page so we need to filter it out
    const insideArrow = /<(.*?)>/g //selects all characters inside < > (all the html tags)
    const pattern = /\W+\d+;/g //selects non letters followed by numbers followed by a ;
    const missingSpaces = /([a-z](?=[A-Z]|\d))|(\d(?=[A-Z]|[a-z]))|([A-Z](?=[A-Z]|\d))|(\.(?=\w))/g //selects lowercase letter that is followed by uppercase letter or digit...
    const insideParentheses = /\((.*?)\)/g
    const extraSpaces = /\s(?=[\s\.,])/g
    const lineBreaks = /\n|\r/g
    wikiText = wikiText.replace(insideArrow, "");
    wikiText = wikiText.replace(insideParentheses, "");
    wikiText = wikiText.replace(pattern, "");
    wikiText = wikiText.replace(lineBreaks, "");
    wikiText = wikiText.replace(missingSpaces, "$& ");//replace selected text with itself plus a space
    wikiText = wikiText.replace(extraSpaces, ""); 
    getElement("title").innerHTML = "Typing with "+ title.replace(/_/g, " ");
    return wikiText;
}
async function searchImages(title){ //returns an array with all images on wiki page
    let fileURLs = [];
    const imageUrl = "https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=images&format=json&titles="
    let response = await fetch(imageUrl + title);
    let json = await response.json();
    let pageId = Object.keys(json["query"]["pages"])[0];
    let images = json["query"]["pages"][pageId]["images"];
    const urlForFiles = `https://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&origin=*&iiprop=url&format=json&titles=`;
    images.forEach(async (image) => {
        let fileName = (image["title"]).replace(/\s/g, "_");
        if(!/(ogv$)|(ogg$)/g.test(fileName) && fileName != "File:Commons-logo.svg" && fileName != "File:Folder_Hexagonal_Icon.svg" && fileName != "File:Ambox_important.svg" && fileName != "File:OOjs_UI_icon_edit-ltr-progressive.svg" && fileName != "File:Semi-protection-shackle.svg" && fileName != "File:Wikiquote-logo.svg" && fileName != "File:A_coloured_voting_box.svg"){
            fileName = fileName.replace(/\&/g, "%26"); //replace & with _
            console.log(fileName);
            let response = await fetch(urlForFiles + fileName)
            let json = await response.json();
            let pageId = Object.keys(json["query"]["pages"])[0];
            let file = json["query"]["pages"][pageId]["imageinfo"][0]["url"];
            fileURLs.push(file);
        }
    });
    return fileURLs;
}

async function searchWiki(input){ //returns an object with a string for prompt and array for images
    const wiki = "https://en.wikipedia.org/w/api.php?action=opensearch&format=json&origin=*&search="; 
    let searchUrl = wiki + input.replace(/\s/g, "_"); //replace spaces with _
    let response = await fetch(searchUrl);
    let json = await response.json();
    if(json[1][1] != undefined){ //if valid search term
        let title = json[1][1].replace(/\s+/g, "_"); //select first page that results from the search
        let text = await searchContent(title);
        let files = await searchImages(title);
        return {text, files};
    }
}


class Game{ //represents the typing game
    constructor(text, src){ //optional parameters: when included game is using wikiText
        this.wordsTyped = 0;
        this.totalWordsTyped = 0;
        this.errors = 0;
        this.totalErrors = 0;
        this.startTime = 0;
        this.srcArray = src || [ //use src if its not undefined otherwise use this array for images
            "https://cdn.discordapp.com/attachments/766444116913291277/779104744110817330/gangsta_pirates.jpg",
            "https://cdn.discordapp.com/attachments/766444116913291277/779104793431113738/math_racist.jpg",
            "https://cdn.discordapp.com/attachments/766444116913291277/779104837161058314/talkin_pirates.jpg",
            "https://cdn.discordapp.com/attachments/766444116913291277/779104895302369310/pirates_fighting.jpg",
            "https://cdn.discordapp.com/attachments/766444116913291277/779104949765668901/thinkin_pirate.jpg"
        ];
        this.array =  toArray(text) || [ //stores all the prompt text
            "Gentlemen, stealing is very unbecoming of those of such noble birth as ourselves. ",
            "Surely it would be better to politely ask these fine Spaniards for a share of the booty, ",
            "perhaps in exchange for some of our booties. Come on lads, lets go make new friends. ",
            // //play sound here
            // //one pic per prompt
             "Brothers and bildgerats, crewmen all, thar be some mighty fine booty of all manners on that thar ship. ",
            "But we canne jus go up to a ship like that like eh buncha fightin cocks, not with a ship ",
            "with so many cannons on et. We ‘ave to do it all stealthy an sly-like, like a fox stealin ",
            "hens from a latrine. Wat we’re gonna do is a bodya picked men will go with me on ",
            "te tha ship, we’s gonna…snuggle the officers of the ship until they take a uh, a ",
            "long nappy-wappy, an then we’s gonna convince the resta the crew ta join us! ",
            "Can anybody here speak Spanish? "
        ];
        this.difficulty = calcDiff();
        this.stage = 0;
        this.text = this.array[this.stage];
        this.subLettersTyped = "";
        this.firstInput = true;
        userInput.value = "type here";
        this.wordCount = calculateWordCount(this.text);
        setVolume(getElement("volumeSlider").value/100);
        if(!text) this.update(); //can cause an error when using wikiText because it takes too long to load srcArray
        document.body.classList.remove("playing", "celebrate");
        document.body.classList.add("instructions");
        hide(playing, stats, celebrate, lose);
        show(instructions);
        getElement("mistakes").innerHTML = this.difficulty;
        clearInterval(loseTimer);
        clearInterval(canvasTimer);
    }
    update(){ //update elements related to the game
        getElement("prompt").innerHTML = `<span id='specialLetter'>${this.text.slice(0,1)}</span>${this.text.slice(1)}`; //put the first letter in a span to change its color with .css
        getElement("wordsTyped").innerHTML = this.totalWordsTyped;
        getElement("errors").innerHTML = this.totalErrors;
        getElement("errorBar").style.width = map(this.errors, 0, this.difficulty, 0, navbar.clientWidth)+"px";
        getElement("progressBar").style.width = map(this.wordsTyped, 0, this.wordCount, 0, navbar.clientWidth)+"px";
        getElement("gameImg").src = this.srcArray[this.stage] //if srcArray is exists then set the src else check again
        if(this.errors >= this.difficulty){
            hide(playing);
            show(lose);
            let degrees = 0;
            loseTimer = setInterval(() => {
                getElement("spinny").style.transform = `rotate(${degrees}deg)`;
                degrees--;
            }, 20); //rotate element every 20 milisceonds 
        }
    }

    checkInput(){ 
        if(this.firstInput){
            this.firstInput = false; 
            this.startTime = new Date();
        }  
        let lastInput = userInput.value[userInput.value.length - 1]; 
        let nextLetter = this.text[0];
        if(lastInput == nextLetter){//if user typed correct character, delete first character of current prompt 
            this.text = this.text.slice(1);
            this.subLettersTyped += lastInput;
            if(lastInput == " "){ //if space is pressed then a word has been typed correctly
                this.wordsTyped++;
                this.totalWordsTyped ++;
                this.subLettersTyped = "";
            }
            if(this.text.length == 0){ //you completed a prompt
                this.stage++;
                if(this.stage == this.array.length){ //you win (show stats screen)
                    updateStats();
                }else{ //continue with the next prompt
                    this.text = this.array[this.stage];
                    this.wordCount = calculateWordCount(this.text);
                    this.wordsTyped = 0;
                    this.errors = 0;
                }
            }
        }
        else { //if wrong input then reset progress bar, prompt, userInput and play the fail sound
            if(failSound.ended || failSound.currentTime == 0){
                this.errors++;
                this.totalErrors++;
                failSound.play();
            }
            this.text = this.subLettersTyped + this.text;
            this.subLettersTyped = "";
            userInput.value = "";
        }
        this.update();
    } //end of checkInput()
} // end of Game

class Circle { //represents a circle
    constructor(){
        this.circle = this;
        this.startingVelocity = (new Vector()).randomVector().normalize().mult(getElement("speedSlider").value/10);//random direction with speed of 3
        this.position = new Vector(canvas.width/2, canvas.height/2); //starting position is center of canvas
        this.velocity = this.startingVelocity //calculate random inital starting velocity
        this.size = getElement("sizeSlider").value/5;
        this.color = {
            r: 255,
            g: 255,
            b: 255,
        }
    }

    updatePosition(){ //calculate the new position after moving in the direction of the random vector
        this.position = this.position.add(this.velocity); //move the object by vector
        let positionX = this.position.x; 
        let positionY = this.position.y;
        if((positionX > canvas.width-10) || (positionX < 10)) {
            if(typeof this.velocity.x == "number"){ //edge cases can cause a type error in the next line because the velocity becomes NAN
                this.velocity.x *= -1;
            }
        }
        if((positionY > canvas.height-10) || (positionY < 10)) {
            if(typeof this.velocity.y == "number"){
                this.velocity.y *= -1;
            }
        }
    }

    draw(){
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.size/2, 0, 2*Math.PI);
        ctx.stroke();
        ctx.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        ctx.fill();
    }
} //end of Circle

class Vector { //handles all vector math
    constructor(x, y){
        this.x = x || 0;
        this.y = y || 0;
    }
    add(v){
        if (v instanceof Vector) return new Vector(this.x + v.x, this.y + v.y);
        else return new Vector(this.x + v, this.y + v);
    }
    mult(v){
        if (v instanceof Vector) return new Vector(this.x * v.x, this.y * v.y);
        else return new Vector(this.x * v, this.y * v);
    }
    divide(v){
        if (v instanceof Vector) return new Vector(this.x / v.x, this.y / v.y);
        else return new Vector(this.x / v, this.y / v);
    }
    dot(v){
        return this.x * v.x + this.y * v.y;
    }
    length(){
        return Math.sqrt(this.dot(this));
    }
    fromAngles(theta, phi){
        return new Vector(Math.cos(theta) * Math.cos(phi), Math.sin(phi));
    }
    randomVector(){
        return this.fromAngles(Math.random() * Math.PI * 2, Math.asin(Math.random() * 2 - 1));
    }
    normalize(){
        return this.divide(this.length());
    }
} //end of Vector



window.onresize = () => { //resize the canvas dynamically
    canvas.width = document.body.clientWidth; 
    canvas.height =  document.body.clientHeight + 70;
    getElement("resetCircles").style.top = canvas.height/2 +100 + "px";
    getElement("resetCircles").style.left = navbar.clientWidth/2 - 100+"px";
}
window.onload = () => {
    game = new Game();
    window.onresize();//set canvas size
}
window.onmousedown = function() { 
    mousePressed = true;
}
window.onmouseup = function() {
    mousePressed = false;
}

canvas.onmousemove = (event) => {
    userX = event.offsetX;
    userY = event.offsetY;
}

getElement("settingsLink").onclick = () => show(getElement("settings")); //open settings
for(let elt of Array.from(document.getElementsByClassName("close"))){  //hide settings and stats modal
    elt.onclick = () => hide(getElement("settings"), getElement("statsModal"));
}
for(let elt of Array.from(document.getElementsByClassName("statsBtn"))){ //show stats from storage
    elt.onclick = () => show(getElement("statsModal"));
    getElement("storageTime").innerHTML = localStorage.getItem("timeToComplete");
    getElement("storageWords").innerHTML = localStorage.getItem("wordsPerMin");
    getElement("storageDiff").innerHTML = localStorage.getItem("difficulty");
}

getElement("startBtn").onclick = () => { //show the game screen
    hide(instructions);
    show(playing);
    document.body.classList.remove("instructions");
    document.body.classList.add("playing"); //adds class 'playing' to the body to change background color 
    getElement("startSound").play();
}

getElement("celebrateBtn").onclick = () => { //show the celebration screen
    document.body.classList.remove("playing");
    document.body.classList.add("celebrate");
    hide(stats);
    show(celebrate);
    resetCircles(parseInt(getElement("circleInput").value));
    canvasTimer = setInterval(drawCanvas, 10);//drawCanvas every 10 milliseconds
}

for(let input of Array.from(document.querySelectorAll(".text-input"))){  
    input.onclick = function() {this.value = ""}
    input.onmouseover = function() {this.style.fontWeight = "bold"}
    input.onmouseout = function() {this.style.fontWeight = "normal"}
}

getElement("resetCircles").onclick = () => resetCircles(parseInt(getElement("circleInput").value));

getElement("endBtn").onclick = () => updateStats();

getElement("volumeSlider").onchange = function(){
    getElement("volume").innerHTML = this.value; //lable next to slider
    setVolume(this.value/100);
    failSound.play();
}

getElement("sizeSlider").onchange = function(){
    getElement("size").innerHTML = this.value; 
    circleArray.forEach((circle) => circle.size = Math.floor(this.value/5));
}

getElement("speedSlider").onchange = function(){
    getElement("speed").innerHTML = this.value;
    circleArray.forEach((circle) => circle.startingVelocity = circle.startingVelocity.normalize().mult(this.value/10));
}

getElement("circleInput").oninput = function(){ resetCircles(parseInt(this.value))}

for(let input of Array.from(document.getElementsByClassName("promptInput"))){ //all inputs that will search wiki
    input.onchange = async function() {
        document.body.classList.add("loading");
        let result = await searchWiki(this.value); //returns an object with text and files
        game = new Game(result.text, result.files);
        document.body.classList.remove("loading");
        hide(getElement("settings"));
        getElement("startBtn").onclick();
        getElement("endBtn").style.display = "inline-block";
        setTimeout(() => game.update(), 150); //must wait for result to be fully saved 
    }
}

for(let elt of Array.from(document.getElementsByClassName("reset"))){
    elt.onclick = () => game = new Game();
}

userInput.oninput = () => game.checkInput();

diffDropdown.onchange = function() {
    game = new Game();
}
function calcDiff(){ //seperate function so it can be called in the Game constructor
    switch(diffDropdown.value){
        case "easy":
            return 10;
        case "normal":
            return 5;
        case "extreme":
            return 2;
    }
}

function updateStats(){
    hide(playing);
    show(stats);
    let timeToComplete = parseFloat(((new Date() - game.startTime)/1000).toFixed(2));
    let wordsPerMin = Math.round(game.totalWordsTyped / (timeToComplete/60));
    getElement("timeToComplete").innerHTML = timeToComplete + " ";
    getElement("wordsPerMin").innerHTML = wordsPerMin;
    getElement("spanDiff").innerHTML = diffDropdown.value;
    storeStats(timeToComplete, wordsPerMin, diffDropdown.value);
}

function drawCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
    ctx.font = "50px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("You Rock!", canvas.width/2, canvas.height/2);
    for(let circle of circleArray){
        let mouseIsOverCircle = dist(userX, userY, circle.position.x, circle.position.y) < circle.size;
        circle.updatePosition(); //calculate the XY coordinates of each vector
        if(mouseIsOverCircle){ //then stop that circle and change color
            circle.velocity = 0;
            circle.color.r = Math.floor(Math.random()*256);
            circle.color.b = Math.floor(Math.random()*256);
            circle.color.g = Math.floor(Math.random()*256);
            if(mousePressed){
                circleArray = circleArray.filter(mover => mover != circle); //add every mover besides the one that was clicked to circleArray (remove the one that was clicked)
            }
        } 
        else circle.velocity = circle.startingVelocity;
        if(circle != undefined) circle.draw();
    }
}

function storeStats(time, words, diff){
    if(localStorage.getItem("timeToComplete") == null || parseInt(localStorage.getItem("timeToComplete")) > time){
        if(localStorage.getItem("timeToComplete") != null){
            show(getElement("previousTimeElt"));
        }
        getElement("previousTime").innerHTML = localStorage.getItem("timeToComplete");
        localStorage.setItem("timeToComplete", time);
        show(getElement("highScoreElt"));
    }

    if(localStorage.getItem("wordsPerMin") == null || parseInt(localStorage.getItem("wordsPerMin")) < words){
        if(localStorage.getItem("wordsPerMin") != null){
            show(getElement("previousWordsElt"));
        }
        getElement("previousWords").innerHTML = localStorage.getItem("wordsPerMin");
        localStorage.setItem("wordsPerMin", words);
        show(getElement("highScoreElt"));
    }

    if(localStorage.getItem("difficulty") == null || diff == "extreme" && localStorage.getItem("difficulty") != "extreme"){
        if(localStorage.getItem("difficulty") != null){
            show(getElement("previousDifficultyElt"));
        }
        getElement("previousDifficulty").innerHTML = "normal";
        localStorage.setItem("difficulty", diff);
        show(getElement("highScoreElt"));
    }
}

function toArray(string){ //splits a string into an multiple arrays containing only 10 words each
    let array;
    if(string){
        let words = 0;
        array = [];
        for(let i = 0; i < string.length; i++){
            if(string[i] == " ") words++;
            if(words == 10){
                array.push(string.substring(0, i));
                string = string.substring(i);
                words = 0;
            }
        }
    }
    return array;
}

function calculateWordCount(string){
    let words = 0;
    for(let letter of string){
        if(letter == " ") words++;
    }
    return string[string.length-1] == " " ? words : words+1; //if space is last character of prompt, then return words, else return words plus 1
}

function resetCircles(numOfCircles){
    circleArray = [];
    for(let i = 0; i < numOfCircles; i++){
        circleArray.push(new Circle());
    }
}

function map(value, a, b, c, d){
    value = (value - a) / (b - a); // first map value from (a..b) to (0..1)
    return c + value * (d - c); // then map it from (0..1) to (c..d) and return it
}

function dist(x1, y1, x2, y2){
    return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2);
}

function hide(...elements){
    elements.forEach((element) => element.style.display = "none");
}

function show(...elements){
    elements.forEach((element) => element.style.display = "block");
}

function getElement(id){
    return document.getElementById(id);
}

function setVolume(volume){
    let sounds = Array.from(document.querySelectorAll("audio"));
    sounds.forEach((sound) => sound.volume = volume);
}
