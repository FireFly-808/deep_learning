import {FC, useState, useEffect} from 'react';
import {gridstyle, Props} from '../Common/styles';
import {DataProvider} from './DataProvider';
import {Path, HotSpot} from '../Common/types'
import {FireData} from './FireData';

const area = {
    map: 'map',
    metadata: 'metadata',
};

const defaultStyle:React.CSSProperties = {
    ...gridstyle,
    gridTemplate: `
    " ${area.map} ${area.map} " auto
    / 0.4fr       1fr `
};

const metaDataStyle:React.CSSProperties = {
    ...gridstyle,
    gridTemplate: `
    " ${area.metadata} ${area.map} " auto
    / 0.4fr       1fr `
};


export const Home:FC<Props> = ({style}) => {

    const [noMetaData, setNoMetaData] = useState<boolean>(true);
    const [pathHotSpots, setPathHotSpots] = useState<HotSpot[] | null>(null);
    const [hotSpot, setHotSpot] = useState<HotSpot | null>(null);
    const paths: Path[] = [
        {
            id: 1,
            name: 'Toronto'
        },
        {
            id: 2,
            name: 'Waterloo'
        }
    ]
    // GET REQUEST: to get paths from the server
    // Wrap the request to get all paths in a useEffect since it only needs to run initially and
    // not on every rerender (which happens when noMetaData state changes)
    // useEffect(() => {
    //     console.log("HELLO")
    // }, [])

    const [pathID, setPathID] = useState<number | null>(null);

    return (
        <DataProvider.Provider value={{
            paths: paths,
            pathHotSpots: pathHotSpots,
            pathID: pathID,
            hotSpot: hotSpot,
            noMetaData: noMetaData,
            setPathID: setPathID,
            setHotSpot: setHotSpot,
            setPathHotSpots: setPathHotSpots,
            setNoMetaData: setNoMetaData,
        }}
        >
            <FireData style={style}/>
        </DataProvider.Provider>
        )
}

  