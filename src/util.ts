export function toClass(param: object, className?:string):string {
    return (Object.entries(param)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(" ") + (className ? ` ${className}` : ""))
}

