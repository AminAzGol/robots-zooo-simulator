var canvas = document.querySelector("canvas");

var w = 700;
var h = 650;
canvas.width = w;
canvas.height = h;

//stop flag for stop the animation and timer
var stopFlag = false;
// c is the object thar we can do the drawing stuff with it.
var c = canvas.getContext("2d");

var lastState = 'nothing';

//map is the playground
var map = {
  width: 400,
  height: 600
};
//claculating map x and y
map = {
  x: (w - map.width) / 2,
  y: (h - map.height) / 2,
  ...map
};

//start state is the information about the start of the game
var start_state = {
  attacker_pos: {
    //it looks a little complicated but simply the (w - map.width)/2 is
    //the x position of the map so like (w - map.height)/2 as y
    x: (w - map.width) / 2 + map.width / 2,
    y: (w - map.height) / 2 + map.height / 4
  },
  defender_pos: {
    x: (w - map.width) / 2 + map.width / 2,
    y: (w - map.height) / 2 + map.height - map.height / 4
  },
  time: Date.now()
};

//game information
var game = {
  time: 0
};

var timer = () => {
  game.time = (Date.now() - start_state.time) / 1000;
};

//robot is the player and it defined like class in case we need more
//than two robots in future
function Robot(color, size, startX, startY) {
  this.color = color;
  this.size = size;
  this.x = startX;
  this.y = startY;
  //the speed of moving forward or backward
  this.speed = 0;

  //define a speed for both wheels of the robot
  //to calculate turning speed with them
  this.left_speed = 0;
  this.right_speed = 0;
  //speed of turning left or right
  this.turning_speed = 270;
  this.angle = 0;
  this.draw = () => {
    //this method will draw the robot with
    //current position and color
    c.beginPath();
    c.arc(this.x, this.y, this.size, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.fill();
    //the head should place in the defined angle
    var headx = this.x + 20 * Math.cos(this.angle * (Math.PI / 180));
    var heady = this.y + 20 * Math.sin(this.angle * (Math.PI / 180));
    //draw head of robot
    c.beginPath();
    c.arc(headx, heady, this.size / 2, Math.PI * 2, false);
    c.fillStyle = color;
    c.fill();
  };
  this.move = () => {
    //first calculate the speed of changing of the angle
    //and also speed of moving forward or backward
    var diff = Math.abs(this.left_speed - this.right_speed);
    
    //if the signs are diffrent
    if( Math.sign(this.left_speed) != Math.sign(this.right_speed)){
        //in this case speed is zero and it doesn't have any movement
        //just spining
        this.speed = 0
        if( Math.sign(this.right_speed) != 0){
            this.turning_speed = Math.sign(this.right_speed) * diff;
        }
        else if(Math.sign(this.left_speed) != 0){
            this.turning_speed = - Math.sign(this.left_speed) * diff;
        }
        else{
            //both are 0 so it stoped
            this.turning_speed = 0;
        }
    }
    else if(this.left_speed > this.right_speed){
        this.turning_speed = - diff;
        this.speed = this.right_speed;
    }
    else{
        this.turning_speed = diff;
        this.speed = this.left_speed;
    }

    //NOW applying the changes
    this.angle += this.turning_speed;
    this.angle = this.angle % 360;
    if(this.angle < 0)
    this.angle += 360;
    this.x = this.x + this.speed * Math.cos(this.angle * (Math.PI / 180));
    this.y = this.y + this.speed * Math.sin(this.angle * (Math.PI / 180));
  };
  this.just_move = (turning_speed, speed) => {

    this.angle += turning_speed;
    this.x = this.x + speed * Math.cos(this.angle * (Math.PI / 180));
    this.y = this.y + speed * Math.sin(this.angle * (Math.PI / 180));
  }
  this.drive = (wheel,speed) => {
    if(wheel === 1){
        this.left_speed = speed;
    }
    else if(wheel === 0){
        this.right_speed = speed;
    }
  };
}

//intial the attacker and defnder
var attacker = new Robot(
  "red",
  15,
  start_state.attacker_pos.x,
  start_state.attacker_pos.y
);
var defender = new Robot(
  "green",
  15,
  start_state.defender_pos.x,
  start_state.defender_pos.y
);

var drawMap = () => {
  c.rect((w - map.width) / 2, (h - map.height) / 2, map.width, map.height);
  c.strokeStyle = "black";
  c.stroke();
  c.font = "20px Aria";
  c.fillText(game.time, 30, 30, 50);
};

//poof this is obvious
var stop = () => {
    console.log('stop');
  stopFlag = true;
};
//checking if the player gamed over or not
var gameover = () => {
  var gameover = false;
  if (
    Math.sqrt( Math.pow(attacker.x - defender.x,2) + Math.pow(attacker.y - defender.y,2) ) <= defender.size + attacker.size
  ) {
    console.log("GAMEOVER: hit the attacker");

    gameover = true;
  }
  if (
    defender.x - defender.size <= map.x ||
    defender.y - defender.size <= map.y ||
    defender.y + defender.size >= map.y + map.height ||
    defender.x + defender.size >= map.x + map.width
  ) {
    console.log("GAMEOVER: cross the line");
    gameover = true;
  }

  if (gameover) {
    c.font = "40px Georgia";
    c.fillStyle = "black";
    c.fillText("Game Over", w / 2 - 100, h / 2);
    stop();
  }
};
//animation will run a loop in every frame in the canvas
function animation() {
  if (stopFlag) return;
  requestAnimationFrame(animation);
  //clearing hole map to update informarion
  c.clearRect(0, 0, w, h);
  //first draw the map
  drawMap();
  //second draw the robots and move them
  attacker.draw();
  attacker.move();
  defender.draw();
  defender.move();

  //set the timer
  timer();

  //check for gameover
  gameover();
}
animation();

var resume = () =>{
    stopFlag = false;
    animation();
}
var restart = () => {
    stop();
  stopFlag = false;
  lastState = 'nothing'
  start_state.time = Date.now();
  animation();
  defender.x = start_state.defender_pos.x;
  defender.y = start_state.defender_pos.y;
  attacker.x = start_state.attacker_pos.x;
  attacker.y = start_state.attacker_pos.y;
  attacker.angle = 0;
  defender.angle = 0;
  attacker.left_speed = 0;
  attacker.right_speed =0 ;
  defender.left_speed = 0;
  defender.right_speed =0 ;
};
