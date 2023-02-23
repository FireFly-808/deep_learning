# FireFly App Requirements:


# <u> Frontend: </u>

Run the frontend application with the following command:

`cd app/frontend/app && npm install && npm start`

### <b> Next Steps </B>:

Map with preview of waypoints.

Maps preview with waypoints as selectable spots which fills in the side window with the respective data.

Side Window when spot selected:
- [ ] RGB photo
- [ ] IR Photo
- [ ] date, time, location (lat, long)
- [ ] Severity
- [ ] Selectable status (confirmation modal) Setting status should change the status on map and metadata table
- [ ] Status of hotspot (not viewed, viewed, visited, dismissed)


Stretch Goals:
- [ ] Make the side window dynamic rather than static
- [ ] Get waypoints for a specific time period (specified dates)

# <u> Backend: </u>

Please add requirements (summarize endpoints offered by backend server)

### <b> Next Steps </B>:


# <u> Drone Data Collection: </u>

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
