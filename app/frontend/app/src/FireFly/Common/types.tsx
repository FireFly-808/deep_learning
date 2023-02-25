// have to change, consult with group lol
export enum Severity {
    SevereFire = "Severe Fire Detected",
    NoFire = "No Fire Detected",
    Fire = "Mild Fire Detected",
    Undefined = "",
}

export enum Status {
    Dismissed = "Dismissed",
    Viewed = "Viewed",
    Visited = "Visisted",
    NotViewed = "Not Viewed",
    Undefined = "",
}

export interface HotSpot {
    id: number,
    pathID: number,
    lat: number,
    lng: number,
    date: string,
    irPath: string,
    rbgPath: string,
    isHotSpot: boolean,
    severity: Severity,
    status: Status
}

export interface Path {
    id: number,
    name: string
}