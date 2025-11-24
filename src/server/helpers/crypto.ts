

export const uuidv7 = (): string => {
    const now = Date.now();
    const timeHex = now.toString(16).padStart(12, "0"); // 48-bit timestamp

    // generate 74-bit random (sisanya) 
    const random = crypto.getRandomValues(new Uint8Array(10))
        .reduce((acc, byte) => acc + byte.toString(16).padStart(2, "0"), "");

    // format: 8-4-4-4-12
    return [
        timeHex.slice(0, 8),
        timeHex.slice(8, 12),
        "7" + random.slice(0, 3), // version 7
        ((parseInt(random.slice(3, 4), 16) & 0x3) | 0x8).toString(16) + random.slice(4, 7), // variant
        random.slice(7, 19)
    ].join("-");
}

export function base64Encode(text: string): string {
  return Buffer.from(text, "utf-8").toString("base64");
}

export function base64Decode(encoded: string): string {
  return Buffer.from(encoded, "base64").toString("utf-8");
}

export function generateNomor(counter: number): string {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const year = now.getFullYear();

    return `TIMKER/${String(counter).padStart(2, '0')}/${month}/${year}`;
}