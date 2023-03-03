import {FC, useContext, useEffect} from 'react';
import {Props, gridstyle} from '../../Common/styles';
import {DataProvider} from '../DataProvider';
import GoogleMapReact from 'google-map-react';
import {Marker} from './Marker';
import RefreshIcon from '@mui/icons-material/Refresh';
import {isHotSpotArray} from '../../Common/types';
import {onHover, onHoverLeave} from '../../Common/button';

const area = {
    pathSelection: 'pathSelection',
    refreshButton: 'refreshButton',
    map: 'map'
}

const MapStyle:React.CSSProperties = {
    ...gridstyle,
    margin: '7px',
    gridTemplate: `
    " .           ${area.pathSelection} ${area.refreshButton}  " 0.05fr
    " ${area.map} ${area.map}           ${area.map}           " auto
    / auto        0.20fr                0.10fr`
}

// Custom interface to determine default view of google maps
interface GoogleMapsPos {
    center: {
        lat: number,
        lng: number
    },
    zoom:number
}


export const HotSpotMap:FC<Props> = ({style}) => {
    
    const apiKey = "AIzaSyAMBFWt_-_0DA-w8Qkaj2SlTzPSGLg876I";
    const {pathHotSpots, paths, setPathID, pathID, setPathHotSpots, setHotSpot} = useContext(DataProvider);

    // Default center of google maps if path is not selected
    let defaultProps:GoogleMapsPos = {
        center: {
        lat: 43.70954790,
        lng: -79.45999730
        },
        zoom: 13
    };

    // If path is selected, center google maps around the first hotspot
    if (pathHotSpots !== null && pathHotSpots.length > 0) {
        defaultProps = {
            center: {
            lat: pathHotSpots[0].lat,
            lng: pathHotSpots[0].lng
            },
            zoom: 13
        };    
    }

    // Get request to get all new hotspot data
    const getPathHotSpots = async () => {
        if (pathID !== null) {
            const endpoint = `http://127.0.0.1:8000/api/server/get_locations_data_by_path/?path_id=${pathID}`
            const data = await(await fetch(endpoint)).json()
            
            // Use typeguard to check if data is a valid response
            if (isHotSpotArray(data)) {
                return data;
            } else {
                return null;
            }
        }
    }

    // Runs everytime component rerenders
    useEffect(() => {
        getPathHotSpots()
        .then((newHotSpots) => {
            if (typeof newHotSpots === 'undefined' || newHotSpots === null) {
                setPathHotSpots(null);
            } else {
                setPathHotSpots(newHotSpots);
            }
        })
    })

    // Refresh button callback
    const refreshCallback = () => {
        getPathHotSpots()
        .then((newHotSpots) => {
            if (typeof newHotSpots === 'undefined' || newHotSpots === null) {
                setPathHotSpots(null);
            } else {
                setPathHotSpots(newHotSpots);
            }
        })
    }

    // On selecting a path from the drop down button menu, change the pathID & reset selected hotspot.
    const onPathSelection = (event:any) => {
        const newPathID = Number(event.target.value);
        if (newPathID !== pathID) {
            setPathID(newPathID);
            setHotSpot(null);
        }
    }

    return (
        <div
            style={{
                ...style,
                ...MapStyle,
            }}
        >
            <div
                style={{
                    gridArea: area.refreshButton,
                    display: 'flex',
                    alignItems: 'end',
                    justifyContent: 'center',
                    margin: '5px',
                }}
            >
                <button style={{
                    fontSize: "100px !important",
                    background: 'transparent',
                    border: 0,
                    padding: 0,
                    color: '#b8b7ad',
                    cursor: 'pointer'
                }}
                onMouseEnter={onHover}
                onMouseLeave={onHoverLeave}
                onClick={refreshCallback}
                >
                    <RefreshIcon/>
                </button>
            </div>
            <div style={{
                gridArea: area.pathSelection,
                display: 'flex',
                justifyContent: 'end',
                alignItems: 'end',
                margin: '10px'
            }}>
                <select style={{
                    background: 'rgb(49,52,55)',
                    borderRadius: '45px',
                    color: '#b8b7ad',
                    cursor: 'pointer',
                    border: 0,
                    textAlign: 'center',
                    width: '80%',
                    height: '90%',
                    boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)'
                }}
                onChange={onPathSelection}
                onMouseEnter={onHover}
                onMouseLeave={onHoverLeave}
                >
                    <option value={-1}> Select Path</option>
                    {paths !== null && paths?.map(({id, name}) => {
                        if (id === pathID) {
                            return <option value={id} selected> {name} </option>
                        }
                        return <option value={id}> {name} </option>
                    })}
                </select>
            </div>
            <div
                style={{
                    margin: '0 auto',
                    gridArea: area.map,
                    height: '95%',
                    width: '95%',
                }}
            >
                <GoogleMapReact
                    bootstrapURLKeys={{key: apiKey}}
                    center={defaultProps.center}
                    zoom={defaultProps.zoom}
                >
                    {pathHotSpots !== null && pathHotSpots.map((hotSpot) => (
                        <Marker lat={hotSpot.lat} lng={hotSpot.lng} hotSpot={hotSpot}/>
                    ))
                    }
                </GoogleMapReact>
            </div>
        </div>
    )
}