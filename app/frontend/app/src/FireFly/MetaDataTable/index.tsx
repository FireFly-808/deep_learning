import {FC} from 'react';
import {gridstyle, Props} from '../Common/styles';

export const MetaDataTable:FC<Props> = ({style}) => {
    return (
        <h1 style={{
            ...style,
            ...gridstyle,
            border: '1.5px solid black',
            borderBottom: '0',
            borderLeft: '0',
        }}>
            Metadata table goes here
        </h1>
    )
}