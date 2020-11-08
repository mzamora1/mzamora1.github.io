let nukeAnimation, spinnyAnimation, eatingAnimation, growlingAnimation, attackAnimation, bg; //pictures and animations
let div, canvas, userInput, homeBtn, startBtn, celebrateBtn; //GUI variables
let startSound, failSound, twoPac; //sound variables
let currentPrompt, errors=0, wordsTyped=0, wordCount, gameState, timeToComplete, startTime; //game variables
let promptList = ["Once upon a time ", "there was a pirate ", "named dp jack ", "he turned into a bomb ", "and now hes dead " ]; //array storing all prompts
let circleMovers = []; //array that will store circleMovers 
let funFactor = 50; //how much fun you wanna have? too much fun can crash the game
let storyAnimations = [];

class circleMover{ //makes moving objects easier by handling all vector math
  constructor(){
    this.startingVelocity = p5.Vector.random2D();
    this.startingVelocity.mult(3);
    this.position = createVector(width/2, height/2); //starting position is center of canvas
    this.velocity = this.startingVelocity //calculate random inital starting velocity
    this.size = 20;
    this.color = {
      r: 0,
      g: 0,
      b: 0
    }
  }
  updatePosition(){ //calculate the new position after moving in the direction of the random vector
    this.position.add(this.velocity); //move the object by vector
    let positionX = this.position.x;
    let positionY = this.position.y;
    if ((positionX > width-10) || (positionX< 10)) {
      this.velocity.x = this.velocity.x * -1;
    }
    if ((positionY > height-10) || (positionY < 10)) {
      this.velocity.y = this.velocity.y * -1;
    }
  }
}

function calculateWordCount(prompts){ //calculates the total number of words in the whole prompt
  let words = 0;
  for(let i = 0; i < prompts.length; i++){
    for(let j = 0; j < prompts[i].length; j++){
      if(prompts[i].substring(j,j+1) == " ") words++;
    }
  }
  return words;
}

let subWordsTyped = 0;
let firstInput = true;
let index = 0;
function checkInput(){ //compares last key pressed by user to the next character of the prompt
  if(firstInput){
    firstInput = false; 
    startTime = millis();
  }  
  let lastInput = this.value()[this.value().length - 1]; 
  let nextLetter = currentPrompt[0];
  if(lastInput == nextLetter){//if user typed correct character, delete first character of current prompt 
    currentPrompt = currentPrompt.substring(1);
    if(keyIsDown(32)){ //if space is pressed then a word has been typed correctly
      wordsTyped++;
      subWordsTyped++;
    }
    if(currentPrompt.length == 0){ //if sentence is typed correctly then clear input field and go to next sentence
      index++;
      currentPrompt = promptList[index];
      if(promptList.length-1 == index){ //if all sentences have been completed, stop the animation to save resources for the many many balls to come
        nukeAnimation.stop();
      }
      subWordsTyped=0;
      userInput.value("");
    }
  }

  else{ //if wrong input then reset progress bar, prompt, userInput and play the fail sound
    if(!failSound.isPlaying()){
      failSound.play();
      errors++;
      wordsTyped= wordsTyped - subWordsTyped;
      subWordsTyped = 0;
    }
      userInput.value("");
      currentPrompt = promptList[index];
  }
}

function preload(){
  nukeAnimation = loadAnimation('assets/nukeAnimation/001.png', 'assets/nukeAnimation/167.png');
  spinnyAnimation = loadAnimation('assets/spinnyAnimation/00.png', 'assets/spinnyAnimation/12.png');
  growlingAnimation = loadAnimation('assets/growlingAnimation/01.png', 'assets/growlingAnimation/13.png');
  eatingAnimation = loadAnimation('assets/eatingAnimation/01.png', 'assets/eatingAnimation/22.png');
  attackAnimation = loadAnimation('assets/attackAnimation/001.png', 'assets/attackAnimation/143.png');
  startSound = loadSound("assets/sounds/flying-dutchman.mp3");
  failSound = loadSound("assets/sounds/scallywags.mp3");
  twoPac = loadSound("assets/sounds/2Pac.mp3");
  bg = loadImage("assets/pics/background.jpg");
  pinkDutch = loadImage("assets/pics/Flying dutchman wearing pink dress.png");
}

function setup() {
  frameRate(60); textSize(20); textAlign(CENTER,TOP);
  div = createDiv();
  canvas = createCanvas(window.outerWidth-15, window.outerHeight-122);
  wordCount = calculateWordCount(promptList);
  userInput = createInput('type here');
  userInput.size(200, 30);
  userInput.style("font-size", "25px");
  userInput.mouseClicked(() => { //clear input field when clicked
    userInput.value("");
  });

  userInput.mouseOver(() => { //bold text in the input field when mouse hovers over it
    userInput.style("font-weight: bold");
  });

  userInput.mouseOut(() => { //remove bold text when mouse is no longer over the input field
    userInput.style("font-weight: normal");
  });
  
  startBtn = createButton("Start Game");
  startBtn.mouseClicked(() => { //start the game and hide the button
    gameState = "playing";
    startBtn.hide();
    userInput.value("");
    userInput.input(checkInput); //everytime input is detected, checkInput() is called
    startSound.play(); //tis i, the flying dutchman
  });

  celebrateBtn = createButton("Click to celebrate!"); //will appear after progress bar has been filled
  celebrateBtn.hide();
  celebrateBtn.mouseClicked(() => {
    celebrateBtn.hide();
    gameState = "celebrate";
  });

  homeBtn = createButton("Home");
  homeBtn.mouseClicked(() => {
    window.open("home.html", "_self");
  });
  homeBtn.position(50, height-50)

  div
    .child(canvas)
    .child(userInput)
    .child(startBtn)
    .child(celebrateBtn)
    .child(homeBtn)
    .style("position", "relative")
    //.style("width", "fit-content");
  currentPrompt = promptList[0];

  for(var i = 0; i < funFactor; i++){ //fills array circleMovers with circleMovers to be used for moving objects
    circleMovers.push(new circleMover());
  }
  growlingAnimation.frameDelay = 3;
  storyAnimations.push(eatingAnimation, growlingAnimation, attackAnimation);
  twoPac.setVolume(0.2);
  twoPac.play();
  twoPac.jump(17);
} 



let pic =0;
let timeStarted = 0;
let timings = [1,1,1,1,1];
//let timings = [5,5,10,10,10];
let firstTime=true;
function draw() {
  clear();
  switch(gameState){
    default:
      startBtn.hide();
      userInput.hide();
      if(pic==0){
        image(pinkDutch,(width/2)-200,0,400,350);
      }
      else if(pic-1 < storyAnimations.length){
        storyAnimations[pic-1].draw(width/2,150);
      }
      else{
        twoPac.stop();
        gameState="instructions";
      }
      if((millis()-timeStarted) > (timings[pic]*1000)){
        pic++;
        timeStarted = millis();
      }
      break;

    case "instructions":
    //code for instruction screen
      strokeWeight(10); stroke(0); fill(255);
      background(255);
      startBtn.show();
      startBtn.position((width/2)-50,(height/2)+80);
      userInput.show();
      userInput.position((width/2)-100, height-50);
      noStroke(); fill(0); textSize(50);
      text("Instructions",width/2,(height/2)-220);
      textSize(30);
      text("Type the words that show up on screen.\n"+
           "Press space whenever the prompt is blank\n"+
           "Find out if you are a true homie.",width/2,(height/2)-80);
      break;

    case "playing":
    //code for playing game
      background(33, 96, 212);
      nukeAnimation.draw(width/2,(height/2)-80);
      fill(150,150,150);
      rect((width/2)-200,(height/2)+60,400,50);
      fill(0); textSize(40);
      text(currentPrompt, (width/2),(height/2)+70);
      fill(103, 168, 97); textSize(50);
      text("Typing with Dead Pirate Jack",(width/2),(height/2)-260);
      fill(103, 168, 97); textSize(30);
      text("Words Typed: "+wordsTyped,(width/2)-180,(height/2)+130);
      fill(230, 79, 76);
      text("Errors: "+errors,(width/2)+180,(height/2)+130);
      let badX = map(errors, 0, 5, 0, width); 
      let goodX = map(wordsTyped, 0, wordCount, 0, width); 
      stroke(230, 79, 76); strokeWeight(25); 
      line(0,(height/2)+180,badX,(height/2)+180); //error bar
      stroke(103, 168, 97);
      line(0,(height/2)+210,goodX,(height/2)+210); //progress bar
      if(goodX >= width){ //if progress bar is full then get ready to celebrate 
        celebrateBtn.show();
        celebrateBtn.position((width/2)-50, (height/2)-100);
        userInput.hide();
        background(bg);
        if(firstTime){
          firstTime = false;
          timeToComplete = (millis()-startTime)/1000;
        }
        fill(255); noStroke();
        text("You completed all prompts in "+ timeToComplete.toFixed(2) + " seconds", width/2,(height/2));
      }
      if(badX >= width){ //if error bar is full then game over loser
        gameState = "game over"
        nukeAnimation.stop();
      }
      break;

    case "celebrate":
    //code for celebration screen
      userInput.show();
      userInput.position((width/2)-80, height-50);
      userInput.value("Click the circles!");
      userInput.style("font-weight: bold");
      background(bg);
      for(var i = 0; i < circleMovers.length; i++){
        circleMovers[i].updatePosition(); //calculate the XY coordinates of each vector
        let mouseIsOverCircle = dist(mouseX, mouseY, circleMovers[i].position.x, circleMovers[i].position.y) < circleMovers[i].size;
        if(mouseIsOverCircle){ //then stop that circle and change color
          circleMovers[i].velocity = 0;
          circleMovers[i].color.r = floor(random(0,256));
          circleMovers[i].color.b = floor(random(0,256));
          circleMovers[i].color.g = floor(random(0,256));
          if(mouseIsPressed){
            circleMovers = circleMovers.filter(mover => mover != circleMovers[i]); //add every mover besides the one that was clicked to circleMovers (remove the one that was clicked)
          }
        }
        else circleMovers[i].velocity = circleMovers[i].startingVelocity;
        if(circleMovers[i] != undefined){
          fill(circleMovers[i].color.r, circleMovers[i].color.g, circleMovers[i].color.b);
          circle(circleMovers[i].position.x, circleMovers[i].position.y, circleMovers[i].size); //draw a circle with XY coordinates of each vector
        }
      }
      textSize(50); fill(255);
      text("You rock!",width/2,height/2);
      break;

    case "game over":  
    //code for lose screen
      background(0);
      fill(255); textSize(35);
      text("You Lose",width/2,(height/2)+100);
      userInput.hide();
      spinnyAnimation.draw(width/2,(height/2)-100,x);
      x++;
  }
}
let x=0;
