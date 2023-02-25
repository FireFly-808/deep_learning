import {FC, useContext} from 'react';
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

    const {setNoMetaData, setHotSpot, noMetaData} = useContext(DataProvider)

    const handleLocationClick = () => {
        if (noMetaData) {
            setNoMetaData(false);
        }
        setHotSpot(hotSpot)
    }

    return (
        <div>
            <button style={{
                display: 'flex',
                background: 'transparent',
                border: 0,
                cursor: 'pointer'
            }} onClick={handleLocationClick}>
                {hotSpot.isHotSpot ? <LocalFireDepartmentIcon style={{color:'red'}}/> : <PlaceIcon/>}
            </button>
        </div>
    )
} 