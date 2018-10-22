var socket = io();
socket.on('drive', function (data) {
    console.log(data);
    if(!data)
        return;
    var wheel = data.wheel;
    var speed;
    if(data.dir === 0){
        speed = data.speed;
    }
    else if(data.dir === 1){
        speed = - data.speed;
    }
    speed = speed / 100;
    defender.drive(wheel, speed)
});

setInterval(() =>{
    socket.emit('pos', {
        attacker: {
            x: attacker.x,
            y: attacker.y,
            angle: defender.angle
        },
        defender: {
            x: defender.x,
            y: defender.y,
            angle: defender.angle
        }
    })
}, 100)