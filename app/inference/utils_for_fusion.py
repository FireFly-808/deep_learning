import numpy as np

def inference_rgb_ir_frames(
    rgb_model, thermal_model, data_transforms, class_names, rgb_img, ir_img
):
    """
    It takes in a RGB and IR image, transforms them, passes them through the RGB and IR models, and
    returns the predicted labels
    
    :param rgb_model: The loaded RGB model that we trained in the previous section
    :param thermal_model: The loaded ir model that will be used to classify the thermal image
    :param data_transforms: This is a dictionary of the transforms that we used to train the model
    :param class_names: A list of the class names in the dataset
    :param rgb_img: RGB image that we want to classify as np array
    :param ir_img: The thermal image that we want to classify as np array
    :return: the output of the model, the label of the output, and the label of the output.
    """
    rgb_img = data_transforms["val"](rgb_img)
    ir_img = data_transforms["val"](ir_img)

    rgb_img = rgb_img.unsqueeze(0)
    ir_img = ir_img.unsqueeze(0)

    rgb_img = rgb_img.float()
    ir_img = ir_img.float()

    rgb_model.eval()
    thermal_model.eval()

    rgb_output = rgb_model(rgb_img)
    ir_output = thermal_model(ir_img)

    rgb_output = rgb_output.detach().numpy()
    ir_output = ir_output.detach().numpy()

    rgb_output = np.argmax(rgb_output, axis=1)
    ir_output = np.argmax(ir_output, axis=1)

    rgb_label = str(class_names[rgb_output[0]])
    ir_label = str(class_names[ir_output[0]])
    return rgb_label, ir_label


def fuse_rgb_thermal_labels(rgb_label, ir_label):
    """
    If either label is "YY", then the fused label is "YY". Otherwise, if either label is "YN", then the
    fused label is "YN". Otherwise, the fused label is "NN"
    
    :param rgb_label: The label for the RGB image
    :param ir_label: the label for the thermal image
    :return: the fused label.
    """
    if rgb_label == "NN" and ir_label == "NN":
        return "NN"
    elif rgb_label == "NN" and ir_label == "YN":
        return "YN"
    elif rgb_label == "NN" and ir_label == "YY":
        return "YY"
    elif rgb_label == "YN" and ir_label == "NN":
        return "YN"
    elif rgb_label == "YN" and ir_label == "YN":
        return "YN"
    elif rgb_label == "YN" and ir_label == "YY":
        return "YY"
    elif rgb_label == "YY" and ir_label == "NN":
        return "YY"
    elif rgb_label == "YY" and ir_label == "YN":
        return "YY"
    elif rgb_label == "YY" and ir_label == "YY":
        return "YY"
    else:
        raise ValueError("Invalid labels")