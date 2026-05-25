export interface ReceiptQRData {
  date: string;
  sum: number;
  fn: string;
  fd: string;
  fpd: string;
  type: string;
}

export function parseReceiptQR(qrText: string): ReceiptQRData | null {
  try {
    const clean = qrText.trim();
    const params = new URLSearchParams(clean);
    const t = params.get('t');
    const s = params.get('s');
    const fn = params.get('fn');
    const i = params.get('i');
    const fp = params.get('fp');
    const n = params.get('n');
    if (!t || !s || !fn || !i || !fp) return null;

    const dateClean = t.replace('T', '');
    if (dateClean.length < 12) return null;
    const year = dateClean.slice(0, 4);
    const month = dateClean.slice(4, 6);
    const day = dateClean.slice(6, 8);
    const hour = dateClean.slice(8, 10);
    const minute = dateClean.slice(10, 12);
    const date = year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':00';

    let sum = parseFloat(s);
    if (sum > 100000 && !s.includes('.')) {
      sum = sum / 100;
    }
    return { date, sum: Math.abs(sum), fn, fd: i, fpd: fp, type: n || '1' };
  } catch {
    return null;
  }
}
