import face_recognition
import os
import ast
import sys
import numpy as np



def getnparray(arr):
    return [np.array(feature[1:-1].split()) for feature in list(arr.values())]

def toNParray(string):
    return np.array(string[1:-1].split())

def getnparray_at(arr, indx):
    return np.array(list(arr.values())[indx][1:-1].split())


# Needs to be inputted (SHOULD THEY BE PAIRED??????)
# known_face_encodings = []
# known_face_names = []


# keys = known_face_names/IDs
# values = known_face_encodings
with open ('encodings', 'r') as f:
    known_data = ast.literal_eval(f.read())


print(known_data.keys())
# print(getnparray_at(known_data, 0))
print(getnparray(known_data))

# sent new face
# new_face_encoding = face_recognition.face_encodings(face_recognition.load_image_file('''os.path.join(path, file)'''))[0]




# # A picture that has multiple faces
# rgb_pic = None

# # Find all the faces and face encodings in the current frame of video
# face_locations = face_recognition.face_locations(rgb_pic)
# face_encodings = face_recognition.face_encodings(rgb_pic, face_locations)



# for face_encoding in face_encodings:
# See if the face is a match for the known face(s)
matches = face_recognition.compare_faces(getnparray(known_data), toNParray(sys.argv[1]), 0.5)
name = "Unknown"
# name = "WelcomeStranger"

# If a match was found in known_face_encodings, just use the first one.
if True in matches:
    first_match_index = matches.index(True)
    name = list(known_data.keys())[first_match_index] # name can be swapped with profile_ID

print(name)
sys.stdout.flush(name)

