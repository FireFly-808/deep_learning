import os
import cv2
import time
import torch
import requests
import numpy as np
from PIL import Image
from torchvision import transforms

from utils import (
    pad_numpy_img_till_dims_by_32,
    load_img_from_url,
    inference_flame_model,
    overlay_mask_on_image,
    send_classification_with_ir,
)
from utils_for_fusion import (
    inference_rgb_ir_frames,
    fuse_rgb_thermal_labels,
    _add_image_text,
    _process_raw_image,
)

INTERVAL = 5

DEBUG = bool(int(os.environ.get("DEBUG", 1)))

AWS_SERVER = os.environ.get('SERVER_URL')

LOCALHOST = "http://127.0.0.1:8000"
# LOCALHOST = "http://app:8000"

SERVER = LOCALHOST if DEBUG else AWS_SERVER

GET_RECORDS_URL = SERVER + "/api/server/records/get_unclassified_records/"


def build_sending_url(id):
    return SERVER + f"/api/server/records/{id}/send_classification/"


class FusedInferencer:
    def __init__(self):
        # Load the model
        # Model paths
        print("init")

        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

        _seg_model_file = (
            "../weights/FLAME-Unet-Mobilenet-AdamW-class2-epoch15-batch3.pt"
        )
        _rgb_model_file = "../weights/rgb_resenet18_epoch-5_full_model.pth"
        _thermal_model_file = "../weights/thermal_resenet18_epoch-5_full_model.pth"

        # Load model weights
        if self.device == "cuda":
            self.seg_model = torch.load(_seg_model_file)
            self.rgb_model = torch.load(_rgb_model_file)
            self.thermal_model = torch.load(_thermal_model_file)
            self.seg_model.to(self.device)
            self.rgb_model.to(self.device)
            self.thermal_model.to(self.device)
        else:
            self.seg_model = torch.load(
                _seg_model_file, map_location=torch.device("cpu")
            )
            self.rgb_model = torch.load(
                _rgb_model_file, map_location=torch.device("cpu")
            )
            self.thermal_model = torch.load(
                _thermal_model_file, map_location=torch.device("cpu")
            )
            self.seg_model.eval()
            self.rgb_model.eval()
            self.thermal_model.eval()

        if not self.seg_model or not self.rgb_model or not self.thermal_model:
            print("MODEL NOT LOADED !!!!!!!!!!!!!!!!!!!!!!!!!")
        else:
            print("MODEL LOADED ===============================")

        self.data_transforms = {
            "val": transforms.Compose(
                [
                    transforms.Resize(256),
                    transforms.CenterCrop(224),
                    transforms.ToTensor(),
                    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
                ]
            ),
        }
        # Mapping class names to output labels (0, 1, 2)
        self.class_names = ["NN", "YN", "YY"]

    def run_inference(self):
        # Get the unclassified records
        res = requests.get(GET_RECORDS_URL)
        records = res.json()
        if len(records) == 0:
            print(f"no unclassified records received, sleeping for {INTERVAL} seconds")
            return

        if DEBUG:
            start_time = time.time()

        for record in records:
            # Inference and visualize a single image from the retrieved list of records
            rgb_url = SERVER + record["image_rgb"]

            og_rgb_img = load_img_from_url(rgb_url)
            og_ir_img = load_img_from_url(SERVER + record["image_ir"])

            processed_ir_image = _process_raw_image(og_ir_img, 0, 0, filter_image=False)
            _temp_min = np.min(og_ir_img)
            _temp_max = np.max(og_ir_img)
            processed_ir_image = cv2.cvtColor(processed_ir_image, cv2.COLOR_BGR2RGB)

            padded_rgb_img = pad_numpy_img_till_dims_by_32(og_rgb_img)

            rgb_label, ir_label = inference_rgb_ir_frames(
                self.rgb_model,
                self.thermal_model,
                self.data_transforms,
                self.class_names,
                Image.fromarray(og_rgb_img),
                Image.fromarray(processed_ir_image),
            )

            fused_label = fuse_rgb_thermal_labels(rgb_label, ir_label)

            if fused_label == "YY" or fused_label == "YN":
                is_hotspot = True
            else:
                is_hotspot = False

            # segmentation
            pred_mask = inference_flame_model(
                self.seg_model, self.device, padded_rgb_img
            )
            pred_mask = pred_mask.numpy()

            # crop the seg mask to the original image size
            pred_mask = pred_mask[0 : og_rgb_img.shape[0], 0 : og_rgb_img.shape[1]]

            masked_image = overlay_mask_on_image(og_rgb_img, pred_mask)
            processed_ir_image = _add_image_text(
                False,
                processed_ir_image,
                _temp_min,
                _temp_max,
                0,
                0,
                False,
            )
            url = build_sending_url(record["id"])
            send_classification_with_ir(
                url, masked_image, processed_ir_image, is_hotspot
            )

        print(f"Classified {len(records)} records")
        if DEBUG:
            end_time = time.time
            print(
                f"Average Time taken for inference per image: {(end_time - start_time) / len(records)}"
            )


if __name__ == "__main__":
    f1 = FusedInferencer()

    while True:
        f1.run_inference()
        time.sleep(INTERVAL)
