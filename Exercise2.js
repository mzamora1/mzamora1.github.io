"use strict";
const navbar = document.getElementById("nav");
const instructions = document.getElementById("instructions");
const playing = document.getElementById("playing");
const stats = document.getElementById("stats");
const celebrate = document.getElementById("celebrate");
const lose = document.getElementById("lose");
const img = document.getElementById("gameImg");
const volumeSlider = document.getElementById("volumeSlider");
const sizeSlider = document.getElementById("sizeSlider");
const speedSlider = document.getElementById("speedSlider");
const diffDropdown = document.getElementById("difficulty");
const startSound = document.getElementById("startSound");
const failSound = document.getElementById("failSound");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
var mouseIsPressed = false;
var mouseX, mouseY;
var circleArray;

window.onresize = () => { //resize the canvas dynamically
    canvas.width = navbar.clientWidth; 
    canvas.height =  window.innerHeight- navbar.clientHeight-10;
}
canvas.onmousemove = (event) => {
    mouseX = event.offsetX;
    mouseY = event.offsetY;
}
canvas.onmousedown = function() { 
    mouseIsPressed = true;
}
canvas.onmouseup = function() {
    mouseIsPressed = false;
}

const game = {
    wordsTyped: 0,
    errors: 0,
    startTime: 0,
    srcArray: [
        "https://cdn.discordapp.com/attachments/766444116913291277/779104744110817330/gangsta_pirates.jpg",
        "https://cdn.discordapp.com/attachments/766444116913291277/779104793431113738/math_racist.jpg",
        "https://cdn.discordapp.com/attachments/766444116913291277/779104837161058314/talkin_pirates.jpg",
        "https://cdn.discordapp.com/attachments/766444116913291277/779104895302369310/pirates_fighting.jpg",
        "https://cdn.discordapp.com/attachments/766444116913291277/779104949765668901/thinkin_pirate.jpg"],
    array: [
        `Gentlemen, stealing is very unbecoming of those of such noble birth as ourselves. `+
        "Surely it would be better to politely ask these fine Spaniards for a share of the booty, "+
        "perhaps in exchange for some of our booties. Come on lads, lets go make new friends. ",
        //play sound here
        //one pic per prompt
        "Brothers and bildgerats, crewmen all, thar be some mighty fine booty of all manners on that thar ship. "+
        "But we canne jus go up to a ship like that like eh buncha fightin cocks, not with a ship "+
        "with so many cannons on et. We ‘ave to do it all stealthy an sly-like, like a fox stealin "+
        "hens from a latrine. Wat we’re gonna do is a bodya picked men will go with me on "+
        "te tha ship, we’s gonna…snuggle the officers of the ship until they take a uh, a "+
        "long nappy-wappy, an then we’s gonna convince the resta the crew ta join us! "+
        "Can anybody here speak Spanish? "
    ],
    text: "",
    subLettersTyped: "",
    firstInput: true,
    userInput: document.getElementById("userInput"),
    promptElement: document.getElementById("prompt"),
    wordCount: 0,
    volume: volume.value/10,
    difficulty: 0,
    calculateWordCount(){
        let words = 0;
        for(let letter of this.text){
            if(letter == " ") words++;
        }
        this.wordCount = this.text[this.text.length-1] == " " ? words : words + 1; //if space is last character of prompt, then return words, else return words plus 1
    },
    update(){
        this.promptElement.innerHTML = this.text.slice(0,1) == "<" ? this.text :`<span id = 'specialLetter'>${this.text.slice(0,1)}</span>${this.text.slice(1)}`; //put the first letter in a span to change its color with .css
        document.getElementById("wordsTyped").innerHTML = this.wordsTyped;
        document.getElementById("errors").innerHTML = this.errors;
        document.getElementById("errorBar").style.width = map(this.errors, 0, 5, 0, navbar.clientWidth)+"px";
        document.getElementById("progressBar").style.width = map(this.wordsTyped, 0, this.wordCount, 0, navbar.clientWidth)+"px";
        if(parseInt(document.getElementById("errorBar").style.width) >= navbar.clientWidth){
            hide(playing);
            show(lose);
            let degrees = 0;
            setInterval(() => {
                document.getElementById("spinny").style.transform = `rotate(${degrees}deg)`;
                degrees--;
            }, 20);
        }
    },
    reset(){
        this.text = this.array[this.difficulty];
        this.errors = 0;
        this.wordsTyped = 0;
        this.calculateWordCount();
        this.subLettersTyped = "";
        this.firstInput = true;
        this.userInput.value = "type here";
        this.update();
        document.body.classList.remove("playing");
        document.body.classList.remove("celebrate");
        document.body.classList.add("instructions");
        hide(playing, stats, celebrate, lose);
        show(instructions);
    }
}

function hide(...elements){
    for(let element of elements){
        element.style.display = "none";
    }
}
function show(...elements){
    for(let element of elements){
        element.style.display = "block";
    }
}

window.onload = () => { //basically the setup function in p5
    canvas.width = navbar.clientWidth; 
    canvas.height =  window.innerHeight- navbar.clientHeight-10;
    game.reset();
    document.body.classList.add("instructions");
}

document.getElementById("settingsLink").onclick = () => show(document.getElementById("settings"));
document.getElementsByClassName("close")[0].onclick = () => hide(document.getElementById("settings"));

document.getElementById("startBtn").onclick = () => {
    hide(instructions);
    show(playing);
    document.body.classList.remove("instructions");
    document.body.classList.add("playing"); //adds class 'playing' to the body to change background color 
    startSound.play();
    img.src = game.srcArray[0];

}

document.getElementById("celebrateBtn").onclick = () => {
    document.body.classList.remove("playing");
    document.body.classList.add("celebrate");
    hide(stats);
    show(celebrate);
    circleArray = [];
    for(let i = 0; i < 100; i++){
        circleArray.push(new Circle());
    }
    setInterval(drawCanvas, 10);//drawCanvas every 10 milliseconds
}


function drawCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
    ctx.font = "50px Comic Sans MS";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText("You Rock!", canvas.width/2, canvas.height/2);
    for(let circle of circleArray){
        circle.updatePosition(3); //calculate the XY coordinates of each vector
        let mouseIsOverCircle = dist(mouseX, mouseY, circle.position.x, circle.position.y) < circle.size;
        if(mouseIsOverCircle){ //then stop that circle and change color
            circle.velocity = 0;
            circle.color.r = Math.floor(Math.random()*256);
            circle.color.b = Math.floor(Math.random()*256);
            circle.color.g = Math.floor(Math.random()*256);
            if(mouseIsPressed){
                circleArray = circleArray.filter(mover => mover != circle); //add every mover besides the one that was clicked to circleArray (remove the one that was clicked)
            }
        } 
        else circle.velocity = circle.startingVelocity;
        if(circle != undefined) circle.draw();
    }
}

game.userInput.onclick = () => game.userInput.value = "";
game.userInput.onmouseover = () => game.userInput.style.fontWeight = "bold";
game.userInput.onmouseout = () => game.userInput.style.fontWeight = "normal";
game.userInput.oninput = () => {
    if(game.firstInput){
        game.firstInput = false; 
        game.startTime = new Date();
    }  
    let lastInput = game.userInput.value[game.userInput.value.length - 1]; 
    let nextLetter = game.text[0];
    console.log(nextLetter);
    if(lastInput == nextLetter){//if user typed correct character, delete first character of current prompt 
        game.text = game.text.slice(1);
        game.subLettersTyped += lastInput;
        if(lastInput == " "){ //if space is pressed then a word has been typed correctly
            game.wordsTyped++;
            game.subLettersTyped = "";
        }
        else if(game.text.length == 0){ //you win
            hide(playing);
            show(stats);
            document.getElementById("timeToComplete").innerHTML = ((new Date() - game.startTime)/1000).toFixed(2) + " ";
        }
    }
    else { //if wrong input then reset progress bar, prompt, userInput and play the fail sound
        if(failSound.ended || failSound.currentTime == 0){
            game.errors++;
            failSound.play();
        }
        game.text = game.subLettersTyped + game.text;
        game.subLettersTyped = "";
        game.userInput.value = "";
    }
    game.update();
}

volumeSlider.onchange = () =>{
    game.volume = volumeSlider.value/100;
    startSound.volume = game.volume;
    failSound.volume = game.volume;
    failSound.play();
    document.getElementById("volume").innerHTML = volumeSlider.value;
}

sizeSlider.onchange = () => {
    document.getElementById("size").innerHTML = sizeSlider.value;
    for(let circle of circleArray){
        circle.size = Math.floor(sizeSlider.value/5);
    }
}

speedSlider.onchange = () => {
    document.getElementById("speed").innerHTML = speedSlider.value;
    for(let circle of circleArray){
        circle.startingVelocity = circle.startingVelocity.normalize().mult(speedSlider.value/10);
    }
}

diffDropdown.onchange = () => {
    game.difficulty = (function(){
        switch(diffDropdown.value){
            case "easy":
                return 0;
            case "normal":
                return 1;
            case "extreme":
                return 2;
        }
    })();
    game.reset();
};

function map(value, a, b, c, d){
    value = (value - a) / (b - a); // first map value from (a..b) to (0..1)
    return c + value * (d - c); // then map it from (0..1) to (c..d) and return it
}

function dist(x1, y1, x2, y2){
    return Math.sqrt((x1 - x2)**2 + (y1 - y2)**2);
}

class Circle { //represents a circle
    constructor(){
        this.startingVelocity = (new Vector()).randomVector().normalize().mult(3);//random direction with speed of 3
        this.position = new Vector(canvas.width/2, canvas.height/2); //starting position is center of canvas
        this.velocity = this.startingVelocity //calculate random inital starting velocity
        this.size = 20;
        this.color = {
            r: 0,
            g: 0,
            b: 0,
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
}

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
}
