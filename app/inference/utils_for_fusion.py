import cv2
import cmapy
import numpy as np
from scipy import ndimage


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


def _process_raw_image(
    _raw_image,
    _interpolation_index,
    _colormap_index,
    filter_image=False,
):
    """Process the raw temp data to a colored image. Filter if necessary"""
    _colormap_list = [
        "jet",
        "bwr",
        "seismic",
        "coolwarm",
        "PiYG_r",
        "tab10",
        "tab20",
        "gnuplot2",
        "brg",
    ]
    _interpolation_list = [
        cv2.INTER_NEAREST,
        cv2.INTER_LINEAR,
        cv2.INTER_AREA,
        cv2.INTER_CUBIC,
        cv2.INTER_LANCZOS4,
        5,
        6,
    ]

    # Image processing
    # Can't apply colormap before ndimage, so reversed in first two options, even though it seems slower
    if (
        _interpolation_index == 5
    ):  # Scale via scipy only - slowest but seems higher quality
        _image = ndimage.zoom(_raw_image, 25)  # interpolate with scipy
        _image = cv2.applyColorMap(_image, cmapy.cmap(_colormap_list[_colormap_index]))
    elif (
        _interpolation_index == 6
    ):  # Scale partially via scipy and partially via cv2 - mix of speed and quality
        _image = ndimage.zoom(_raw_image, 10)  # interpolate with scipy
        _image = cv2.applyColorMap(_image, cmapy.cmap(_colormap_list[_colormap_index]))
        _image = cv2.resize(_image, (800, 600), interpolation=cv2.INTER_CUBIC)
    else:
        _image = cv2.applyColorMap(
            _raw_image, cmapy.cmap(_colormap_list[_colormap_index])
        )
        _image = cv2.resize(
            _image, (800, 600), interpolation=_interpolation_list[_interpolation_index]
        )
    _image = cv2.flip(_image, 1)
    if filter_image:
        _image = cv2.bilateralFilter(_image, 15, 80, 80)
    return _image


def _c_to_f(temp: float):
    """Convert temperature from C to F"""
    return (9.0 / 5.0) * temp + 32.0


def _add_image_text(
    use_f,
    _image,
    _temp_min,
    _temp_max,
    _interpolation_index,
    _colormap_index,
    filter_image,
):
    _colormap_list = [
        "jet",
        "bwr",
        "seismic",
        "coolwarm",
        "PiYG_r",
        "tab10",
        "tab20",
        "gnuplot2",
        "brg",
    ]
    _interpolation_list_name = [
        "Nearest",
        "Inter Linear",
        "Inter Area",
        "Inter Cubic",
        "Inter Lanczos4",
        "Pure Scipy",
        "Scipy/CV2 Mixed",
    ]
    """Set image text content"""
    if use_f:
        temp_min = _c_to_f(_temp_min)
        temp_max = _c_to_f(_temp_max)
        text = f"Tmin={temp_min:+.1f}F - Tmax={temp_max:+.1f}F - Interpolation: {_interpolation_list_name[_interpolation_index]} - Colormap: {_colormap_list[_colormap_index]} - Filtered: {filter_image}"
    else:
        text = f"Tmin={_temp_min:+.1f}C - Tmax={_temp_max:+.1f}C - Interpolation: {_interpolation_list_name[_interpolation_index]} - Colormap: {_colormap_list[_colormap_index]} - Filtered: {filter_image}"
    cv2.putText(
        _image, text, (30, 18), cv2.FONT_HERSHEY_SIMPLEX, 0.4, (255, 255, 255), 1
    )
    return _image
