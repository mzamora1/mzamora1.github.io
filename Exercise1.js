let trans = 1000;
let ins1,ins2,img,vid;
let ins1IsPlaying = false;
let ins2IsPlaying = false;
let extraCanvas;
let button;
let compliments;
let inAnyBoundary = false;
let visitedboundaries = [];
let boundaryPoints = [];
 
function preload(){
    ins1 = loadSound('assets/sounds/Click.mp3');
    ins2 = loadSound('assets/sounds/Twist.mp3');
    img = loadImage('assets/pics/House.png');
}
function setup() {
    homeBtn = createButton("Home");
    homeBtn.mouseClicked(() => {
        window.open("home.html", "_self");
    });
    createCanvas((windowWidth-15), (windowHeight-80));
    button = createButton("Instruction");
    button.mouseClicked(() => {
        buttonhide();
        ins1.play();
    });
    vid = createVideo(['assets/animations/Open.mp4']);
    vid.position(0,0);
    vid.size((windowWidth-15), (windowHeight-80));
    vid.hide();
    boundaryPoints.push({x: (width-15)/2-72, y: (height-20)/2+81})
    boundaryPoints.push({x: (width-15)/2-56, y: (height-20)/2+77})
    boundaryPoints.push({x: (width-15)/2-42, y: (height-20)/2+72})
    boundaryPoints.push({x: (width-15)/2-32, y: (height-20)/2+64})
    boundaryPoints.push({x: (width-15)/2-25, y: (height-20)/2+51})
    boundaryPoints.push({x: (width-15)/2-18, y: (height-20)/2+37})
}
function draw() {
    drawBackground();
    let handleX = (width-15)/2 - 77;
    let handleY = (height-20)/2 + 28;
    let circleX = (width-15)/2 - 20;
    let circleY = (height-20)/2 + 36;
    let clickRange = dist(mouseX, mouseY, circleX, circleY) < 15;
 
    if(mouseIsPressed && checkAllBoundaries(10)){ //if mouse pressed in bounds then rotate handle
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
function checkAllBoundaries(size){
    for(let i = 0; i < boundaryPoints.length; i++){
        let boundary = {
          left: boundaryPoints[i].x - size,
          right: boundaryPoints[i].x + size,
          top: boundaryPoints[i].y - size,
          bottom: boundaryPoints[i].y + size
        }
        //rect(boundary.left, boundary.top, size*2); //for testing purposes
        if(mouseX > boundary.left && mouseX < boundary.right && mouseY > boundary.top && mouseY < boundary.bottom){
            inAnyBoundary = true;
            console.log(inAnyBoundary);
		return true;
            if (!visitedboundaries.includes(boundaryPoints[i])){
                visitedboundaries.push(boundaryPoints[i]);
                console.log("In Bounds");
            }
            if (visitedboundaries.length >= boundaryPoints.length){ 
                visitedboundaries = [];
            }
            if(!inAnyBoundary){ 
                    clear();
			return false;
            }    
        }
        }    
  }
function rotateHandle(posX, posY){
    let angle = Math.atan2(mouseY-posY, mouseX-posX);
    if(angle >= 1.3){
        trans = 0;
        vid.show();
        vid.loop();
        vid.volume(0);
        console.log("handle turned");
        buttonhide();
        success();
    }
    translate((width-15)/2-77,(height-20)/2+28);
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
    background(222,184,135);
    image(img,-75,-390);
    fill(255,197,4,trans);
    rect((width-15)/2-90,(height-20)/2,30,80,10);
    fill(192,192,192,trans);
    circle((width-15)/2-75,(height-20)/2+35,30);
}
function success(){
    compliments = createElement('h2', 'Great Job!');
    compliments.position((width-15)/2-100, (height-20)/2);
    compliments.style("color: white");
    compliments.style("font-size: 50px");
}
function buttonhide(){
    button.hide();
}

