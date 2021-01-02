var monkey,monkey_running;
var ground,invisibleGround,groundImg;
var banana,bananaImage,obstacle,obstacleImage;
var FoodGroup,obstacleGroup;
var survivalTime = 0;
var bananaScore = 0;
var PLAY = 0;
var END = 1;
var gameState = PLAY;
var restart,restartImage;

function preload(){
  //loads all the images
  monkey_running =       loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png");
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  restartImage = loadImage("outline-restart-vector-icon-illustration-260nw-1565796019.jpg");
}

function setup(){
 //create the canves
 createCanvas(600,300);
 
  //create restart
  restart = createSprite(330,200,30,30);
  restart.addImage("restart",restartImage);
  restart.scale = 0.2;
 
  //create monkey
  monkey = createSprite(80,230,10,10);
  monkey.scale = 0.12;
  monkey.addAnimation("monkey", monkey_running);
 
  //create the ground
  ground = createSprite(300,340,600,10);
  ground.scale = 1;
  ground.x = width/2
  ground.velocityX = -(6 + 3*survivalTime/100);
  invisibleGround = createSprite(300,278,600,5);
 
  //create obstacle and banana group
  obstacleGroup = createGroup();
  bananaGroup = createGroup();
}

function draw(){
 
  //gives colour to the background
  background("yellow");
 
  //displays survival time and bananas collected
  fill("black");
  textSize(20);
  text("SURVIVAL TIME: "+survivalTime,10,20);
  text("BANANAS COLLECTED: "+bananaScore,320,20);
 
  if (gameState === PLAY){
   
    //make restart icon invisible
    restart.visible = false;
   
    //survivalTime = survivalTime + Math.round(getFrameRate()/60);
      survivalTime=Math.ceil(frameCount/frameRate())

   
    obstacles();
    bananas();
   
    //increase the survival time according to the ground movement
    ground.velocityX = -(4+survivalTime*1.5/100);
 
    //when 'space bar' is pressed, monkey jumps
    if(keyDown("space")&&monkey.y >= 230) {
      monkey.velocityY = -13;
    }
   
    //gives the gravity to the monkey
    monkey.velocityY = monkey.velocityY + 0.8;
 
    //makes the ground infinite
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
   
    //increase the banana score when the monkey touches the banana
    if (monkey.isTouching(bananaGroup)){
      bananaScore = bananaScore + 1;  
      bananaGroup.destroyEach();
    }
   
    //when monkey is touching the stone game state goes to end
    if (monkey.isTouching(obstacleGroup)){
      gameState = END;
    }
  }
 
  if (gameState === END){
   
    //makes the ground stops moving
    ground.velocityX = 0;
   
    //makes the restart icon again visible
    restart.visible = true;
   
    //pause stone and banana
    obstacleGroup.setVelocityXEach(0);
    bananaGroup.setVelocityXEach(0);
   
    //makes the stone and banana lifetime forever
    obstacleGroup.setLifetimeEach(-1);
    bananaGroup.setLifetimeEach(-1);
   
    //displays GAMEOVER
    fill("black");
    textSize(30);
    text("GAMEOVER",250,160);
 
    //pause the monkey
    monkey.velocity.y = 0;
 
    //when mouse is pressed on restart icon, game state goes to play
    if (mousePressedOver(restart)){
      bananaGroup.destroyEach();
      obstacleGroup.destroyEach();
      survivalTime = 0;
      bananaScore = 0;
      monkey.changeAnimation("running monkey", monkey_running);
      gameState = PLAY;
    }
  }
 
  //draws all the sprites
  drawSprites();
 
  //makes the monkey collide with the ground
  monkey.collide(invisibleGround);
}

//function for cteating the bananas
function bananas(){
  if (frameCount % 90 === 0){
    banana = createSprite(620,120,1,1);
    banana.addAnimation("banana", bananaImage);
    banana.debug = false;
    banana.scale = 0.1;
    banana.velocityX =-(7+survivalTime*1.5/100);
    banana.lifetime = 220;
    bananaGroup.add(banana);
    bananaGroup.add(banana);
  }
}

//function for creating the stones
function obstacles(){
  if (frameCount % 70 === 0){
    obstacle = createSprite(620,253,50,50);
    obstacle.addAnimation("rock", obstacleImage);
    obstacle.setCollider("circle",0,0,180);
    obstacle.debug = false;
    obstacle.scale = 0.13 ;
    obstacle.velocityX = -(9+survivalTime*1.5/100);
    obstacle.lifetime = 220;
    obstacleGroup.add(obstacle);
   
  }
}