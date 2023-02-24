import {createContext} from "react";


interface DataContext {
    noMetaData: boolean | null;
    lat: number | null,
    lng: number | null,
    setNoMetaData: (val:boolean) => void,
    setLat: (lat: number) => void,
    setLng: (lng: number) => void,
}

const DefaultDataContext: DataContext = {
    noMetaData: null,
    lat: null,
    lng: null,
    setNoMetaData: () => null,
    setLat: () => null,
    setLng: () => null
}

export const DataProvider = createContext<DataContext>(DefaultDataContext)