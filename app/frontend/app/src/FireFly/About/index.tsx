import {FC} from "react"
import {Props, gridstyle} from '../Common/styles';

export const About:FC<Props> = ({style}) => {
    return <h1 style={{
        ...gridstyle,
        ...style
    }}>About FireFly</h1>
} 