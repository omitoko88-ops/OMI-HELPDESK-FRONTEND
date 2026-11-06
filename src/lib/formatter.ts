export function formatFullName(firstName: string, lastName: string): string {
    const capitalize = (word: string) =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();

    return `${capitalize(firstName)} ${capitalize(lastName)}`.trim();
}

export function getInitials(name: string): string {
    return name.slice(0, 2).toUpperCase();
}

export function formatUnderScroleCamelCaseString(teksAsli: string): string {
    return teksAsli
        .replace(/_/g, " ") // Mengganti semua underscore dengan spasi
        .split(" ") // Memisahkan string menjadi array kata
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Mengkapitalisasi huruf pertama setiap kata
        .join(" ");
}

export function formatNumber(
    value: number | string | undefined,
    withoutDot: boolean = false
): string | number {
    // formatNumber(1000000); // "1.000.000"
    // formatNumber("1000000"); // "1.000.000"
    // formatNumber(undefined); // ""

    if (value === undefined || value === null) return "";
    const number = typeof value === "string" ? Number(value) : value;
    if (isNaN(number)) return "";

    if (withoutDot) return number;

    // console.log("1 =", number);
    // console.log("2 =", number.toLocaleString("id-ID"));

    return number.toLocaleString("id-ID");
}
export function parseCurrency(value: string): number {
    // parseCurrency("Rp 1.000.000"); // 1000000
    // parseCurrency("1.000.000"); // 1000000
    // parseCurrency("Rp 1,000,000"); // 1000000

    const cleaned = value.replace(/[^0-9]/g, "");
    return Number(cleaned);
}
