import {createContext} from "react";
import {Path, HotSpot} from "../Common/types";

interface DataContext {
    paths: Path[] | null,
    pathHotSpots: HotSpot[] | null,
    pathID: number | null,
    hotSpot: HotSpot | null,
    noMetaData: boolean | null,
    setPathID: (val:number | null) => void,
    setHotSpot: (val: HotSpot | null) => void,
    setPathHotSpots: (val: HotSpot[] | null) => void,
    setNoMetaData: (val:boolean) => void,
}

const DefaultDataContext: DataContext = {
    noMetaData: null,
    paths: null,
    pathHotSpots: null,
    pathID: null,
    hotSpot: null,
    setPathID: () => null,
    setHotSpot: () => null,
    setPathHotSpots: () => null,
    setNoMetaData: () => null,
}

export const DataProvider = createContext<DataContext>(DefaultDataContext)