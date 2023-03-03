export enum Status {
    Dismissed = "Dismissed",
    Viewed = "Viewed",
    Visited = "Visited",
    NotViewed = "Not viewed",
    Undefined = "",
}

export interface HotSpot {
    loc_id: number,
    lat: number,
    lng: number,
    path_id: number,
    record_id: number,
    date: string,
    ir_image_path: string,
    rgb_image_path: string,
    is_hotspot: boolean,
    status: Status
}

export interface Path {
    id: number,
    name: string
}

// Generic function to check if obj is the enum type T
export function isEnum<T extends { [k: string]: string }>(enumType:T, obj: any): obj is T[keyof T] {
    return Object.values(enumType).includes(obj as T[keyof T]);
}

// HotSpot Type guard 
export function isHotSpot(obj: unknown): obj is HotSpot {
    const typedObj = obj as HotSpot;
    return (
        (typeof typedObj === 'object' && typedObj !== null)
        &&
        (typeof typedObj.loc_id === 'number')
        && 
        (typeof typedObj.lat === 'number')
        &&
        (typeof typedObj.lng === 'number')
        &&
        (typeof typedObj.path_id === 'number')
        && 
        (typeof typedObj.record_id === 'number')
        &&
        (typeof typedObj.date === 'string')
        &&
        (typeof typedObj.ir_image_path === 'string')
        &&
        (typeof typedObj.rgb_image_path === 'string')
        && 
        (typeof typedObj.is_hotspot === 'boolean')
        &&
        (isEnum(Status, typedObj.status))
    )
}

// HotSpot Array TypeGuard
export function isHotSpotArray(obj: unknown): obj is HotSpot[] {
    return Array.isArray(obj) && obj.every(e => isHotSpot(e));
}

// Path TypeGuard
export function isPath(obj: unknown): obj is Path {
    const typedPath = obj as Path
    return (
        (typeof typedPath === 'object' && typedPath !== null)
        &&
        (typeof typedPath.id === 'number')
        &&
        (typeof typedPath.name === 'string')
    )
}

// Path Array TypeGuard
export function isPathArray(obj: unknown): obj is Path[] {
    return Array.isArray(obj) && obj.every(e => isPath(e));
}