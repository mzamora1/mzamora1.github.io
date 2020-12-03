var gif_createheart, gif_loadheart;
var gif_createpent, gif_loadpent;
var gif_createhouse, gif_loadhouse;
let instruc, end, chalk;
let burger, duck, lit;
let ins;
let currentDrawing = 0;
let completionGifs = [];

class Point{
  constructor(x,y){
    this.x = map(x, 0, 400, 0, window.innerWidth-16) || 0;
    this.y = map(y, 0, 400, 0, window.innerHeight-66) || 0;
    this.size = map(13, 0, 400, 0, window.innerWidth-16);
    this.visited = false;
  }
}
class gifContainer{
  constructor(text, create, sound){
    this.gif_create = create;
    this.text = text;
    this.sound = sound;
  }
}
function map(value, a, b, c, d){
  value = (value - a) / (b - a); // first map value from (a..b) to (0..1)
  return c + value * (d - c); // then map it from (0..1) to (c..d) and return it
}

function preload(){
  chalk = loadImage('assets/pics/chalk.jpg');
  end = loadImage('assets/pics/end.JPG');
  yay = loadSound('assets/sounds/yay.mp3');
  burger = loadSound('assets/sounds/burger.mp3');
  duck = loadSound('assets/sounds/duck.mp3');
  lit = loadSound('assets/sounds/lit.mp3');
  ins = loadSound("assets/sounds/T3.mp3");
  instruc = createImg('assets/pics/intro.JPG','instructions');
  gif_createheart = createImg('assets/spinnyAnimation/gif_heart.gif','heart');
  gif_createpent = createImg('assets/spinnyAnimation/gif_pent.gif','pent');
  gif_createhouse = createImg('assets/spinnyAnimation/gif_house.gif','house');
}


let centerElement = (img) => img.position((width/2 - img.size().width/2),  (height/2 - img.size().height/2));


let heartArray = [
  new Point(190, 138), 
  new Point(205, 125), 
  new Point(226, 113), 
  new Point(250, 109), 
  new Point(275, 117), 
  new Point(289, 139), 
  new Point(294, 157), 
  new Point(286, 178), 
  new Point(275, 193), 
  new Point(266, 206), 
  new Point(253, 221), 
  new Point(235, 234), 
  new Point(215, 250), 
  new Point(196, 258), 
  new Point(174, 130), 
  new Point(162, 120), 
  new Point(142, 106), 
  new Point(122, 104), 
  new Point(106, 114), 
  new Point(98, 128), 
  new Point(96, 147), 
  new Point(102, 165), 
  new Point(111, 181), 
  new Point(123, 199), 
  new Point(137, 218), 
  new Point(149, 233), 
  new Point(161, 246), 
  new Point(173, 258), 
  new Point(183, 266),
];

let starArray = [];
  starArray.push(new Point( 194, 52)); 
  starArray.push(new Point( 182, 68)); 
  starArray.push(new Point( 204, 72)); 
  starArray.push(new Point( 172, 86)); 
  starArray.push(new Point( 208, 94)); 
  starArray.push(new Point( 163, 106)); 
  starArray.push(new Point( 214, 117)); 
  starArray.push(new Point( 233, 122)); 
  starArray.push(new Point( 258, 128)); 
  starArray.push(new Point( 277, 135)); 
  starArray.push(new Point( 267, 150)); 
  starArray.push(new Point( 247, 160)); 
  starArray.push(new Point( 228, 169)); 
  starArray.push(new Point( 151, 119)); 
  starArray.push(new Point( 134, 124)); 
  starArray.push(new Point( 114, 130)); 
  starArray.push(new Point( 99, 138)); 
  starArray.push(new Point( 116, 150)); 
  starArray.push(new Point( 133, 158)); 
  starArray.push(new Point( 150, 169)); 
  starArray.push(new Point( 146, 185)); 
  starArray.push(new Point( 143, 203)); 
  starArray.push(new Point( 142, 225)); 
  starArray.push(new Point( 162, 212)); 
  starArray.push(new Point( 178, 200)); 
  starArray.push(new Point( 190, 186)); 
  starArray.push(new Point( 201, 197)); 
  starArray.push(new Point( 212, 212)); 
  starArray.push(new Point( 227, 222)); 
  starArray.push(new Point( 230, 209)); 
  starArray.push(new Point( 230, 194)); 
  starArray.push(new Point( 192, 34)); 
  starArray.push(new Point( 177, 40)); 
  starArray.push(new Point( 157, 51)); 
  starArray.push(new Point( 141, 62)); 
  starArray.push(new Point( 124, 77)); 
  starArray.push(new Point( 110, 89)); 
  starArray.push(new Point( 98, 102)); 
  starArray.push(new Point( 88, 117)); 
  starArray.push(new Point( 83, 136)); 
  starArray.push(new Point( 83, 155)); 
  starArray.push(new Point( 86, 173)); 
  starArray.push(new Point( 92, 190)); 
  starArray.push(new Point( 98, 209)); 
  starArray.push(new Point( 106, 225)); 
  starArray.push(new Point( 116, 240)); 
  starArray.push(new Point( 130, 255)); 
  starArray.push(new Point( 149, 262)); 
  starArray.push(new Point( 170, 268)); 
  starArray.push(new Point( 194, 266)); 
  starArray.push(new Point( 216, 261)); 
  starArray.push(new Point( 237, 251)); 
  starArray.push(new Point( 210, 38)); 
  starArray.push(new Point( 226, 46)); 
  starArray.push(new Point( 239, 57)); 
  starArray.push(new Point( 256, 70)); 
  starArray.push(new Point( 265, 82)); 
  starArray.push(new Point( 275, 96)); 
  starArray.push(new Point( 285, 112)); 
  starArray.push(new Point( 294, 130)); 
  starArray.push(new Point( 295, 142)); 
  starArray.push(new Point( 295, 161)); 
  starArray.push(new Point( 292, 175)); 
  starArray.push(new Point( 288, 190)); 
  starArray.push(new Point( 284, 204)); 
  starArray.push(new Point( 278, 218)); 
  starArray.push(new Point( 272, 233)); 
  starArray.push(new Point( 259, 243));

  //  ({x:\s)|y:|}

let houseArray = [
  new Point(77, 172), 
  new Point(94, 173), 
  new Point(113, 173), 
  new Point(130, 173), 
  new Point(148, 174), 
  new Point(165, 174), 
  new Point(185, 174), 
  new Point(204, 174), 
  new Point(222, 176), 
  new Point(244, 176), 
  new Point(264, 176), 
  new Point(80, 158), 
  new Point(94, 140), 
  new Point(94, 118), 
  new Point(94, 98), 
  new Point(94, 83), 
  new Point(103, 82), 
  new Point(115, 81), 
  new Point(125, 83), 
  new Point(125, 93), 
  new Point(125, 110), 
  new Point(134, 103), 
  new Point(150, 84), 
  new Point(167, 66), 
  new Point(184, 53), 
  new Point(194, 64), 
  new Point(202, 76), 
  new Point(212, 86), 
  new Point(220, 97), 
  new Point(230, 107), 
  new Point(237, 117), 
  new Point(244, 133), 
  new Point(253, 146), 
  new Point(260, 160), 
  new Point(98, 187), 
  new Point(98, 203), 
  new Point(98, 219), 
  new Point(98, 231), 
  new Point(98, 244), 
  new Point(98, 259), 
  new Point(98, 278), 
  new Point(116, 282), 
  new Point(134, 281), 
  new Point(154, 282), 
  new Point(174, 282), 
  new Point(195, 281), 
  new Point(213, 280), 
  new Point(228, 280), 
  new Point(246, 279), 
  new Point(248, 264), 
  new Point(249, 246), 
  new Point(247, 232), 
  new Point(248, 212), 
  new Point(247, 198), 
  new Point(154, 270), 
  new Point(156, 256), 
  new Point(158, 239), 
  new Point(173, 240), 
  new Point(189, 241), 
  new Point(190, 255), 
  new Point(190, 268),
];

let drawingArray = [heartArray, starArray, houseArray];
let blankArray = []
let visitedboundaries = [];

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

function setup() {
  canvas = createCanvas(windowWidth-16, (windowHeight-66));
  textAlign(CENTER)
  completionGifs = [
    new gifContainer(createElement("h2", "heart"), gif_createheart, burger), 
    new gifContainer(createElement("h2", "pentagram"), gif_createpent, duck), 
    new gifContainer(createElement("h2", "house"), gif_createhouse, lit), 
  ];
  //music.loop();
  
  centerElement(instruc);
  instruc.mouseClicked(() => {
    instruc.hide();
    ins.play();
  });

  completionGifs.forEach((obj) => {
    obj.text.hide();
    obj.text.position(width/2, (height/2)+200);
    centerElement(obj.gif_create);
    obj.gif_create.hide();
    obj.gif_create.mouseClicked(function() {
      this.hide();
      clear(); background(chalk);
    });
  })
}// end of setup()

function draw() { 
  textSize(32); textAlign(CENTER);
  completionGifs[currentDrawing] ? completionGifs[currentDrawing].text.hide(): completionGifs[currentDrawing-1].text.hide();

  drawingArray[currentDrawing] ? drawingArray[currentDrawing].forEach((point) => {
    point.visited ? fill(0, 255, 0) : fill(255, 0, 0); //if visited then fill green, else fill red
    circle(point.x, point.y, 4);
  }):
  
  stroke(200);
  if (mouseIsPressed === true || !drawingArray[currentDrawing]) {
    if (mouseIsPressed)line(mouseX, mouseY, pmouseX, pmouseY);
    if(checkAllBoundaries()){
      clear(); background(0);
      textSize(20); fill(255);
      text('Click on the GIF to Continue',width/2, height/2 +170);
      completionGifs[currentDrawing-1].gif_create.show();
      if (currentDrawing < completionGifs.length-1) completionGifs[currentDrawing].text.hide();
      completionGifs[currentDrawing-1].sound.play();
    }
  } else if (completionGifs[currentDrawing])completionGifs[currentDrawing].text.show();
}// end of draw()


function checkAllBoundaries(){
  if (drawingArray[currentDrawing]){ 
  let inAnyBoundary = false;
  for(let i = 0; i < drawingArray[currentDrawing].length; i++){
    let point = drawingArray[currentDrawing][i];
    
    //circle(point.x, point.y, point.size*2); //for testing purposes
    if(dist(mouseX, mouseY, point.x, point.y) < point.size){
      inAnyBoundary = true;
      if (!point.visited){
        point.visited = true;
        visitedboundaries.push(point);
        //console.log("In Bounds");
      }
    }
  }

  if (drawingArray[currentDrawing].every((point) => point.visited)){
    currentDrawing++;
    clear(); background(chalk);
    yay.play();
    return true;
  }

  if (currentDrawing == drawingArray.length){
    image(end, (width/2)-150, (height/2)-100);
    console.log("you win");
  } else completionGifs[currentDrawing].text.hide();

  if(!inAnyBoundary){ 
    clear(); background(chalk);

    drawingArray[currentDrawing].forEach((point) => point.visited = false);
  }
  
} else image(end, (width/2)-150, (height/2)-100);
}// end of checkAllBoundaries()
