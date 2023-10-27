# %%
import time
import os
import numpy as np
import math
from itertools import product
import functools
# import cv2

# %%
lightRay = np.array([0,0,-7])
lightRay = lightRay/math.sqrt(sum([x*x for x in lightRay])) # makes it unit vector
eye = np.array([0,0,2000000])
R = 2
r = 1

class Memoize:
    def __init__(self, fn):
        self.fn = fn
        self.Memo = None
    def __call__(self, *args):
        if self.Memo is None:
            self.Memo = self.fn(*args)
        return self.Memo

class DonutPoint:
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.sqrtx2y2 = math.sqrt(x**2+y**2)
        z2 = r**2 - (self.sqrtx2y2-R)**2
        if(z2<0): # no solution
            z = None
        else:
            z = math.sqrt(z2)
        self.z = z
        self.point = np.array([x,y,z])

    @staticmethod
    def norm(v):
        norm2 = 0
        for i in range(len(v)):
            norm2 += v[i]**2
        norm = math.sqrt(norm2)
        return norm
    
    @staticmethod
    def unitVector(v):
        norm = DonutPoint.norm(v)
        return v/norm

    @staticmethod
    def isValidPoint(x,y):
        if(r >= abs(math.sqrt(x**2+y**2)-R)):
            return True
        else:
            return False


    def isValid(self):
        if(self.z is None):
            return False
        else:
            return True
    
    @functools.cache
    def unitNormal(self):
        x = self.x
        y = self.y
        z = self.z

        generalNormal = np.array([(self.sqrtx2y2-R)*2*x/self.sqrtx2y2,
                         (self.sqrtx2y2-R)*2*y/self.sqrtx2y2,
                         2*z])
        
        return DonutPoint.unitVector(generalNormal)
    
    @functools.cache
    def lightComponents(self):
        normalComponent = np.dot(lightRay, self.unitNormal())
        surfaceComponent = math.sqrt(1-normalComponent**2)
        return normalComponent,surfaceComponent
    
    @functools.cache
    def reflection(self):
        normalCom, surfaceCom = self.lightComponents()
        reflection = lightRay - self.unitNormal()*normalCom*2
        assert abs(DonutPoint.norm(reflection)-1) < 0.01
        return reflection
    
    @functools.cache
    def sightVector(self):
        return DonutPoint.unitVector(eye - self.point)
    
    @functools.cache
    def intensityScore(self):
        score = np.dot(self.sightVector(), self.reflection())
        return score
    
    @staticmethod
    def maxRadius():
        return r+R
    


# %%
lightRay = np.array([0,-20,-7])
rawLight = lightRay

eye = np.array([0,0,2000000])
R = 2
r = 1

lightRay = DonutPoint.unitVector(lightRay)

def changeLight():
    global lightRay, rawLight
    rawLight[1]+=1
    lightRay = rawLight
    lightRay = DonutPoint.unitVector(lightRay)



# %%
resolution = 30
maxRadius = DonutPoint.maxRadius()
boardWidth = resolution
board = [[' ']*boardWidth for _ in range(boardWidth)]
def clearBoard(board, c=' '):
    for y in range(len(board)):
        for x in range(len(board[0])):
            board[y][x] = c

def printBoard(board):
    s = ""
    for row in board:
        for c in row:
            s += c*2
        s+= '\n'
    print(s)

ascii = ".,-~:;=!*#$@ "
# ascii = str(list(reversed(".,-~:;=!*#$@")))
pointLine = np.linspace(-maxRadius, maxRadius, num=resolution)



# %%
print(len(range(resolution)),len(pointLine))

# %%
_ = input("press key to continue...")
os.system('cls')

clearBoard(board, 'x')
for _ in range(40):
    changeLight()
    for xy,ij in zip( product(pointLine, pointLine),
                      product(range(resolution),range(resolution-1,-1,-1) )):
        x,y = xy
        i,j = ij
        if(DonutPoint.isValidPoint(x,y)):
            point = DonutPoint(x,y)
            intensityDiscreatPoint = math.floor(  point.intensityScore()*(len(ascii)-1)  )
            if(intensityDiscreatPoint<0):
                intensityDiscreatPoint = -1
            temp = ascii[math.floor(intensityDiscreatPoint)]
            board[j][i] = temp
        else:
            ...
    os.system('cls')
    printBoard(board)
    clearBoard(board, 'x')
    time.sleep(0.5)


# %%



