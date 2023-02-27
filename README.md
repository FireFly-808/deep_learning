# FireFly App Requirements:


# <u> Frontend: </u>

Run the frontend application with the following command:

`cd app/frontend/app && npm install && npm start`

### <b> Next Steps </B>:

Map with preview of waypoints.

Maps preview with waypoints as selectable spots which fills in the side window with the respective data.

Side Window when spot selected:
- [X] RGB photo
- [X] IR Photo
- [X] date, time, location (lat, long)
- [X] Severity
- [ ] Selectable status (confirmation modal) Setting status should change the status on map and metadata table
- [X] Status of hotspot (not viewed, viewed, visited, dismissed)


Stretch Goals:
- [x] Make the side window dynamic rather than static
- [ ] Get waypoints for a specific time period (specified dates)

# <u> Backend: </u>

Application running on AWS that has 2 endpoints:
1) receive image, save, process, and log in database (called by rpi on drone)
2) give image from db (called by client app)

### <b> Steps </B>:
- [x] Setup docker and database
- [x] Make models for db tables
- [x] Make endpoint add_record (drone->server)
- [x] Make endpoint get_list_of_locations (webapp->server)
- [x] Make endpoint get_record_details (webapp->server)
- [x] Make endpoint update_status (webapp->server)
- [ ] Deploy to aws/gcp


# <u> Deep Learning: </u>
This endpoint works with the backend to periodically check for unprocessed images and processes them.

### <b> Current Status </B>:
Locally running ResNet34 detector trained on google images of wildfires.
This can classify the whole image as fire or not along with a confidence score.

### <b> Next Steps </B>:
- [ ] Extract bounding box from output to then draw it on image
- [ ] Explore detector models that fuse ir and rgb and compare their performance.

### <b> Notes </B>:

How the backend and deep learning endpoints will communicate to process images:

*Endpoints: BE = Back End, FE = Front End, DL = Deep Learning.
1. DL sends BE a GET req every 10 minutes, to check if there are images to classify.
2. BE sends DL a GET req, returning a list of ids corresponding to database records
    (of the images) that need to be classified.
3. DL loops through the ids and for each ID, sends BE a GET req for the image data.
4. BE sends DL a GET req, with the image data (as png, jpg, etc.).
5. DL classifies the image and packages the results (painted image(s) + metadata).
6. DL sends BE a GET req, then with the results of the classification, BE modifies DB.

# <u> Drone Data Collection: </u>
NECESSARY CHANGES:
- [ ] Change drone script to poll for a wifi connection when done collecting images
- [ ] Images should be saved as jpegs on drone
- [ ] When wifi connection is established, drone calls endpoint for each image to send over (instead of packaging all images into one POST payload)
- [ ] Sockets will not be used anymore

Drone to server code can be found under `drone/data_collection`

`drone/data_collection/raspberry_pi.py` is the script that is run on the raspberry pi on the drone and captures RGB and IR images while it is doing its roundtrip. After completing its roundtrip, it will poll for a connection with the server and will send the new data once connected.

Server to db code can be found under `drone/server`

`drone/server/threshold_detect.py` is a preprocessing script that is designed to perform fire detection on the IR & RGB images classifying the severity levels of the fires detected if any.

`drone/server/uploadNewData.py` is a script that is constantly polling for a connection from the drone. Once connected, it will recieve the new data captured by the drone during its latest roundtrip and classify the data using our preprocessing script. After the preprocessing has been completed, this data will be sent to our backend server via POST request which will then add it to our MySQL (or POSTGRES) database.

### <b> Next Steps </B>:

- [ ] review rpi data collection script and make sure its not buggy
- [ ] uploadNewData currently hardcoded for 5 pics, have to change to num waypoints later

Threshold/fire_detection stuff:

# <u> DB Schema </u>

gonna upload pic of our schema
