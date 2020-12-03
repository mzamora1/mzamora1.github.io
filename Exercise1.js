let trans = 1000;
let ins1,ins2,img,bg2,vh,vid,vid2,fail;
let ins1IsPlaying = false;
let ins2IsPlaying = false;
let vaultHandleX, vaultHandleY;
let extraCanvas;
let button;
let compliments;
let inAnyBoundary = false;
let visitedboundaries = [];
let boundaryPoints = [];
let door1, door2;
let currentDoor = 0;


class Point{
    constructor(x, y){
        this.x = x || 0;
        this.y = y || 0;
    }
}
function map(value, a, b, c, d){
    value = (value - a) / (b - a); // first map value from (a..b) to (0..1)
    return c + value * (d - c); // then map it from (0..1) to (c..d) and return it
}
function preload(){
    ins1 = loadSound('assets/sounds/Click.mp3');
    ins2 = loadSound('assets/sounds/Twist.mp3');
    img = loadImage('assets/pics/House.png');
    bg2 = loadImage('assets/pics/bg2.png');
    fail = loadSound("assets/sounds/sweet_nothings.mp3");
}
function setup() {
    createCanvas((windowWidth-15), (windowHeight-80));
    button = createButton("Instruction");
    button.size(100, 30);
    button.position(width/2 - button.size().width/2, height/2+150);
    button.mouseClicked(() => {
        buttonhide();
        ins1.play();
    });
    door1 = [
        new Point((width-15)/2-72, (height-20)/2+81), 
        new Point((width-15)/2-56, (height-20)/2+77), 
        new Point((width-15)/2-42, (height-20)/2+72),
        new Point((width-15)/2-32, (height-20)/2+64),
        new Point((width-15)/2-25, (height-20)/2+51),
        new Point((width-15)/2-18, (height-20)/2+37),
    ];
    door2 = [
        new Point(698, 286), 
        new Point(698, 298), 
        new Point(694, 305), 
        new Point(690, 314), 
        new Point(686, 323), 
        new Point(676, 333), 
        new Point(667, 342), 
        new Point(657, 345), 
        new Point(642, 348), 
        new Point(625, 346), 
        new Point(612, 338), 
        new Point(602, 331), 
        new Point(594, 322), 
        new Point(588, 310), 
        new Point(583, 298), 
        new Point(581, 285), 
        new Point(580, 272), 
        new Point(586, 261), 
        new Point(592, 250), 
        new Point(600, 240), 
        new Point(610, 232), 
        new Point(626, 226), 
        new Point(646, 227), 
        new Point(656, 228), 
        new Point(666, 232), 
        new Point(676, 240), 
        new Point(682, 245), 
        new Point(688, 251), 
        new Point(693, 260), 
        new Point(700, 274), 
        //new Point(700, 285), 
    ];
    vid = createVideo(['assets/pics/Open.mp4']);
    vid.position(0,0);
    vid.size((windowWidth-15), (windowHeight-80));
    vid.hide();
    vid.mouseClicked(()=>{
        vid.hide();
        compliments.hide();
    });
    vid2 = createVideo(['assets/pics/vaultdoor.mp4']);
    vid2.position(0,0);
    vid2.size((windowWidth-15), (windowHeight-80));
    vid2.hide();
    vid2.mouseClicked(()=>{
        vid2.hide();
    });
    boundaryPoints.push(door1, door2);
    console.log(boundaryPoints[0][0])
}
function isInBounds(size){
    for(let i = 0; i < boundaryPoints[currentDoor].length; i++){ 
        let boundary = { //could change to circles but squares will make the boundaries overlap more
          left: boundaryPoints[currentDoor][i].x - size,
          right: boundaryPoints[currentDoor][i].x + size,
          top: boundaryPoints[currentDoor][i].y - size,
          bottom: boundaryPoints[currentDoor][i].y + size
        }
        //rect(boundary.left, boundary.top, size*2); //for testing purposes
        if(mouseX > boundary.left && mouseX < boundary.right && mouseY > boundary.top && mouseY < boundary.bottom){
            if (!visitedboundaries.includes(boundaryPoints[currentDoor][i])){
                visitedboundaries.push(boundaryPoints[currentDoor][i]);
                console.log("In Bounds");
            }
            return true;
        }
    }
    visitedBoundaries = [];
    if(!fail.isPlaying()){
        fail.play();   
    }
    return false;
}
function draw() {
    drawBackground(currentDoor);
    let handleX = (width-15)/2 - 77;
    let handleY = (height-20)/2 + 28;
    let circleX = (width-15)/2 - 20;
    let circleY = (height-20)/2 + 36;
    vaultHandleX = (width-15)/2+15; //(width-15)/2+75;
    vaultHandleY = (height-20)/2+49;
 
    if(mouseIsPressed && isInBounds(10)){ //if mouse pressed in bounds then rotate handle
        if(currentDoor == 0){
            rotateHandle(handleX, handleY);
            rotateCircle(circleX, circleY);
            if(visitedboundaries.length == boundaryPoints[currentDoor].length){
                mouseIsPressed = false;
                trans = 0;
                vid.show();
                vid.loop();
                vid.volume(0);
                console.log("handle was actually turned");
                currentDoor++;
                visitedboundaries = [];
                buttonhide();
                success();
            }
        }
        if(currentDoor == 1){
            rotateVaultHandle(vaultHandleX, vaultHandleY);
            if(visitedboundaries.length == boundaryPoints[currentDoor].length){
                vid2.show();
                vid2.loop();
                vid2.volume(0);
                console.log("handle was actually turned");
                currentDoor++;
                visitedboundaries = [];
            }
        }
        ins1.stop();
        if(ins2.isPlaying() == false && !ins2IsPlaying){
            ins2.play();
            ins2IsPlaying = true;
        }
    }else if(currentDoor == 0){ //just draw rectangle
        fill(255,197,4,trans);
        rect(handleX,handleY,65,17);
        stroke(255,0,0,trans);
        strokeWeight(3.5);
        fill(0,0,0,0);
        circle(circleX,circleY,35);
        stroke('black');
        strokeWeight(0.5);
    }
    else if(currentDoor == 1){
        noStroke();
        fill('red');
        circle((width-15)/2+75,(height-20)/2+49,15);
        console.log(currentDoor);
    }

}
function rotateHandle(posX, posY){
    let angle = Math.atan2(mouseY-posY, mouseX-posX);
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
function rotateVaultHandle(posX, posY){
    let angle = Math.atan2(mouseY-posY, mouseX-posX);
    //rect(mouseX-posX, mouseY-posY, 20, 20);
    translate((width-15)/2+15,(height-20)/2+49);
    rotate(angle);
    noStroke();
    fill('red');
    circle(60,0,15);
}
function drawBackground(door){
    switch(door){
        case 0:
            stroke(0,0,0,trans);
            background(222,184,135);
            image(img,-75,-390);
            fill(255,197,4,trans);
            rect((width-15)/2-90,(height-20)/2,30,80,10);
            fill(192,192,192,trans);
            circle((width-15)/2-75,(height-20)/2+35,30);
            break;
        case 1:
            image(bg2, 0, 0, windowWidth, windowHeight);
            stroke('grey');
            strokeWeight(15);
            fill(0,0,0,0);
            circle((width-15)/2+15,(height-20)/2+49, 120);
            break;
    }
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
let result = "";
function mouseClicked(){
    result += `new Point(${mouseX}, ${mouseY}), \n`
}
function doubleClicked(){
    result = "";
}
function mouseWheel(){
    console.log(result);
}
