var net = require('net');
var client = new net.Socket();
var ip = 'localhost';
var port = 26881;
function connect(){
    client.connect(port, ip, function(r , e) {
        console.log('Connected');
        client.write('Hello, server! This is Canvas');
    });
}

client.on('data' , function(data) {
    // console.log('Received: ' + data);
    // var fs = require('fs');
    // fs.writeFile('sample.json', data, 'utf8', () => { console.log("json saved ")});
});

client.on('close', function() { 
	console.log('Connection closed');
});

connect();

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function recread(){

rl.question('Your Command? ', (answer) => {
  // TODO: Log the answer in a database
    client.write(answer);
    recread();
})
}
recread();
