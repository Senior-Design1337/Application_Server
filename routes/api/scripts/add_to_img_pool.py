import face_recognition
import os
import sys
import re
import shutil
import ast
import pickle

try:
# if(True):

    regex = re.compile(r"/routes.*$")

    # path = "/Users/Berserkclown/Desktop/SeniorProject/known_people"
    path = regex.sub('/models/known_people', os.path.abspath(__file__))
    
    if len(os.listdir(path)) < 1:
        raise Exception("no files in the directory {}".format(path))


    known_face_encodings = []
    known_face_names = []


    # image path and valid extensions

    image_path_list = []
    valid_image_extensions = [".jpg", ".jpeg", ".png", ".tif", ".tiff", '']  # specify your vald extensions here
    valid_image_extensions = [item.lower() for item in valid_image_extensions]

    # create a list all files in directory and
    # append files with a vaild extention to image_path_list
    for file in os.listdir(path):
        
        # print(file)
        # print(os.path.splitext(file))
        if os.path.splitext(file)[0][0] != '.':

            # name = os.path.splitext(file)[0]
            for img in os.listdir(path + '/' + os.path.splitext(file)[0]):
                extension = os.path.splitext(img)[1]
                # print(img)

                if os.path.splitext(img)[0][0] != '.':
                    # print(os.path.splitext(file), os.path.splitext(img))
                    # print(os.path.join(path, file, img))

                    # known_face_names.append(name)
                    if extension.lower() not in valid_image_extensions:
                        continue
                    # print("adding path...")
                    image_path_list.append(os.path.join(path, file, img))
                    # print("adding face encoding...")
                    # print(os.path.join(path, file, img))
                    imeg = face_recognition.load_image_file(os.path.join(path, file, img))
                    # print("img", imeg, "imeg", sep='\n')
                    temp_face_encoding_arr = face_recognition.face_encodings(face_recognition.load_image_file(os.path.join(path, file, img)))
                    
                    # print(temp_face_encoding_arr)
                    
                    if not temp_face_encoding_arr:
                        print("no face detected")
                        continue
                    known_face_encodings.append(temp_face_encoding_arr[0])
                    print("adding name...")
                    known_face_names.append(os.path.splitext(file)[0])

    # print(known_face_names,known_face_encodings)


    # STORE THE ENCODINGS with their names
    filepath = regex.sub('/models/encodings.pickle', os.path.abspath(__file__))
   
    # print("serializing encodings...")

    if os.stat(filepath).st_size == 0:
        data = {"encodings": known_face_encodings, "names": known_face_names}
    else:
        data = pickle.loads(open(filepath, "rb").read())
        data["encodings"] += known_face_encodings
        data["names"] += known_face_names
    
    # print("data variable", data)
    with open (filepath, 'wb') as f:
        f.write(pickle.dumps(data))


    # # DELETE THE FILES in path (NOTE: dont know if parallel requests to run "add_to_img_pool.py" would result in parallel access of the file; and therefore, resulting in a race condition where images are deleted that have not been added yet)
    # for the_file in os.listdir(path):
    #     file_path = os.path.join(path, the_file)
    #     try:
    #         if os.path.isfile(file_path):
    #             os.unlink(file_path)

    #         elif os.path.isdir(file_path): shutil.rmtree(file_path)
    #     except Exception as e:
    #         print(e)

    print("updated the list of known encodings...")
    sys.stdout.flush()

except Exception as e: print(e, os.path.abspath(__file__), sep='\n')