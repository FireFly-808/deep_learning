import os
import re
import torch
import numpy as np
from PIL import Image
import matplotlib.pyplot as plt
from torchvision import transforms

from utils_for_fusion import (
    inference_rgb_ir_frames,
    fuse_rgb_thermal_labels,
)


def get_id_from_path(path):
    base = os.path.basename(path)
    og_filename, extension = os.path.splitext(base)
    id = og_filename.split(" ")[-1]
    id = re.sub(r"[()]", "", id)
    return int(id)


# Load the rgb and thermal image pairs
base_dir = "/Users/umar/UWaterloo/4B/Capstone4B/deep_learning/app/dataset_utils/rgb_ir_test_pairs"

rgb_base_dir = os.path.join(base_dir, "rgb")
ir_base_dir = os.path.join(base_dir, "ir")

rgb_list = [
    os.path.join(rgb_base_dir, i)
    for i in os.listdir(rgb_base_dir)
    if i.endswith(".jpg")
]
ir_list = [
    os.path.join(ir_base_dir, i) for i in os.listdir(ir_base_dir) if i.endswith(".jpg")
]

fused_list = [
    (rgb_path, ir_path, get_id_from_path(rgb_path))
    for (rgb_path, ir_path) in zip(rgb_list, ir_list)
]

# inference one rgb thermal image pair and visualize the results
rgb_path, ir_path, label = fused_list[5]
print("rgb_path:", rgb_path)
print("ir_path:", ir_path)
print("label:", label)

rgb_img = Image.open(rgb_path)
ir_img = Image.open(ir_path)

# Load the rgb classification model
rgb_model_file = "../weights/rgb_resenet18_epoch-5_full_model.pth"
rgb_model = torch.load(rgb_model_file, map_location=torch.device("cpu"))

# Load the thermal classification model
thermal_model_file = "../weights/thermal_resenet18_epoch-5_full_model.pth"
thermal_model = torch.load(thermal_model_file, map_location=torch.device("cpu"))


class_names = ["NN", "YN", "YY"]
data_transforms = {
    "val": transforms.Compose(
        [
            transforms.Resize(256),
            transforms.CenterCrop(224),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ]
    ),
}


rgb_label, ir_label = inference_rgb_ir_frames(
    rgb_model, thermal_model, data_transforms, class_names, rgb_img, ir_img
)

fused_label = fuse_rgb_thermal_labels(rgb_label, ir_label)

print("rgb predicted label:", rgb_label)
print("ir predicted label:", ir_label)

# visualize the results
rgb_img = np.array(Image.open(rgb_path))
ir_img = np.array(Image.open(ir_path))

fig, ax = plt.subplots(1, 2, figsize=(10, 5))
ax[0].imshow(rgb_img)
ax[0].set_title(f"RGB Image: {rgb_label}")
ax[1].imshow(ir_img)
ax[1].set_title(f"Thermal Image: {ir_label}")
fig.suptitle(f"Fused Label: {fused_label}")
plt.show()
