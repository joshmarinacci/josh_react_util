export function toClass(param: object, className?:string):string {
    return (Object.entries(param)
        .filter(([, v]) => v)
        .map(([k]) => k)
        .join(" ") + (className ? ` ${className}` : ""))
}

export function hasTouchScreen() {
    return (
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        navigator.msMaxTouchPoints > 0
    );
}

