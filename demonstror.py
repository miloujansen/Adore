import RPi.GPIO as GPIO
from time import sleep

GPIO.setmode(GPIO.BCM)
GPIO.setwarnings(False)

## https://www.youtube.com/watch?v=Qp4wNdyC2Z0

class Motor():
    def __init__(self,Ena,In1,In2):
        self.Ena = Ena 
        self.In1 = In1 
        self.In2 = In2
        GPIO.setup(self.Ena,GPIO.OUT)
        GPIO.setup(self.In1,GPIO.OUT)
        GPIO.setup(self.In2,GPIO.OUT)
        self.pwm = GPIO.PWM(self.Ena,100)
        self.pwm.start(0)

    def moveF(self,x=50, t=0) # x = speed, t = time
        GPIO.output(self.In1,GPIO.LOW)
        GPIO.output(self.In2,GPIO.HIGH)
        self.pwm.ChangeDutyCycle(x)
        sleep(t)

    def moveB(self,x=50, t=0)
        GPIO.output(self.In1,GPIO.HIGH)
        GPIO.output(self.In2,GPIO.LOW)
        self.pwm.ChangeDutyCycle(x)
        sleep(t)

    def stop(self, t=0) 
        self.pwm.ChangeDutyCycle(0)
        sleep(t)

motor1 = Motor(2,3,4)


try:
    while True: 
        motor1.moveF(30, 2)
        motor1.stop(2)
        motor1.moveB(30, 2)
except KeyboardInterrupt:
    pass
finally:
    motor1.stop()
    GPIO.cleanup()