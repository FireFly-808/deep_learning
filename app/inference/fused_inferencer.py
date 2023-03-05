import torch
import numpy as np
from torchvision import transforms
from utils_for_fusion import inference_rgb_ir_frames, fuse_rgb_thermal_labels

# Model paths
rgb_model_file = "../weights/rgb_resenet18_epoch-5_full_model.pth"
thermal_model_file = "../weights/thermal_resenet18_epoch-5_full_model.pth"

# Load model weights
rgb_model = torch.load(rgb_model_file, map_location=torch.device("cpu"))
thermal_model = torch.load(thermal_model_file, map_location=torch.device("cpu"))

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

# Mapping class names to output labels (0, 1, 2)
class_names = ["NN", "YN", "YY"]

rgb_label, ir_label = inference_rgb_ir_frames(
    rgb_model, thermal_model, data_transforms, class_names, rgb_img, ir_img
)

fused_label = fuse_rgb_thermal_labels(rgb_label, ir_label)
