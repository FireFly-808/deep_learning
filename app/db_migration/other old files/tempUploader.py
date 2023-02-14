from db_util import create_db_connection, execute_query, read_query, getFlightNum
import re
import pandas as pd
import socket
import numpy as np
from io import BytesIO
import logging
import io
from PIL import Image
import datetime
import os
from pathlib import Path

import numpy as np
import pandas as pd


from PIL import Image

import os


pw = "superwoofer123"
sqlConn = create_db_connection("localhost", "root", pw, "firefly_db")
flightNum = 10
file_path = os.path.join("..", "data", "match_data")


waypoints = [
    (43.70954790, -79.45999730),
    (43.70952730, -79.45999860),
    (43.70942840, -79.46000500),
    (43.70932950, -79.46001130),
]


def convert():
    for i in range(7, 11):
        fileName = f"data{i}.csv"
        file_path = os.path.join("..", "data", "match_data", fileName)
        data = pd.read_csv(file_path)
        print(data.head)

        count = 0  # initialize counter

    for i in range(1, data.shape[0]):  # data.shape[0] gives no. of rows
        face = data.iloc[i]  # remove one row from the data
        img = convert2image(face)  # send this row of to the function
        # cv2.imshow("image", img)
        # cv2.waitKey(0)  # closes the image window when you press a key
        count += 1  # counter to save the images with different name
        file_path = os.path.join("..", "data", "match_data", f"ir_{i}.png")
        im = Image.fromarray(img)
        im.save(file_path)


def convert2image(row):
    pixels = row["pixels"]  # In dataset,row heading was 'pixels'
    img = np.array(pixels.split())
    img = img.reshape(48, 48)  # dimensions of the image
    image = np.zeros((48, 48, 3))  # empty matrix
    image[:, :, 0] = img
    image[:, :, 1] = img
    image[:, :, 2] = img
    return image.astype(np.uint8)  # return the image


def addLoc(lon, lat):
    query_addLoc = "INSERT INTO locations (lon, lat) VALUES (%s, %s);"
    params_addLoc = (lon, lat)
    execute_query(sqlConn, query_addLoc, params_addLoc)

    query_checkLoc = "SELECT locID FROM locations WHERE lon = %s and lat = %s;"
    params_checkLoc = (lon, lat)
    result = read_query(sqlConn, query_checkLoc, params_checkLoc)

    print("added loc")
    return result


def addImage(locID, ir_path, rgb_path):
    date = datetime.now.strftime("%d-%m-%Y")

    query_addImageRecord = "INSERT INTO image_records (locID, flightNum, date_time, irImagePath, rgbImagePath) VALUES (%s, %s, %s, %s, %s);"
    params_addImageRecord = (locID, flightNum, date, ir_path, rgb_path)
    execute_query(sqlConn, query_addImageRecord, params_addImageRecord)

    print("added image")


def addHotspot(locID, size):
    query_addHS = "INSERT INTO hotspots (locID, flightNum, size, hotspot_status) VALUES (%s, %s, %s, %s);"
    params_addHS = (locID, flightNum, size, 0)
    execute_query(sqlConn, query_addHS, params_addHS)

    print("added hotspot")


# main ---------------------------------------
def main():
    for i, loc in enumerate(waypoints):
        locID = addLoc(loc[0], loc[1])

        addImage(locID)

        # make 2 of the waypoints hotspots
        if i > 1:
            addHotspot(locID, 123)


convert()
