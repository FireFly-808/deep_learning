import {MetaDataTable} from './MetaDataTable';
import {HotSpotMap} from './HotspotMap';
import {FC} from 'react';
import {gridstyle, Props} from '../Common/styles';

const area = {
    map: 'map',
    metadata: 'metadata',
};

const homeStyle:React.CSSProperties = {
    ...gridstyle,
    gridTemplate: `
    " ${area.metadata} ${area.map} " auto
    / 0.4fr       1fr `
};

export const Home:FC<Props> = ({style}) => {
    return(
    <div style={{
        ...style,
        ...homeStyle,
    }}>
        <MetaDataTable style={{gridArea: area.metadata}} />
        <HotSpotMap style={{gridArea: area.map}} />
    </div>
    );
}

  