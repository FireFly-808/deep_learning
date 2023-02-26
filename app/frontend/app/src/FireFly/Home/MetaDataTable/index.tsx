import {FC, useContext, useEffect, useState} from 'react';
import {gridstyle, elementStyle, Props} from '../../Common/styles';
import {Severity, Status} from '../../Common/types';
import CloseIcon from '@mui/icons-material/Close';
import {DataProvider} from '../DataProvider';

const area = {
    closeButton: 'closeButton',
    confirm: 'confirm',
    location: 'location',
    locationVal: 'locationVal',
    date: 'date',
    dateVal: 'dateVal',
    severity: 'severity',
    severityVal: 'severityVal',
    status: 'status',
    statusVal: 'statusVal',
    setStatusModal: 'setStatusModal',
    photos: 'photos',
}

const MDTable:React.CSSProperties = {
    ...gridstyle,
    borderRight: '7px solid black',
    borderRadius: '25px',
    padding: '5px',
    gridTemplate: `
    " .                ${area.closeButton}     ${area.closeButton} " 0.10fr
    " ${area.location} ${area.locationVal}     ${area.locationVal} " 0.10fr
    " ${area.date}     ${area.dateVal}         ${area.dateVal}     " 0.10fr
    " ${area.severity} ${area.severityVal}     ${area.severityVal} " 0.10fr
    " ${area.status}   ${area.statusVal}       ${area.statusVal}   " 0.10fr
    " .                ${area.setStatusModal}  ${area.confirm}     " 40px
    " ${area.photos}   ${area.photos}          ${area.photos}      " auto
    / 0.5fr            0.25fr                  0.25fr              `
}

const textStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'end',
    alignItems: 'center'
    
}

export const MetaDataTable:FC<Props> = ({style}) => {
    const {setNoMetaData, hotSpot} = useContext(DataProvider);
    const [date, setDate] = useState<string>("")
    const [status, setStatus] = useState<Status>(Status.Undefined)
    const [severity, setSeverity] = useState<Severity>(Severity.Undefined);
    const [statusFormVal, setstatusFormVal] = useState<Status>(Status.Undefined)
    const [location, setLocation] = useState<string>("");

    useEffect(() => {
        if (hotSpot !== null) {
            setDate(hotSpot.date);
            setStatus(hotSpot.status);
            setSeverity(hotSpot.severity);
            setLocation(`${hotSpot.lat}°, ${hotSpot.lng}°`)
        } else {
            setDate("");
            setStatus(Status.Undefined);
            setSeverity(Severity.Undefined);
            setLocation("");
        }
    }, [hotSpot])

    const onHover = (e: any) => {
        e.target.style.color = 'white'
    }

    const onHoverLeave = (e: any) => {
        e.target.style.color = '#b8b7ad'
    }

    const onSubmitHover = (e: any) => {
        e.target.style.background = 'rgb(40,122,44,1)'
    }

    const onSubmitHoverLeave = (e: any) => {
        e.target.style.background = 'rgb(49,52,55)'
    }

    const changeStatus = (e: any) => {
        setstatusFormVal(e.target.value);
    }

    const submitStatus = () => {
        setStatus(statusFormVal);
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
                {"Geolocation: "}
            </h2>

            <h3 style={{gridArea: area.locationVal, ...textStyle}}
            >
                {location}
            </h3>

            <h2 style={{gridArea: area.date}}>
                {"Date: "}
            </h2>

            <h3 style={{gridArea: area.dateVal, ...textStyle}}>
                {date}
            </h3>

            <h2 style={{gridArea: area.severity}}> 
                {"Severity: "}
            </h2>

            <h3 style={{gridArea: area.severityVal, ...textStyle}}>
                {severity}
            </h3>

            <h2 style={{gridArea: area.status}}>
                {"Status: "}
            </h2>

            <h3 style={{gridArea: area.statusVal, ...textStyle}}>
                {status}
            </h3>

            <div
                style={{
                    gridArea: area.setStatusModal,
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                }}
            >
                <select 
                    style={{
                        width: '100%',
                        height: '100%',
                        background: 'rgb(49,52,55)',
                        border: 'none',
                        fontWeight: '500',
                        borderRadius: '45px',
                        margin: 4,
                        textAlign: 'center',
                        color: '#b8b7ad',
                        cursor: 'pointer',
                        boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)'
                    }}
                    onChange={changeStatus}
                    onMouseEnter={onHover}
                    onMouseLeave={onHoverLeave}
                >
                    <option value={Status.Undefined}> Select Status </option>
                    <option value={Status.NotViewed}> {Status.NotViewed} </option>
                    <option value={Status.Viewed}> {Status.Viewed} </option>
                    <option value={Status.Dismissed}> {Status.Dismissed} </option>
                    <option value={Status.Visited}> {Status.Visited} </option>
                </select>
            </div>
            <div
                style={{
                    gridArea: area.confirm,
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'center',
                }}
            >
                <button 
                    style={{
                        width: '100%',
                        height: '100%',
                        background: 'rgb(49,52,55)',
                        border: 0,
                        borderRadius: '45px',
                        margin: 4,
                        color: '#b8b7ad',
                        cursor: 'pointer'
                    }}
                    onClick={submitStatus}
                    onMouseEnter={onSubmitHover}
                    onMouseLeave={onSubmitHoverLeave}
                >
                    {"Submit"}
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