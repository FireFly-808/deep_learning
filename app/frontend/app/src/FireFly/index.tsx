import {Header} from './Header';
import {MetaDataTable} from './MetaDataTable';
import {HotSpotMap} from './HotspotMap';

const area = {
    header: 'header',
    metadataTable: 'metadataTable',
    hotspotMap: 'hotspotMap'
};

const style = {
    display: 'grid',
    width: '100vw',
    height: '100vh',
    gridTemplate: `
    " ${area.header}        ${area.header}     " 0.10fr
    " ${area.metadataTable} ${area.hotspotMap} " 1fr
    / 0.4fr                 1fr`
};

export const FireFly = () => {
    return(
    <div style={style}>
        <Header style={{gridArea: area.header}} />
        <MetaDataTable style={{gridArea: area.metadataTable}} />
        <HotSpotMap style={{gridArea: area.hotspotMap}} />
    </div>
    );
}

  