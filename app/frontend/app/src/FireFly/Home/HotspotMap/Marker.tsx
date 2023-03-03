import {FC, useContext, useState} from 'react';
import PlaceIcon from '@mui/icons-material/Place';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import {DataProvider} from "../DataProvider";
import {HotSpot} from '../../Common/types';

interface MarkerProps {
    lat: number,
    lng: number,
    hotSpot: HotSpot
}

export const Marker:FC<MarkerProps> = ({lat, lng, hotSpot}) => {

    // Get requried hooks from data provider
    const {setNoMetaData, setHotSpot, noMetaData} = useContext(DataProvider);

    // state to display hover information
    const [hoverOn, setHoverOn] = useState<boolean>(false);

    // Open up metadata with this selected hotspot data
    const handleLocationClick = () => {
        if (noMetaData) {
            setNoMetaData(false);
        }
        setHotSpot(hotSpot)
    }

    const location = `Geolocation: ${hotSpot.lat.toFixed(3)}°, ${hotSpot.lng.toFixed(3)}°`;
    const status = `Status: ${hotSpot.status}`;

    return (
        <div>
            <button style={{
                display: 'flex',
                background: 'transparent',
                border: 0,
                cursor: 'pointer'
            }} 
            onClick={handleLocationClick}
            onMouseEnter={() => setHoverOn(true)}
            onMouseLeave={() => setHoverOn(false)}
            >
                {hotSpot.is_hotspot ? <LocalFireDepartmentIcon style={{color:'red'}}/> : <PlaceIcon/>}
            </button>
            {hoverOn && 
                <div style={{
                    width: '180px',
                    height: '30px',
                    backgroundColor: 'beige',
                    margin: 0,
                    padding: 0,
                    border: '2px solid black',
                }}
                >
                    <text style={{color:'black', fontWeight: 'bold'}}>
                        {location}<br/>
                        {status}<br/>
                    </text>
                </div>}
        </div>
    )
} 