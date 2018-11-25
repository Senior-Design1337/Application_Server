import re
import os
import ast



regex = re.compile(r"/routes.*$")

with open (regex.sub('/models/encodings', os.path.abspath(__file__)), 'r') as f:
    inputdata = f.read()#.replace('\n', '')#.replace(',', '')
    # known_data = ast.literal_eval(inputdata)#
    print(inputdata)