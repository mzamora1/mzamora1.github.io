var gif_createheart, gif_loadheart;
var gif_createpent, gif_loadpent;
var gif_createhouse, gif_loadhouse;
let instruc, end;

function preload(){
  gif_loadheart = loadImage('assets/spinnyAnimation/gif_heart.gif');
  gif_loadpent = loadImage('assets/spinnyAnimation/gif_pent.gif');
  gif_loadhouse = loadImage('assets/spinnyAnimation/gif_house.gif');
  chalk = loadImage('assets/pics/chalk.jpg');
  end = loadImage('assets/pics/end.JPG');
  yay = loadSound('assets/sounds/yay.mp3');
  music = loadSound('assets/sounds/music.mp3');
  burger = loadSound('assets/sounds/burger.mp3');
  duck = loadSound('assets/sounds/duck.mp3');
}

function intro(){
  background(chalk);
  instruc = createImg('assets/pics/intro.jpg','instructions');
  instruc.position(0,0);
  instruc.mouseClicked(()=>{
    instruc.hide();
  });
  drawingArray = heartArray
}

function setup() {
  createCanvas(400, 400);
  drawingArray = heartArray;
  background(chalk);
  intro();
  gif_createheart = createImg('assets/spinnyAnimation/gif_heart.gif','heart');
  gif_createheart.style("position:absolute");
  gif_createheart.hide();
  gif_createpent = createImg('assets/spinnyAnimation/gif_pent.gif','pent');
  gif_createpent.style("position:absolute");
  gif_createpent.hide();
  gif_createhouse = createImg('assets/spinnyAnimation/gif_house.gif','house');
  gif_createhouse.style("position:absolute");
  gif_createhouse.hide();
}

let text_heart = heart_text_place;
function heart_text_place(){
  textSize(32);
  text('HEART',250,320);
  fill('white');
}

let text_star = star_text_place;
function star_text_place(){
  textSize(32);
  text('Pentagram',200,320);
  fill(245);
}

let text_house = house_text_place;
function house_text_place(){
  textSize(32);
  text('House',260,320);
  fill(245);
}

let text_next = next_text_place;
function next_text_place(){
  textSize(10);
  text('Click on the GIF to Continue',175,350);
  fill(245);
}  

let text_empty = empty_text_place;
function empty_text_place(){
  textSize(1);
  text('BABABuoi',175,350);
  fill('white');
}

let heartArray = [];
  heartArray.push({x: 271, y:91}); 
  heartArray.push({x: 281, y:73}); 
  heartArray.push({x: 298, y:62}); 
  heartArray.push({x: 317, y:59}); 
  heartArray.push({x: 332, y:69}); 
  heartArray.push({x: 339, y:82}); 
  heartArray.push({x: 342, y:98}); 
  heartArray.push({x: 334, y:109}); 
  heartArray.push({x: 326, y:125}); 
  heartArray.push({x: 318, y:140}); 
  heartArray.push({x: 310, y:153}); 
  heartArray.push({x: 299, y:164}); 
  heartArray.push({x: 286, y:178}); 
  heartArray.push({x: 274, y:192}); 
  heartArray.push({x: 258, y:78}); 
  heartArray.push({x: 247, y:69}); 
  heartArray.push({x: 236, y:61}); 
  heartArray.push({x: 223, y:59}); 
  heartArray.push({x: 211, y:66}); 
  heartArray.push({x: 204, y:78}); 
  heartArray.push({x: 204, y:92}); 
  heartArray.push({x: 207, y:104}); 
  heartArray.push({x: 211, y:118}); 
  heartArray.push({x: 216, y:133}); 
  heartArray.push({x: 224, y:146}); 
  heartArray.push({x: 232, y:157}); 
  heartArray.push({x: 242, y:170}); 
  heartArray.push({x: 251, y:181}); 
  heartArray.push({x: 261, y:190}); 
  


let starArray = [];
  starArray.push({x: 194, y:52}); 
  starArray.push({x: 182, y:68}); 
  starArray.push({x: 204, y:72}); 
  starArray.push({x: 172, y:86}); 
  starArray.push({x: 208, y:94}); 
  starArray.push({x: 163, y:106}); 
  starArray.push({x: 214, y:117}); 
  starArray.push({x: 233, y:122}); 
  starArray.push({x: 258, y:128}); 
  starArray.push({x: 277, y:135}); 
  starArray.push({x: 267, y:150}); 
  starArray.push({x: 247, y:160}); 
  starArray.push({x: 228, y:169}); 
  starArray.push({x: 151, y:119}); 
  starArray.push({x: 134, y:124}); 
  starArray.push({x: 114, y:130}); 
  starArray.push({x: 99, y:138}); 
  starArray.push({x: 116, y:150}); 
  starArray.push({x: 133, y:158}); 
  starArray.push({x: 150, y:169}); 
  starArray.push({x: 146, y:185}); 
  starArray.push({x: 143, y:203}); 
  starArray.push({x: 142, y:225}); 
  starArray.push({x: 162, y:212}); 
  starArray.push({x: 178, y:200}); 
  starArray.push({x: 190, y:186}); 
  starArray.push({x: 201, y:197}); 
  starArray.push({x: 212, y:212}); 
  starArray.push({x: 227, y:222}); 
  starArray.push({x: 230, y:209}); 
  starArray.push({x: 230, y:194}); 
  starArray.push({x: 192, y:34}); 
  starArray.push({x: 177, y:40}); 
  starArray.push({x: 157, y:51}); 
  starArray.push({x: 141, y:62}); 
  starArray.push({x: 124, y:77}); 
  starArray.push({x: 110, y:89}); 
  starArray.push({x: 98, y:102}); 
  starArray.push({x: 88, y:117}); 
  starArray.push({x: 83, y:136}); 
  starArray.push({x: 83, y:155}); 
  starArray.push({x: 86, y:173}); 
  starArray.push({x: 92, y:190}); 
  starArray.push({x: 98, y:209}); 
  starArray.push({x: 106, y:225}); 
  starArray.push({x: 116, y:240}); 
  starArray.push({x: 130, y:255}); 
  starArray.push({x: 149, y:262}); 
  starArray.push({x: 170, y:268}); 
  starArray.push({x: 194, y:266}); 
  starArray.push({x: 216, y:261}); 
  starArray.push({x: 237, y:251}); 
  starArray.push({x: 210, y:38}); 
  starArray.push({x: 226, y:46}); 
  starArray.push({x: 239, y:57}); 
  starArray.push({x: 256, y:70}); 
  starArray.push({x: 265, y:82}); 
  starArray.push({x: 275, y:96}); 
  starArray.push({x: 285, y:112}); 
  starArray.push({x: 294, y:130}); 
  starArray.push({x: 295, y:142}); 
  starArray.push({x: 295, y:161}); 
  starArray.push({x: 292, y:175}); 
  starArray.push({x: 288, y:190}); 
  starArray.push({x: 284, y:204}); 
  starArray.push({x: 278, y:218}); 
  starArray.push({x: 272, y:233}); 
  starArray.push({x: 259, y:243});

let houseArray = [];
  houseArray.push({x: 126, y:120}); 
  houseArray.push({x: 134, y:111}); 
  houseArray.push({x: 141, y:101}); 
  houseArray.push({x: 150, y:93}); 
  houseArray.push({x: 158, y:82}); 
  houseArray.push({x: 167, y:72}); 
  houseArray.push({x: 176, y:62}); 
  houseArray.push({x: 184, y:53}); 
  houseArray.push({x: 192, y:59}); 
  houseArray.push({x: 200, y:70}); 
  houseArray.push({x: 208, y:80}); 
  houseArray.push({x: 215, y:91}); 
  houseArray.push({x: 222, y:103}); 
  houseArray.push({x: 230, y:114}); 
  houseArray.push({x: 137, y:122}); 
  houseArray.push({x: 148, y:124}); 
  houseArray.push({x: 164, y:123}); 
  houseArray.push({x: 181, y:122}); 
  houseArray.push({x: 193, y:122}); 
  houseArray.push({x: 203, y:122}); 
  houseArray.push({x: 215, y:122}); 
  houseArray.push({x: 226, y:124}); 
  houseArray.push({x: 132, y:102}); 
  houseArray.push({x: 132, y:92}); 
  houseArray.push({x: 132, y:80}); 
  houseArray.push({x: 131, y:72}); 
  houseArray.push({x: 140, y:71}); 
  houseArray.push({x: 150, y:72}); 
  houseArray.push({x: 150, y:82}); 
  houseArray.push({x: 136, y:130}); 
  houseArray.push({x: 135, y:140}); 
  houseArray.push({x: 136, y:150}); 
  houseArray.push({x: 135, y:163}); 
  houseArray.push({x: 135, y:178}); 
  houseArray.push({x: 135, y:190}); 
  houseArray.push({x: 134, y:200}); 
  houseArray.push({x: 145, y:202}); 
  houseArray.push({x: 157, y:202}); 
  houseArray.push({x: 170, y:202}); 
  houseArray.push({x: 186, y:202}); 
  houseArray.push({x: 203, y:202}); 
  houseArray.push({x: 214, y:202}); 
  houseArray.push({x: 222, y:203}); 
  houseArray.push({x: 221, y:193}); 
  houseArray.push({x: 221, y:184}); 
  houseArray.push({x: 221, y:174}); 
  houseArray.push({x: 220, y:164}); 
  houseArray.push({x: 220, y:152}); 
  houseArray.push({x: 220, y:142}); 
  houseArray.push({x: 220, y:134}); 
  houseArray.push({x: 170, y:192}); 
  houseArray.push({x: 170, y:182}); 
  houseArray.push({x: 172, y:169}); 
  houseArray.push({x: 181, y:167}); 
  houseArray.push({x: 190, y:169}); 
  houseArray.push({x: 193, y:179}); 
  houseArray.push({x: 194, y:191}); 

let drawingArray = []
let blankArray = []
let visitedboundaries = [];

function heart_animation(){
  background(0);
  drawingArray = blankArray;
  text_heart = text_next;
  image(gif_loadheart, 0, 0);
  burger.play();
  gif_createheart.position(50,25);
  gif_createheart.show();
  gif_createheart.mouseClicked(()=>{
    drawingArray=starArray;
    text_next = text_empty;
    text_star();
    gif_createheart.hide();
  });
}

function star_animation(){
  background(0);
  drawingArray = blankArray;
  text_star = text_next;
  image(gif_loadpent, 0, 0);
  duck.play();
  gif_createpent.position(50,25);
  gif_createpent.show();
  gif_createpent.mouseClicked(()=>{
    drawingArray=houseArray;
    text_next = text_empty;
    text_house();
    gif_createpent.hide();
  });
}

function house_animation(){
  background(0);
  drawingArray = blankArray;
  text_house = text_next;
  image(gif_loadhouse, 0, 0);
  gif_createhouse.position(50,25);
  gif_createhouse.show();
  gif_createhouse.mouseClicked(()=>{
    //drawingArray=houseArray; <= if more drawings are added.
    text_next = text_empty;
    text_house();
    gif_createhouse.hide();
  image(end,50,150);
  });
}

function mouseClicked(){

}

function draw() { 
  text_heart();

  for(let i = 0; i < (drawingArray).length; i++){
    circle((drawingArray[i]).x, (drawingArray[i]).y, 4);
  }
  
  stroke(200);
  if (mouseIsPressed === true) {
    line(mouseX, mouseY, pmouseX, pmouseY);
    checkAllBoundaries(14);
  }
}


function checkAllBoundaries(size){
  
    let inAnyBoundary = false;
  
    for(let i = 0; i < drawingArray.length; i++){
        let boundary = {
            left: (drawingArray[i]).x - size,
            right: (drawingArray[i]).x + size,
            top: (drawingArray[i]).y - size,
            bottom: (drawingArray[i]).y + size
        }
      
        //rect(boundary.left, boundary.top, size*2); //for testing purposes
        
    if(mouseX > boundary.left && mouseX < boundary.right && mouseY < boundary.bottom && mouseY >     boundary.top){
      inAnyBoundary = true;
      if (!visitedboundaries.includes(drawingArray[i])){
            visitedboundaries.push(drawingArray[i]);
            //console.log("In Bounds");
        }
      }
    }
    
    if (visitedboundaries.length >= drawingArray.length){
          visitedboundaries = [];
          clear();
          background(chalk);
      
          if (drawingArray == heartArray){
            yay.play();
            heart_animation();
            text_star();
          } else if (drawingArray == starArray){
            yay.play();
            star_animation();
          } else if (drawingArray ==houseArray){
            yay.play();
            house_animation();
          } 
    }
  
  if(!inAnyBoundary){ 
      clear();
      background(chalk);
  }
}
