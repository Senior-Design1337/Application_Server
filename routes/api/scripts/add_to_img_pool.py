import face_recognition
import os
import sys
import re
import shutil
import ast

try:

    regex = re.compile(r"/routes.*$")

    # path = "/Users/Berserkclown/Desktop/SeniorProject/known_people"
    path = regex.sub('/models/known_people', os.path.abspath(__file__))
    
    if len(os.listdir(path)) < 1:
        raise Exception(f"no files in the directory {path}")


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

    # STORE THE ENCODINGS with their names
    # print(known_face_names)
    # print(known_face_encodings)
    filepath = regex.sub('/models/encodings', os.path.abspath(__file__))
    with open (filepath, 'r+') as f:
        # check if file is empty to know if data is to be appended or simply written directly to the file "encodings"
        if os.stat(filepath).st_size == 0:
            f.write(str(dict(zip(known_face_names, [str(x) for x in known_face_encodings]))))
        else:
            # read the contents of the file > evaluate it to dict > append new dict fields to it > write new dict back to the file as str
            f.write(str({**ast.literal_eval(f.read().replace('\n', '')), **dict(zip(known_face_names, [str(x) for x in known_face_encodings]))}))

    # DELETE THE FILES in path (NOTE: dont know if parallel requests to run "add_to_img_pool.py" would result in parallel access of the file; and therefore, resulting in a race condition where images are deleted that have not been added yet)
    for the_file in os.listdir(path):
        file_path = os.path.join(path, the_file)
        try:
            if os.path.isfile(file_path):
                os.unlink(file_path)
            #elif os.path.isdir(file_path): shutil.rmtree(file_path)
        except Exception as e:
            print(e)

    print("updated the list of known encodings...")
    sys.stdout.flush()
    
except Exception as e: print(e, os.path.abspath(__file__), sep='\n')