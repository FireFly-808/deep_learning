import {FC} from 'react';
import {gridstyle, Props} from '../Common/styles';

export const HotSpotMap:FC<Props> = ({style}) => {
    return (
        <h1 style={{
            ...style,
            ...gridstyle,
            border: '1.5px solid black',
            borderBottom: '0',
            borderRight: '0',
        }}>
            Hot spot map goes here
        </h1>
    )
}