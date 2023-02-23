import {createContext} from "react";


interface DataContext {
    noMetaData: boolean | null;
    setNoMetaData: (val:boolean) => void;
}

const DefaultDataContext: DataContext = {
    noMetaData: null,
    setNoMetaData: () => null
}

export const DataProvider = createContext<DataContext>(DefaultDataContext)