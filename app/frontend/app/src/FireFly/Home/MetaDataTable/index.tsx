import {FC, useContext} from 'react';
import {gridstyle, elementStyle, Props} from '../../Common/styles';
import {Severity, Status} from '../../Common/types';
import CloseIcon from '@mui/icons-material/Close';
import {DataProvider} from '../DataProvider';

const area = {
    refresh: 'refresh',
    location: 'location',
    closeButton: 'closeButton',
    date: 'date',
    severity: 'severity',
    status: 'status',
    setStatusModal: 'setStatusModal',
    photos: 'photos',
}

const MDTable:React.CSSProperties = {
    ...gridstyle,
    borderRight: '7px solid black',
    borderRadius: '25px',
    padding: '5px',
    gridTemplate: `
    " .                ${area.closeButton}    " 0.10fr
    " ${area.location} ${area.location}       " 0.10fr
    " ${area.date}     ${area.date}           " 0.10fr
    " ${area.severity} ${area.severity}       " 0.10fr
    " ${area.status}   ${area.setStatusModal} " 0.10fr
    " ${area.photos} ${area.photos}       " auto
    / 1fr              0.5fr`
}

export const MetaDataTable:FC<Props> = ({style}) => {
    const {setNoMetaData, lat, lng} = useContext(DataProvider);
    const date = new Date().toISOString().slice(0, 10);
    const status:Status = Status.NotViewed;
    const severity:Severity = Severity.NoFire;

    const onHover = (e: any) => {
        e.target.style.color = 'white'
    }

    const onHoverLeave = (e: any) => {
        e.target.style.color = '#b8b7ad'
    }

    return (
        <div
            style={{
                ...style,
                ...MDTable
            }}
        >
            <div
                style={{
                    gridArea: area.closeButton,
                    display: 'flex',
                    justifyContent: 'end',
                    alignContent: 'center',
                    padding: '5px',
                    
                }}
            >
                <button style={{
                    background: 'transparent',
                    border: 0,
                    padding: 0,
                    color: '#b8b7ad',
                    cursor: 'pointer'
                }} onClick={() => setNoMetaData(true)} onMouseEnter={onHover} onMouseLeave={onHoverLeave}>
                    <CloseIcon/>
                </button>
            </div>
            <h2 style={{gridArea: area.location}}>
                {"Latitude, Longitude: " + lat + ", " + lng}
            </h2>

            <h2 style={{gridArea: area.date}}>
                {"Date of Picture: " + date}
            </h2>

            <h2 style={{gridArea: area.severity}}> 
                {"Severity of Fire: " + severity}
            </h2>

            <h2 style={{gridArea: area.status}}>
                {"Status: " + status}
            </h2>
            <div
                style={{
                    gridArea: area.setStatusModal,
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                    padding: '5px'
                }}
            >
                <button 
                    style={{
                        width: '100%',
                        height: '65%',
                        background: '#22272e',
                        borderRadius: '10px',
                        padding: 0,
                        color: '#b8b7ad',
                        cursor: 'pointer'
                    }}
                >
                    {"Set Status"}
                </button>
            </div>
            <div
                style={{
                    gridArea:area.photos,
                }}
            >
                <h2>RGB Photo:</h2>
                <div 
                    style={{
                    ...elementStyle
                    }}
                >
                    <img 
                        style={{
                            width: '75%',
                            height: '65%',
                        }} 
                        src={'picture1.png'} alt=''
                    />
                </div>
                <h2>IR Photo:</h2>
                <div 
                    style={{
                    ...elementStyle
                    }}
                >
                    <img 
                        style={{
                            width: '75%',
                            height: '75%',
                        }} 
                        src={'picture1.png'} alt=''
                    />
                </div>
            </div>
        </div>
    )
}