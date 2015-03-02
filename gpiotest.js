var fs = require('fs');

function left_write(on)
{
	fs.writeFile("/sys/class/gpio/gpio8/value", on ? "1" : "0", function(){
		console.log("Left light has been set to value of " + on);
	});
}
function right_write(on)
{
	fs.writeFile("/sys/class/gpio/gpio11/value", on ? "1" : "0", function(){
		console.log("Right light has been set to value of " + on);
	});
}

var left_currentState = '0';
var left_previousState = '0';
var left_blinking = false; 
var left_ledState = false;
var right_currentState = '0';
var right_previousState = '0';
var right_blinking = false; 
var right_ledState = false;

function main()
{
	if (left_previousState == 0 && left_currentState == 1)
		left_toggleStuff();
	if (right_previousState == 0 && right_currentState == 1)
		right_toggleStuff();
	setTimeout(main, 10);
	left_previousState = left_currentState;
	right_previousState = right_currentState;
}

function left_toggleStuff()
{
	console.log("Left toggled stuff");
	if (left_blinking)
	{
		left_blinking = false;
		setTimeout(function(){left_write(false)}, 510);
	}
	else
		left_blinking = true;
	left_blink();
}

function right_toggleStuff()
{
	console.log("Right toggled stuff");
	if (right_blinking)
	{
		right_blinking = false;
		setTimeout(function(){right_write(false)}, 510);
	}
	else
		right_blinking = true;
	right_blink();
}

function left_blink()
{
	left_write(left_ledState)
	left_ledState = !left_ledState;
	if (left_blinking)
		setTimeout(left_blink, 500);
}

function right_blink()
{
	right_write(right_ledState)
	right_ledState = !right_ledState;
	if (right_blinking)
		setTimeout(right_blink, 500);
}

function left_read(callback)
{
	fs.readFile("/sys/class/gpio/gpio7/value", 'utf-8', function(err, data) {
		var data = (data + '').trim() || '0';
		left_currentState = data;
		callback(callback);
	});
}

function right_read(callback)
{
	fs.readFile("/sys/class/gpio/gpio9/value", 'utf-8', function(err, data) {
		var data = (data + '').trim() || '0';
		right_currentState = data;
		callback(callback);
	});
}

left_read(left_read);
right_read(right_read);
main();