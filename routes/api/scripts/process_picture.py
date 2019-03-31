import face_recognition
import os
import ast
import sys
import numpy as np
import re
import pickle



def getnparray(arr):
    return [np.array([float(item) for item in feature[1:-1].split()]) for feature in list(arr.values())]

def toNParray(stringarr):
    # return np.array(['1','2','43'])
    return np.array([float(item) for item in stringarr[1:-1].split()])

def getnparray_at(arr, indx):
    return np.array(list(arr.values())[indx][1:-1].split())

# if True:
try:
    regex = re.compile(r"/routes.*$")

    data = pickle.loads(open(regex.sub('/models/encodings.pickle', os.path.abspath(__file__)), 'rb').read())


    new_face_encoding = toNParray(sys.argv[1].replace('\n', '').replace(',', ''))
    
    # See if the face is a match for the known face(s)
    matches = face_recognition.compare_faces(data["encodings"], new_face_encoding, 0.5)
    name = "Unknown"
    # name = "WelcomeStranger"

    # If a match was found in known_face_encodings, just use the first one.
    if True in matches:
        first_match_index = matches.index(True)
        name = data["names"][first_match_index]

    print(name)
    sys.stdout.flush()

except Exception as e: print(e, os.path.abspath(__file__), regex.sub('/models/encodings', os.path.abspath(__file__)), sep='\n')