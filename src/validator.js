export function numberWithCommas(x) {
    return Math.abs(x).toLocaleString('en-IN', { minimumFractionDigits: 2 });
}
