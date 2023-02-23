// have to change, consult with group lol
export enum Severity {
    SevereFire = "Severe Fire Detected",
    NoFire = "No Fire Detected",
    Fire = "Mild Fire Detected"
}

export enum Status {
    Dismissed = "Dismissed",
    Viewed = "Viewed",
    Visited = "Visisted",
    NotViewed = "Not Viewed",
}

export interface Waypoints {
    lat: number,
    long: number
}