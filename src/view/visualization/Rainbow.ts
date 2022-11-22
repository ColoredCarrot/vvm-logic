/**
 * cyrb53 (c) 2018 bryc (github.com/bryc)
 *
 * A fast and simple hash function with decent collision resistance.
 * Largely inspired by MurmurHash2/3, but with a focus on speed/simplicity.
 * Public domain.
 */
function cyrb53(str: string, seed = 0): number {
    let h1 = 0xdeadbeef ^ seed,
        h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }

    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
}

const RAINBOW_PALETTE = [
    "#E8BA36",
    "#54A857",
    "#359FF4",
    "#5060BB",
    "#179387",
    "#A5BE00",
    "#005FA3",
    "#DB7100",
    "#FFC666",
    "#38FF91",
];

export function getRainbowHexColor(key: unknown): string {
    const i = cyrb53(typeof key === "object" ? JSON.stringify(key) : String(key));
    return RAINBOW_PALETTE[i % RAINBOW_PALETTE.length];
}
