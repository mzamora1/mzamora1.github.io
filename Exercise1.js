let trans = 1000;
let ins1,ins2;
let ins1IsPlaying = false;
let ins2IsPlaying = false;
let extraCanvas;
let button;
let compliments;

function preload(){
    ins1 = loadSound('assets/sounds/Click.mp3');
    ins2 = loadSound('assets/sounds/Twist.mp3');
}
function setup() {
    homeBtn = createButton("Home");
    homeBtn.mouseClicked(() => {
        window.open("home.html", "_self");
    });
    createCanvas(400, 400);
    button = createButton("Instruction");
    button.mouseClicked(() => {
        buttonhide();
        ins1.play();
    });
    
}
function draw() {
    drawBackground();
    let handleX = 123;
    let handleY = 198;
    let circleX = 180;
    let circleY = 206;

    if(mouseIsPressed && inTheRange() == true){ //if mouse pressed in bounds then rotate handle
        rotateHandle(handleX, handleY);
        rotateCircle(circleX, circleY);
        ins1.stop();
        if(ins2.isPlaying() == false && !ins2IsPlaying){
            ins2.play();
            ins2IsPlaying = true;
        }
    }else { //just draw rectangle
        fill(255,197,4,trans);
        rect(handleX,handleY,65,17);
        stroke(255,0,0,trans);
        strokeWeight(3.5);
        fill(0,0,0,0);
        circle(circleX,circleY,35);
        stroke('black');
        strokeWeight(0.5);
    }
}
function rotateHandle(posX, posY){
    let angle = Math.atan2(mouseY-posY, mouseX-posX);
    if(angle >= 1.3){
        console.log("handle turned");
        buttonhide();
        success();
    }
    translate(123,198);
    rotate(angle);
    fill(255,197,4,trans);
    rect(0,0,65,17);
}
function rotateCircle(posX, posY){
    let angle = Math.atan2(mouseY-posY, mouseX-posX);
    translate(57,8);
    rotate(angle);
    stroke(255,0,0,trans);
    strokeWeight(3.5);
    fill(0,0,0,0);
    circle(0,0,35);
    stroke(0,0,0,trans);
    strokeWeight(0.5);
}
function drawBackground(){
    stroke(0,0,0,trans);
    background(220);
    fill(202,164,114,trans);
    rect(100,0,200,400);
    fill(255,197,4,trans);
    rect(110,170,30,80,10);
    fill(192,192,192,trans);
    circle(125,205,30);
}
function success(){
    trans = 0;
    compliments = createElement('h2', 'Great Job!');
    compliments.position(123, 100);
    textSize(50);
}
function buttonhide(){
    button.hide();
}
function inTheRange(){
    if(mouseX>=123 && mouseX<=188 && mouseY>=198 && mouseY<=273){
        return true;
    }
    else{
        return false;
    }
}

//((mouseX-rangeX)^2 + (mouseY-rangeY)^2 <= 35)
