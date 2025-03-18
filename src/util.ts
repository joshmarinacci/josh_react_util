export function toClass(param: object):string {
    return Object.entries(param)
        .filter(([,v])=>v)
        .map(([k])=>k)
        .join(" ")
}

