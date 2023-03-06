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

# Here, our goal is to load both the rgb classification model, and the thermal classification model
# Our input will be an rgb and thermal image pair (we will assume that the images are already aligned)

# We will then use the rgb classification model to classify the rgb image,
# and the thermal classification model to classify the thermal image

# We will then fuse the output labels for the rgb and thermal images to get a final output label


def get_id_from_path(path):
    base = os.path.basename(path)
    og_filename, extension = os.path.splitext(base)
    id = og_filename.split(" ")[-1]
    id = re.sub(r"[()]", "", id)
    return int(id)


# Load the rgb and thermal image pairs
base_dir = "/home/umar/Pictures/datasets/FLAME2/"

rgb_base_dir = os.path.join(base_dir, "RGB", "test")
ir_base_dir = os.path.join(base_dir, "Thermal", "test")

rgb_list = []
ir_list = []
for root, dirs, files in os.walk(rgb_base_dir):
    for file in files:
        if file.endswith(".jpg"):
            rgb_list.append(os.path.join(root, file))
for root, dirs, files in os.walk(ir_base_dir):
    for file in files:
        if file.endswith(".jpg"):
            ir_list.append(os.path.join(root, file))

rgb_list.sort(key=get_id_from_path)
ir_list.sort(key=get_id_from_path)


def find_rgb_thermal_with_matching_ids(rgb_list, ir_list):
    rgb_thermal_list = []
    for rgb_path in rgb_list:
        rgb_id = get_id_from_path(rgb_path)
        for ir_path in ir_list:
            ir_id = get_id_from_path(ir_path)
            if rgb_id == ir_id:
                label = rgb_path.split("/")[-2]
                rgb_thermal_list.append((rgb_path, ir_path, label))
    return rgb_thermal_list


fused_list = find_rgb_thermal_with_matching_ids(rgb_list, ir_list)

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
