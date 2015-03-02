#!/bin/sh

# DS1820B Temperature probe initialization
echo "Initializing DS1820B thermometer..."
modprobe w1-gpio
modprobe w1-therm
echo "DS1820B initialization completed."

# Sainsmart 4-channel relay initialization
echo "Initializing Sainsmart relay board..."
echo "18" > /sys/class/gpio/export
echo "23" > /sys/class/gpio/export
echo "24" > /sys/class/gpio/export
echo "25" > /sys/class/gpio/export
echo "out" > /sys/class/gpio/gpio18/direction
echo "out" > /sys/class/gpio/gpio23/direction
echo "out" > /sys/class/gpio/gpio24/direction
echo "out" > /sys/class/gpio/gpio25/direction
echo "Sainsmart relay board initialization completed."


# Relay startup animation
echo "Beginning Sainsmart relay board animation..."
sleep 0.25
echo "1" > /sys/class/gpio/gpio18/value
sleep 0.25
echo "1" > /sys/class/gpio/gpio23/value
sleep 0.25
echo "1" > /sys/class/gpio/gpio24/value
sleep 0.25
echo "1" > /sys/class/gpio/gpio25/value
sleep 0.25
echo "0" > /sys/class/gpio/gpio18/value
sleep 0.25
echo "0" > /sys/class/gpio/gpio23/value
sleep 0.25
echo "0" > /sys/class/gpio/gpio24/value
sleep 0.25
echo "0" > /sys/class/gpio/gpio25/value
sleep 0.005
echo "1" > /sys/class/gpio/gpio18/value
sleep 0.005
echo "1" > /sys/class/gpio/gpio23/value
sleep 0.005
echo "1" > /sys/class/gpio/gpio24/value
sleep 0.005
echo "1" > /sys/class/gpio/gpio25/value

echo "All gpio devices initialized."
