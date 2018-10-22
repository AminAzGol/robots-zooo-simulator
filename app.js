var net = require('net');
var fs = require("fs");
var http = require("http")
var socketio  = require('socket.io');
var url = require("url");
var ip = '192.168.1.3';
var port = 26881;
var openurl  = require("openurl");
var socketio_client;
var tcpSocket;
//start of tcp ------------------------------------
function error_handeling(socket) {
    socket.on('error', s =>{
        console.log('Err on client connection!')
        tcpSocket = null;

    })

    socket.on('close', socket => {
        console.log('Connection closed ', socket.ip);
        tcpSocket = null;
    });
}
var server = new net.createServer(error_handeling);
server.on('connection', (socket =>{
    console.log(`one device connected ${socket.localAddress}`);
    tcpSocket = socket;
    socket.on('data' , data => {
        console.log('Received: ' + data);
        //data must be something like 1,1,500
        data = data + '';
        var arr = data.split(',');
        //error handeling
        if(!arr || arr.length != 3){
            console.log('invalid input data');
            return;
        }
        if( arr[0] > 1 || arr[0] < 0 || arr[1] < 0 || arr[1] > 1|| arr[2] > 1000 || arr[2] < 0 ){
            console.log('invalid data range');
            return;
        }
        arr = arr.map(r => parseInt(r))        
        socketio_client.emit('drive', {wheel: arr[0], dir: arr[1], speed: arr[2]})
    });
}))

server.listen(port, () =>{
    console.log(`listening on ${port}`);
})
// end of tcp ------------------------------------------

//start of http
var httpserver = http.createServer((request, response) => {
    
    //findout what file where requested
    var pathName =url.parse(request.url).pathname;

    //reading the file date and return the data to the web client
    fs.readFile(__dirname + pathName, (err, data) => {
    if(err){
       response.writeHead(404, {'Content-type':'text/plan'});
       response.write('Page Was Not Found');
       response.end( );
    }else{
        response.writeHead(200);
       response.write(data);
       response.end( );
    }
})
})
console.log("web server running on 4098");
//end of http
httpserver.listen(4098);

//open the canvas on browser
openurl.open("http://localhost:4098/template/canvas.html");

var io = socketio(httpserver);
//connecting to ui via socket.io -------------------------------
io.sockets.on('connection', function(socket){
    console.log('a user connected');
    socketio_client = socket;
    socket.on('pos', (data) =>{
        if(tcpSocket)
            tcpSocket.write(JSON.stringify(data));
    })
});
