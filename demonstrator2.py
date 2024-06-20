from flask import Flask
import RPi.GPIO as GPIO
from time import sleep

app = Flask(__name__)

# Setup GPIO pins
GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

class Motor:
    def __init__(self, Ena, In1, In2):
        self.Ena = Ena 
        self.In1 = In1 
        self.In2 = In2
        GPIO.setup(self.Ena, GPIO.OUT)
        GPIO.setup(self.In1, GPIO.OUT)
        GPIO.setup(self.In2, GPIO.OUT)
        self.pwm = GPIO.PWM(self.Ena, 100)
        self.pwm.start(0)

    def moveF(self, x=50):
        GPIO.output(self.In1, GPIO.LOW)
        GPIO.output(self.In2, GPIO.HIGH)
        self.pwm.ChangeDutyCycle(x)

    def moveB(self, x=50): 
        GPIO.output(self.In1, GPIO.HIGH)
        GPIO.output(self.In2, GPIO.LOW)
        self.pwm.ChangeDutyCycle(x)

    def stop(self): 
        self.pwm.ChangeDutyCycle(0)

motor1 = Motor(2, 3, 4)

@app.route('/moveF')
def move_forward():
    motor1.moveF(30)
    return "Moving Forward"

@app.route('/moveB')
def move_backward():
    motor1.moveB(30)
    return "Moving Backward"

@app.route('/stop')
def stop():
    motor1.stop()
    return "Stopped"

if __name__ == "__main__":
    try:
        app.run(host='0.0.0.0', port=5000)
    finally:
        motor1.stop()
        GPIO.cleanup()
