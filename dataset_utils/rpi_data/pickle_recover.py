import pickle
from datetime import datetime
import numpy as np
import io
import time
import requests
from PIL import Image

mlx_shape = (24,32)
camera_shape = (720,1280,3)

def temps_to_rescaled_uints(raw_np_image):
    #Function to convert temperatures to pixels on image
    # Fix dead pixel
    raw_np_image[6][0] = int((raw_np_image[6][1] + raw_np_image[5][0] + raw_np_image[7][0]) / 3)

    # Just in case there are any NaNs
    raw_np_image = np.nan_to_num(raw_np_image)

    _temp_min = np.min(raw_np_image)
    _temp_max = np.max(raw_np_image)
    norm = np.uint8((raw_np_image - _temp_min)*255/(_temp_max-_temp_min))

    norm.shape = mlx_shape
    return norm

def saveArrToPNG(rawData, extension, type):
    file_name = f"{type}_{extension}.png"
    file_path = file_name
    im = Image.fromarray(rawData, "L" if type == "ir" else "RGB")
    im.save(file_path)
    print(f"saved {type} as png")
    return file_path


with open('data.pickle', 'rb') as file:
    sensor_data = pickle.load(file)

i=0
for data in sensor_data:
    i+=1
    ir_norm = temps_to_rescaled_uints(data[0])
    ir_file_path = saveArrToPNG(ir_norm, i, type="ir")
    rgb_file_path = saveArrToPNG(data[1], i, type="rgb")
    print("Saved imgs from GPS" + str(data[2][0]) + "," + str(data[2][1]))