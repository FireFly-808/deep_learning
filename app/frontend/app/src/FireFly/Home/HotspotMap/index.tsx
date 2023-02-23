import {FC, useContext} from 'react';
import {elementStyle, Props} from '../../Common/styles';
import {DataProvider} from '../DataProvider';

export const HotSpotMap:FC<Props> = ({style}) => {

    const {noMetaData, setNoMetaData} = useContext(DataProvider)

    return (
        <div
            style={{
                ...style,
                ...elementStyle,
                padding: '15px',
            }}
        >
            <div>
                <h1 style={{
                    margin: 0,
                }}>
                    Hot spot map goes here
                </h1>
                <button onClick={() => setNoMetaData(!noMetaData)}>
                    Toggle MetaData
                </button>
            </div>
        </div>
    )
}