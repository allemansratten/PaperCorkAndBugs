export function hypot(x: number, y: number): number {
    return Math.sqrt(x ** 2 + y ** 2)
}

export function angleDistance(a1: number, a2: number): number {
    const dif1 = Math.abs(a1 - a2)
    const dif2 = Math.abs(a1 - a2 - Math.PI * 2)
    const dif3 = Math.abs(a1 - a2 + Math.PI * 2)
    return Math.min(dif1, dif2, dif3)
}

export function clamp(a: number, mn: number, mx: number): number {
    return Math.min(mx, Math.max(mn, a))
}
