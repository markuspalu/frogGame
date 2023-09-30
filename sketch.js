let frog;
let water;
let fountain;
let frogIdle;
let frogJump;
let floors; 
let flies;
let floor1, floor2, floor3;
let tounge;
let toungeX;
let toungeY;
let toungeDir = 1;
let scaler = 20;
let spaceScaler = 0;
let spaceW = 0;

let fly;
let croc;

let flyCount = 0;
let canSpawn = true;

let isToungeOut = false;

let flyX;
let flyY;

let frogVelY

let x;
let y;

let flyAni;
let crocAni;

let isGameOver = false;

function preload() {
  backgroundImage = loadImage('assets/swamp.png');
  fontPixel = loadFont('assets/PressStart2P-Regular.ttf');
}

function printLevel(lvlNr) {
  textSize(20);
  fill(255)
  textAlign(CENTER, CENTER);
  textFont(fontPixel);
  text(`Level ${lvlNr}`, 250, 30);
}

function spawnFly(count) {
    for (let i = 0; i < count; i++) {
      flyX = random(10, 490);
      flyY = random(120, 300);
      fly = new flies.Sprite(flyX, flyY, 4);
    }
    canSpawn = false;
}

async function gameOver(input) {
  textSize(20);
  fill(255)
  textAlign(CENTER, CENTER);
  textFont(fontPixel);
  text(input, 250, 250);
  await delay(2000);
  window.location.reload()
}

async function sequence() {
	await croc.moveTo(100, 430, 2);
  await delay(1000);
  croc.mirror.x = true;
  await croc.moveTo(400, 430, 2);
  await delay(1000);
  croc.mirror.x = false;
	sequence();
}

function setup() {
	new Canvas(500, 500);

  fountain = new Group();
  fountain.color = "#17B169";
  fountain.mass = 3;
  fountain.vel.y = -7;
  fountain.life = 50;
  fountain.strokeWeight = 0;

  water = new Sprite(0, 500, 1000, 150); ////
  water.vel.x = 0;
  water.vel.y = 0;
  water.color = "#17B169";

  let fliesAnim1 = `
  ..............
  .uuu......uuu.
  u...u....u...u
  .u..u....u..u.
  ..u.u....u.u..
  ...uuyyyyuu...
  ....yyyyyy....
  ....yyyyyy....
  .....yyyy.....
  ..............
  `;

  let fliesAnim2 = `
  ..................
  ..................
  .uuu.........uuu..
  u...u.......u...u.
  .u..u.......u..u..
  ..u.u..yyyy.u.u...
  ....uuyyyyyyuu....
  ......yyyyyy......
  .......yyyy.......
  ..................
  `;

  let fliesPalette = {
    y: color("white"),
    u: color("lightblue")
  };

  flyAni = loadAnimation(
    spriteArt(fliesAnim1, 2, fliesPalette),
    spriteArt(fliesAnim2, 2, fliesPalette)
  );

  flyAni.frameDelay = 5;

  flies = new Group();
  flies.addAni("fly", flyAni);
  flies.ani.play()

  strokeWeight(3)
  floors = new Group();
  let bottomFloor = new floors.Sprite(250, 505, 500, 1, 's');
  let rightFloor = new floors.Sprite(501, 0, 1, 1000, 's');
  let leftFloor = new floors.Sprite(-1, 0, 1, 1000, 's');
  rightFloor.overlaps(water)
  leftFloor.overlaps(water)
  floor1 = new floors.Sprite(100, 320, 60, 20);
  floor2 = new floors.Sprite(250, 320, 60, 20);
  floor3 = new floors.Sprite(400, 320, 60, 20);

  floors.color = "#006400"

  tounge = new Sprite();
  tounge.strokeWeight = 0;
  tounge.w = 1;
  tounge.h = 5;
  tounge.color = "red";

  frog = new Sprite(250, 300);
  frogJump = frog.addAni('frogJump', 'assets/frogJump.png', { frameSize: [768/8, 96], frames: 8});
  frogIdle = frog.addAni('frogIdle', 'assets/frogIdle.png', { frameSize: [96, 96], frames: 2 });
  frogIdle.frameDelay = 10;
  frog.scale = 0.5;

	crocAni = loadAnimation('assets/alligator.png', { frameSize: [592, 186], frames: 15 });

  crocAni.frameDelay = 4;

  croc = new Sprite(250, 420, 'n');
  croc.addAni("swim", crocAni);
  croc.ani.play()
  croc.rotation  = 0;
  croc.scale = 0.3;
  croc.removeColliders()
  croc.addCollider(0, 0, 120, 35)

  world.gravity.y = 10;

  sequence()
}


function draw() {
	clear()

  background(backgroundImage)

  water.rotation = 0;
  floors.rotation = 0;
  tounge.rotation = 0;
  floors.vel.x = 0;

  if (frog.ani.name === 'frogJump' && frog.vel.y === 0) {
    frog.changeAni('frogIdle');
  }

  if (kb.presses('up') && (frog.colliding(floors) > 0)) {
    frog.changeAni('frogJump');
    frog.ani.play(0)
    frog.vel.y = -5;
  }
  

   if (frog.colliding(floors) === 0 && frog.colliding(water) === 0) {
     if (kb.pressing('left')) {
      toungeDir = -1;
      frog.vel.x -= 0.15;
      frog.mirror.x = true;
     } else if (kb.pressing('right')) {
      toungeDir = 1; 
      frog.vel.x += 0.15;
      frog.mirror.x = false;
     }
   }

   tounge.x = frog.x + (scaler * toungeDir);
   tounge.y = frog.y - 3;

   tounge.w += spaceW;
   scaler += spaceScaler; 

   // Tounge in
   if (tounge.w > 120) {
    spaceW = -8;
    spaceScaler = -4;
   }

   // Reset tounge
   if (tounge.w === 1) {
    isToungeOut = false;
    spaceW = 0;
    spaceScaler = 0;
   }

   // Tounge out
   if (kb.pressed("SPACE") && isToungeOut === false && frog.y < 350) {
    isToungeOut = true;
    frog.ani.play(0)
    spaceW = 8;
    spaceScaler = 4;
    if (frog.mirror.x === true) {
      toungeDir = -1;
    } else {
      toungeDir = 1;
    }
  }

   tounge.overlaps(floors)
   tounge.overlaps(frog)
   tounge.overlaps(water);
   floors.overlaps(flies);
   floors.overlaps(croc)
   fountain.overlaps(flies);
   frog.overlaps(flies);
   frog.overlaps(water);
   croc.overlaps(water)

  flies.forEach(fly => {
    fly.rotation = 0;

    let value = map(fly.y, 0, 500, 6, -6)
    y = random(-5+value, 5+value);
    x = random(-5, 5)
	  fly.vel.x = x;
    fly.vel.y = y;

    let distance = dist(frog.x, frog.y, fly.x, fly.y);
    if (distance < 80) {
      fly.direction = fly.angleTo(frog) + 180;
      fly.speed = 1
    } else if (distance > 30);
      fly.speed = 1;

    if (tounge.collides(fly)) {
      fly.remove()
      flyCount++;
    }
  });

  if (frog.colliding(floor1) > 50) {
    new fountain.Sprite(100, 355, 10);
	} else if (frog.colliding(floor2) > 50) {
    new fountain.Sprite(250, 355, 10);
  } else if (frog.colliding(floor3) > 50) {
    new fountain.Sprite(400, 355, 10);
  }

  

  if (flyCount < 3) {
    printLevel(1)
  }
  
  if (flyCount >= 3 && flyCount < 9) {
    printLevel(2)
  }
    
  if (flyCount >= 9) {
    printLevel(3)
  }
    
    if (flyCount === 0 && canSpawn) {
      spawnFly(3)
      canSpawn = false;
    }
    
    if (flyCount === 3 && !canSpawn) {
      spawnFly(6)
      canSpawn = true;
    }

    if (flyCount === 9 && canSpawn) {
      spawnFly(10)
    }

    if (flyCount === 19) {
      gameOver("You win!")
    } else if (isGameOver) {
      gameOver("You lost!")
    }


    // If frog is underwater
    if (frog.y > 345) {
      if (!kb.pressing('up') || (kb.pressing('up') > 10)) {
        frog.vel.y = 0.7;
      } else if (kb.presses('up')) {
        frog.changeAni('frogJump');
        frog.ani.play(0)
        frog.move(30, 'up', 5);
      }
      tounge.color = color(255, 0, 0, 0);
      if (frog.mirror.x) {
        frog.rotateTo(60, 100)
      } else {
        frog.rotateTo(-60, 100)
      }
    } else {
      frog.rotation = 0;
      tounge.color = color(255, 0, 0);
    }

    let frogCrocDistance = dist(croc.x, croc.y, frog.x, frog.y);
    if (frogCrocDistance < 200 && frog.y > 355) {
      croc.direction = croc.angleTo(frog);
      if (frog.x > croc.x) {
        croc.mirror.x = true;
      } else if (frog.x < croc.x) {
        croc.mirror.x = false;
      }
    }

    if (croc.collides(frog)) {
      tounge.remove()
      frog.remove()
      isGameOver = true;
    }

  }
