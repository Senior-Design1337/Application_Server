import sys

#sys.argv[1]
print("testpi: i am working")
sys.stdout.flush()

open("testpicreatedme.txt", 'a').close()

with open("testpi_created_me.txt", "a") as myfile:
    myfile.write("1 +")