//Include necessary node packages
var io      = require('socket.io').listen(3000),
    ds18b20 = require('ds18b20'),
    http    = require('http'),
    fs      = require('fs'),
    gpio    = require('rpi-gpio');



/*
    TO-DO
REMOVE DEPENDENCIES DS18B20 AND RPI-GPIO
REMAKE THEM WITH:
    https://github.com/chamerling/ds18b20/blob/master/lib/ds18b20.js
    https://github.com/JamesBarwell/rpi-gpio.js/blob/master/rpi-gpio.js

MAKE SETUP SECTION WITH NEW COOL FUNCTIONS
MAKE TX AND RX FUNCTIONS FOR EACH, BASE IT OFF OF button_one

REMEMBER, YOU MADE THIS
    https://github.com/uPaymeiFixit/Multiplayer.js/blob/master/multiplayer_server.js

This is the command to pull files and restart the server:
    scp josh@10.0.1.4:"/Users/Josh/Google\ Drive/Projects/Thermostat/app.js /Users/Josh/Google\ Drive/Projects/Thermostat/index.html" ~/; sudo node app.js

*/

////////////////////  GPIO SETUP  ////////////////////
gpio.setup(12, function (err) {
    if (err) throw err;
    gpio.write(12, true, function (err) {
        if (err) throw err;
        else console.log("Pin 12 (GPIO 18) set true.");
    }
});
gpio.setup(16, function (err) {
    if (err) throw err;
    gpio.write(16, true, function (err) {
        if (err) throw err;
        else console.log("Pin 16 (GPIO 23) set true.");
    }
});
gpio.setup(18, function (err) {
    if (err) throw err;
    gpio.write(18, true, function (err) {
        if (err) throw err;
        else console.log("Pin 18 (GPIO 24) set true.");
    }
});
gpio.setup(22, function (err) {
    if (err) throw err;
    gpio.write(22, true, function (err) {
        if (err) throw err;
        else console.log("Pin 22 (GPIO 25) set true.");
    }
});
////////////////////  END GPIO SETUP  ////////////////////




////////////////////  HTTP SERVER  ////////////////////
fs.readFile('/home/josh/index.html', function (err, html) {
    if (err) throw err;
    http.createServer(function(request, response) {  
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
    }).listen(80);
});
////////////////////  END HTTP SERVER  ////////////////////


/*
http://www.avbrand.com/projects/thermostat/code.asp

    SETTINGS
Temp high threshold - temp can be set temp + HT before air kicks on
Temp low threshold - temp can be set temp - LT before air kicks off
Mode - cooling, fan, heat

/*
client connects for first time
    send client current temperature
    send client array of past temps
    send client set temperature
    send client temp threshold

loop every 3 seconds
    update current temperatrue
    add current temperature to array of past temps
    push current temperature to clients
    check if gpio change needs to me made

(3) client changes setting
    change local setting
    check if gpio change needs to me made
    broadcast change to clients

EXPANSION OF (3)
	If temp > dt + va
		turn comp on
	If temp < dt - va
		turn heat on

NOTE: If a change is made, we must wait at least 15 seconds to process the change (to prevent rapid changing)

– (v) Client requests temp change
- (v) Client gets grey temp
- (v) Server sets request_temp and a timeout
		if new requests come in, prev is replaced




*/

////////////////////// CLIENT SIDE //////////////////////
//sendTemp(15);

function sendTemp(temp)
{
	console.log("CLIENT: We are sending the server a temperature of " + temp);
	sv_onReceiveTemp(temp)
}

function cl_onReceiveTemp(temp)
{
	console.log("CLIENT: Server has sent us the new accepted temp of " + temp);
}
////////////////////// END CLIENT SIDE //////////////////////


////////////////////// SERVER SIDE //////////////////////
setup();

function setup()
{
	console.log("SERVER: Setup is running...");
	setInterval(loop, 1000);
}

var desired_temp=70;
var current_temp=70;
var variance=2;
var heatIsOn = false;
var compressorIsOn = false;


function loop()
{
	console.log("SERVER: Loop is running...");

	//sv_updateCurrentTemp();

	if (current_temp < desired_temp - variance)
		sv_turnOnHeater();
	else if (current_temp > desired_temp + variance)
		sv_turnOnCompressor();
	else if (heatIsOn && current_temp >= desired_temp ||
			 compressorIsOn && current_temp <= desired_temp)
		sv_turnOffAll();


}

function sv_onReceiveTemp(temp)
{
	console.log("SERVER: We have received a temperature of " + temp);
	desired_temp = temp;
}

function sv_turnOnCompressor()
{
	if (!compressorIsOn)
	{
		console.log("SERVER: Heating pin deactivated\n SERVER: Compressor pin activated");
		compressorIsOn = true;
		heatIsOn = false;
	}
}

function sv_turnOnHeater()
{
	if (!heatIsOn)
	{
		console.log("SERVER: Compressor pin deactivated\nSERVER: Heating pin activated");
		heatIsOn = true;
		compressorIsOn = false;
	}
}

function sv_turnOffAll()
{
	console.log("SERVER: Heating pin deactivated\nSERVER: Compressor pin deactivated");
	compressorIsOn = false;
	heatIsOn = false;
}

function sv_updateCurrentTemp()
{
	current_temp = 70+Math.random()*3
}

////////////////////// END SERVER SIDE //////////////////////








 
//when a client connects
io.sockets.on('connection', function (socket) {

    socket.on('button_one', function() {
        console.log("Button one was pressed");
        gpio.read(18, function (err, value) {
            socket.broadcast.emit('button_one', value);
        });
    });

    socket.on('RXtest', function(msg){
        console.log("you pressed the button");

        socket.emit('TXtest', msg);
                    gpio.write(18, true, function(err) {
                        if (err) throw err;
                        console.log('Written to pin');
                    });
    });
 
    var sensorId = [];
    //fetch array containing each ds18b20 sensor's ID
    ds18b20.sensors(function (err, id) {
        sensorId = id;
        socket.emit('sensors', id); //send sensor ID's to clients
    });


 



    //initiate interval timer
    setInterval(function () {
        //loop through each sensor id
        sensorId.forEach(function (id) {
 
            ds18b20.temperature(id, function (err, value) {
                
                //send temperature reading out to connected clients
                socket.emit('temps', {'id': id, 'value': value});
 
            });
        });
 
    }, 5000);
});