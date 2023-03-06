import torch
import time
import os
import requests

from utils import (
    load_img_from_url,
    pad_numpy_img_till_dims_by_32,
    inference_flame_model,
    overlay_mask_on_image,
    send_classification,
)

INTERVAL = 5

DEBUG = bool(int(os.environ.get('DEBUG',1)))

AWS_SERVER = 'http://ec2-3-219-240-142.compute-1.amazonaws.com'
LOCALHOST = 'http://127.0.0.1:8000'
# LOCALHOST = 'http://app:8000'

SERVER = LOCALHOST if DEBUG else AWS_SERVER

GET_RECORDS_URL = SERVER + '/api/server/records/get_unclassified_records/'

def build_sending_url(id):
    return SERVER + f'/api/server/records/{id}/send_classification/'

class FlameInferencer:

    def __init__(self):
        # Load the model
        print("init")
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        model_file = "../weights/FLAME-Unet-Mobilenet-AdamW-class2-epoch15-batch3.pt"
        self.model = None
        if self.device == "cuda":
            self.model = torch.load(model_file)
        else:
            self.model = torch.load(model_file, map_location=torch.device("cpu"))

        if not self.model:
            print("MODEL NOT LOADED !!!!!!!!!!!!!!!!!!!!!!!!!")

        self.model.eval()
        self.model.to(self.device)
        print("MODEL LOADED ===============================")

    def run_inference(self):
        # Get the unclassified records
        res = requests.get(GET_RECORDS_URL)
        records = res.json()
        if len(records) == 0:
            print(f"no unclassified records received, sleeping for {INTERVAL} seconds")
            return
                
        if DEBUG: start_time = time.time()

        for record in records:
            # Inference and visualize a single image from the retrieved list of records
            url = SERVER + record['image_rgb']
            og_img = load_img_from_url(url)

            img = pad_numpy_img_till_dims_by_32(og_img)

            pred_mask = inference_flame_model(self.model, self.device, img)
            pred_mask = pred_mask.numpy()

            # crop the mask to the original image size
            pred_mask = pred_mask[0 : og_img.shape[0], 0 : og_img.shape[1]]

            masked_image = overlay_mask_on_image(og_img, pred_mask)

            is_hotspot = True
            url = build_sending_url(record['id'])
            send_classification(url,masked_image,is_hotspot)

        print(f"Classified {len(records)} records")
        if DEBUG: end_time = time.time
        if DEBUG: print(f"Average Time taken for inference per image: {(end_time - start_time) / len(records)}")


if __name__ == "__main__":
    f1 = FlameInferencer()

    while True:
        f1.run_inference()
        time.sleep(INTERVAL)