var anglechanged = false;

setInterval(() => {
  var xdiff = defender.x - attacker.x;
  var ydiff = attacker.y - defender.y;

  console.log(`diffX ${xdiff}  diffY ${ydiff}`);
  if (xdiff === 0) xdiff++;
  var teta = Math.atan(ydiff / xdiff);
  var teta = teta * (180 / Math.PI);
  if (xdiff < 0) {
    teta += 180;
  }
  teta = teta % 360;
  if (teta < 0) {
    teta += 360;
  }
  teta = Math.round(teta);
  teta = 360 - teta;
  console.log(`teta ${teta}`);
  console.log(`angle ${attacker.angle}`);
  var diff = Math.abs(teta - attacker.angle);

  console.log(diff);
  if (diff < 20) {
    console.log("go");
    if (lastState != "speed") {
      attacker.drive(1, 5);
      attacker.drive(0, 5);
    }
    lastState = "speed";
  } else {
    if (lastState != "angle") {
      attacker.drive(1, 5);
      attacker.drive(0, 0);
    }
    lastState = "angle";
  }
  //   console.log(`${attacker.speed} ${attacker.angle}`);
}, 100);
