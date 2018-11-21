import face_recognition
import os
import sys
import re

regex = re.compile(r"/routes.*$")

# path = "/Users/Berserkclown/Desktop/SeniorProject/known_people"
path = regex.sub('/models/known_people', os.path.abspath(__file__))



known_face_encodings = []
known_face_names = []


# image path and valid extensions

image_path_list = []
valid_image_extensions = [".jpg", ".jpeg", ".png", ".tif", ".tiff"]  # specify your vald extensions here
valid_image_extensions = [item.lower() for item in valid_image_extensions]

# create a list all files in directory and
# append files with a vaild extention to image_path_list
for file in os.listdir(path):
    extension = os.path.splitext(file)[1]
    if extension.lower() not in valid_image_extensions:
        continue
    image_path_list.append(os.path.join(path, file))
    known_face_encodings.append(face_recognition.face_encodings(face_recognition.load_image_file(os.path.join(path, file)))[0])
    known_face_names.append(os.path.splitext(file)[0])

# DELETE THE FILES


# STORE THE ENCODINGS with their names
print(known_face_names)
print(known_face_encodings)
with open (regex.sub('/models/encodings', os.path.abspath(__file__)), 'w') as f:
    f.write(str(dict(zip(known_face_names, [str(x) for x in known_face_encodings]))))