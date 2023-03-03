import torch
import time
import matplotlib.pyplot as plt

from utils import (
    get_image_file_paths,
    load_img_from_path,
    pad_numpy_img_till_dims_by_32,
    inference_flame_model,
    overlay_mask_on_image,
)

if __name__ == "__main__":
    # Get the file paths to the test images
    file_paths = get_image_file_paths("../datasets/random_test_imgs")
    file_path = file_paths[0]

    # Load the model
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model_file = "../weights/FLAME-Unet-Mobilenet-AdamW-class2-epoch15-batch3.pt"
    if device == "cuda":
        model = torch.load(model_file)
    else:
        model = torch.load(model_file, map_location=torch.device("cpu"))
    model.eval()
    model.to(device)

    output_imgs = []
    start_time = time.time()
    for file_path in file_paths:
        # Inference and visualize a single image from the above list of file paths
        og_img = load_img_from_path(file_path)
        img = pad_numpy_img_till_dims_by_32(og_img)

        pred_mask = inference_flame_model(model, device, img)
        pred_mask = pred_mask.numpy()

        # crop the mask to the original image size
        pred_mask = pred_mask[0 : og_img.shape[0], 0 : og_img.shape[1]]

        output_imgs.append(overlay_mask_on_image(og_img, pred_mask))
    end_tmie = time.time()
    print(
        f"Average Time taken for inference per image: {(end_tmie - start_time) / len(file_paths)}"
    )
    # Plot a grid of the 6 output images using matplotlib
    fig, axs = plt.subplots(2, 3, figsize=(20, 10))
    for i in range(2):
        for j in range(3):
            axs[i, j].imshow(output_imgs[i * 3 + j])
            # add a title based on the filepath to each image
            axs[i, j].set_title(file_paths[i * 3 + j].split("/")[-1])
            axs[i, j].axis("off")

    plt.show()
