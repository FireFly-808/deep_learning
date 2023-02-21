import {FC} from 'react';
import {elementStyle, Props} from '../../Common/styles';

export const HotSpotMap:FC<Props> = ({style}) => {
    return (
        <h1 style={{
            ...style,
            ...elementStyle,
            margin: 0,
            border: '1.5px solid black',
            borderBottom: '0',
            borderRight: '0',
        }}>
            Hot spot map goes here
        </h1>
    )
}