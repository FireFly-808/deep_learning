import {FC, useContext} from 'react';
import {elementStyle, Props, gridstyle} from '../../Common/styles';
import {Waypoint} from '../../Common/types';
import {DataProvider} from '../DataProvider';
import GoogleMapReact from 'google-map-react';
import {Marker} from './Marker';
import RefreshIcon from '@mui/icons-material/Refresh';

const area = {
    refreshButton: 'refreshButton',
    map: 'map'
}

const MapStyle:React.CSSProperties = {
    ...gridstyle,
    padding: '5px',
    gridTemplate: `
    " ${area.refreshButton}  " 0.10fr
    " ${area.map}           " auto
    `
}

export const HotSpotMap:FC<Props> = ({style}) => {

    const apiKey = "AIzaSyAMBFWt_-_0DA-w8Qkaj2SlTzPSGLg876I"
    const waypoints: Waypoint[] = [
        {'lat': 43.70954790, 'lng': -79.47999730}, 
        {'lat': 43.70952730, 'lng': -79.48999860}, 
        {'lat': 43.70942840, 'lng': -79.46000500}, 
        {'lat': 43.70932950, 'lng': -79.45001130}]

    const defaultProps = {
        center: {
          lat: 43.70954790,
          lng: -79.45999730
        },
        zoom: 14
      };

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
                    justifyContent: 'end',
                    paddingRight: '3%',
                    paddingBottom: '10px'
                }}
            >
                <button style={{
                    width: '10%',
                    height: '50%',
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
                    {waypoints.map(({lat, lng}) => (
                        <Marker lat={lat} lng={lng}/>
                    ))
                    }
                </GoogleMapReact>
            </div>
        </div>
    )
}