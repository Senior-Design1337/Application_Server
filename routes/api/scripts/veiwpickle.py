import pickle
import os
import re


regex = re.compile(r"/routes.*$")

data = pickle.loads(open(regex.sub('/models/encodings.pickle', os.path.abspath(__file__)), 'rb').read())


print(data)