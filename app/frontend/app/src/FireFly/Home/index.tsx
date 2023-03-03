import {FC, useState, useEffect} from 'react';
import {Props} from '../Common/styles';
import {DataProvider} from './DataProvider';
import {Path, HotSpot, isPathArray, isPath} from '../Common/types'
import {FireData} from './FireData';

export const Home:FC<Props> = ({style}) => {

    const [noMetaData, setNoMetaData] = useState<boolean>(true);
    const [pathHotSpots, setPathHotSpots] = useState<HotSpot[] | null>(null);
    const [hotSpot, setHotSpot] = useState<HotSpot | null>(null);
    const defpaths: Path[] = [
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
    // useEffect(() => {
    //     const getPaths = async () => {
    //         const endpoint = 'http://127.0.0.1:8000/api/server/get_distinct_path_ids/';
    //         const data = await(await fetch(endpoint)).json();

    //         if (isPathArray(data)) {
    //             return data;
    //         } else {
    //             console.log("not a path", data)
    //             return null;
    //         }
    //     }

    //     getPaths()
    //     .then(paths => {
    //         if (typeof paths === 'undefined' || paths === null) {
    //             setPaths(null);
    //         } else {
    //             setPaths(paths);
    //         }
    //     })
    // }, [])

    // States & hooks for setting pathes and selected path
    const [pathID, setPathID] = useState<number | null>(null);
    const [paths, setPaths] = useState<Path[] | null>(defpaths);

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

  