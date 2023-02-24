import {FC, useContext} from 'react';
import PlaceIcon from '@mui/icons-material/Place';
import {DataProvider} from "../DataProvider";

interface MarkerInterface {
    lat: number
    lng: number
}

export const Marker:FC<MarkerInterface> = ({lat, lng}) => {

    const {setNoMetaData, setLat, setLng, noMetaData} = useContext(DataProvider)

    const handleLocationClick = () => {
        if (lat !== null && lng !== null) {
            setLat(lat);
            setLng(lng);
        }
        if (noMetaData) {
            setNoMetaData(false);
        }
    }

    return (
        <div>
            <button style={{
                display: 'flex',
                background: 'transparent',
                border: 0,
                cursor: 'pointer'
            }} onClick={handleLocationClick}>
                <PlaceIcon/>
            </button>
        </div>
    )
} 