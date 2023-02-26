import {FC, useContext, useEffect} from 'react';
import {Props, gridstyle} from '../../Common/styles';
import {DataProvider} from '../DataProvider';
import GoogleMapReact from 'google-map-react';
import {Marker} from './Marker';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Severity, Status, HotSpot } from '../../Common/types';

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

interface GoogleMapsPos {
    center: {
        lat: number,
        lng: number
    },
    zoom:number
}

const torontoHotSpots: HotSpot[] = [
    {
        id: 1,
        pathID: 1,
        lat: 43.70954790,
        lng: -79.47999730,
        date: new Date().toISOString().slice(0, 10),
        irPath: 'dummy',
        rbgPath: 'dummy',
        isHotSpot: true,
        severity: Severity.Fire,
        status: Status.NotViewed
    }, 
    {
        id: 2,
        pathID: 1,
        lat:  43.70952730,
        lng: -79.48999860,
        date: new Date().toISOString().slice(0, 10),
        irPath: 'dummy',
        rbgPath: 'dummy',
        isHotSpot: false,
        severity: Severity.NoFire,
        status: Status.NotViewed
    }, 
]


const waterlooHotSpots: HotSpot[] = [
    {
        id: 3,
        pathID: 2,
        lat:  43.4680,
        lng: -80.5373,
        date: new Date().toISOString().slice(0, 10),
        irPath: 'dummy',
        rbgPath: 'dummy',
        isHotSpot: false,
        severity: Severity.NoFire,
        status: Status.NotViewed
    }, 
]


export const HotSpotMap:FC<Props> = ({style}) => {

    // 
    const apiKey = "AIzaSyAMBFWt_-_0DA-w8Qkaj2SlTzPSGLg876I";
    const {pathHotSpots, paths, setPathID, pathID, setPathHotSpots, setHotSpot} = useContext(DataProvider);


    // GET REQUEST: to get the hotspots for the path selected
    useEffect(() => {
        if (pathID === 1) {
            setPathHotSpots(torontoHotSpots);
        } else if (pathID === 2) {
            setPathHotSpots(waterlooHotSpots);
        }
    }, [pathID])

    const onPathSelection = (event:any) => {
        const newPathID = Number(event.target.value);
        if (newPathID !== pathID) {
            setPathID(newPathID);
            setHotSpot(null);
        }
    }


    let defaultProps:GoogleMapsPos = {
        center: {
        lat: 43.70954790,
        lng: -79.45999730
        },
        zoom: 14
    };

    if (pathHotSpots !== null && pathHotSpots.length > 0) {
        defaultProps = {
            center: {
            lat: pathHotSpots[0].lat,
            lng: pathHotSpots[0].lng
            },
            zoom: 14
        };    
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
                <select onChange={onPathSelection}>
                    <option value={-1}> Select Path</option>
                    {paths !== null && paths?.map(({id, name}) => (
                        <option value={id}> {name} </option>
                    ))}
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
                    defaultCenter={defaultProps.center}
                    defaultZoom={defaultProps.zoom}
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