import csv
from operator import mod

def encoder(string):
    encrypted = "["
    for i, char in enumerate(string):
        if (i != len(string) - 1):
            encrypted += str((ord(char) ** 3) % 145)
            encrypted += ","
        else:
            encrypted += str((ord(char) ** 3) % 145)
    encrypted += "]"
    return '\"{encrypted}\"'.format(encrypted=encrypted)

with open('code/feeds.csv', 'r') as source:
    with open('code/encrypt.csv', 'w') as dest:
        reader = csv.reader(source)
        writer = csv.writer(dest)
        # write headers
        # writer.writerow(next(reader)[:2])
        next(reader)
        for row in reader:
            listString = "[" + str(round(float(row[2]), 2)) + "," + str(row[3]) + "," + str(row[4]) + "," + str(round(float(row[5]), 2)) + "]"
            encrypted = encoder(listString)
            writer.writerow([row[0], row[1], encrypted, row[6], row[7], row[8], row[9]])