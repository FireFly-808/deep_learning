import {FC} from 'react';
import {gridstyle, Props} from '../Common/styles';

export const Header: FC<Props> = ({style}) => {
    return (
        <h1 style={{
            ...gridstyle,
            ...style,
        }}>
            FireFly
        </h1>
    )
}