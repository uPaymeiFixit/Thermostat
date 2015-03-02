#Preperation
echo "18" > /sys/class/gpio/export
echo "23" > /sys/class/gpio/export
echo "24" > /sys/class/gpio/export
echo "25" > /sys/class/gpio/export
echo "out" > /sys/class/gpio/gpio18/direction
echo "out" > /sys/class/gpio/gpio23/direction
echo "out" > /sys/class/gpio/gpio24/direction
echo "out" > /sys/class/gpio/gpio25/direction
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


#Turn all on then all off
for i in {1..1}
do
    echo "0" > /sys/class/gpio/gpio18/value
    sleep 0.5
    echo "0" > /sys/class/gpio/gpio23/value
    sleep 0.5
    echo "0" > /sys/class/gpio/gpio24/value
    sleep 0.5
    echo "0" > /sys/class/gpio/gpio25/value
    sleep 0.5
    echo "1" > /sys/class/gpio/gpio18/value
    sleep 0.5
    echo "1" > /sys/class/gpio/gpio23/value
    sleep 0.5
    echo "1" > /sys/class/gpio/gpio24/value
    sleep 0.5
    echo "1" > /sys/class/gpio/gpio25/value
    sleep 0.5
done


#Turn 18 on and off
for i in {1..10}
do
    echo "0" > /sys/class/gpio/gpio18/value
    sleep 0.1
    echo "1" > /sys/class/gpio/gpio18/value
    sleep 0.1
done


#Temp setup
modprobe w1-gpio
modprobe w1-therm


#Probe temp
while :
do
    cat /sys/bus/w1/devices/28*/w1* | grep t= | awk '{print $10}'
    sleep 3
done