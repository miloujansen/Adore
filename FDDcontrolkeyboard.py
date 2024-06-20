import RPi.GPIO as GPIO
import keyboard
from time import sleep

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

    def moveF(self, x=50): # x = speed
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

def on_key_event(event):
    if event.name == 'up':
        print("Moving Forward")
        motor1.moveF(30)
    elif event.name == 'down':
        print("Moving Backward")
        motor1.moveB(30)
    elif event.name == 'space':
        print("Stopping")
        motor1.stop()

# Set up the keyboard event listener
keyboard.on_press(on_key_event)

try:
    print("Press arrow keys to control the motor and space to stop. Press ESC to exit.")
    keyboard.wait('esc')
finally:
    motor1.stop()
    GPIO.cleanup()
    print("Cleaned up GPIO and exited.")

