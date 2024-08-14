export class DateOnly {
    private year: number;
    private month: number;
    private day: number;

    constructor(year: number, month: number, day: number) {
        if (!DateOnly.isValidDate(year, month, day)) {
            throw new Error('無効な日付です');
        }
        this.year = year;
        this.month = month;
        this.day = day;
    }

    // 日付のバリデーション
    static isValidDate(year: number, month: number, day: number): boolean {
        const date = new Date(year, month - 1, day);
        return (
            date.getFullYear() === year &&
            date.getMonth() === month - 1 &&
            date.getDate() === day
        );
    }

    // 文字列形式からDateOnlyオブジェクトを生成する静的メソッド
    static fromString(dateString: string): DateOnly {
        const [year, month, day] = dateString.split('-').map(Number);
        if (!DateOnly.isValidDate(year, month, day)) {
            throw new Error('無効な日付です');
        }
        return new DateOnly(year, month, day);
    }

    // 日付を文字列でフォーマットする関数 (YYYY-MM-DD)
    toString(): string {
        const pad = (num: number) => num.toString().padStart(2, '0');
        return `${this.year}-${pad(this.month)}-${pad(this.day)}`;
    }

    // 日付を加算する関数
    addDays(daysToAdd: number): DateOnly {
        const date = new Date(this.year, this.month - 1, this.day);
        date.setDate(date.getDate() + daysToAdd);
        return new DateOnly(date.getFullYear(), date.getMonth() + 1, date.getDate());
    }

    // 日付の比較関数
    compareTo(other: DateOnly): number {
        const currentDate = new Date(this.year, this.month - 1, this.day).getTime();
        const otherDate = new Date(other.year, other.month - 1, other.day).getTime();
        return currentDate - otherDate;
    }

    // 日数の差を計算する関数
    diffInDays(other: DateOnly): number {
        const currentDate = new Date(this.year, this.month - 1, this.day).getTime();
        const otherDate = new Date(other.year, other.month - 1, other.day).getTime();
        const millisecondsInOneDay = 24 * 60 * 60 * 1000;

        return Math.round((currentDate - otherDate) / millisecondsInOneDay);
    }

    // 例:日付のフォーマット変更関数
    format(formatString: string): string {
        const pad = (num: number) => num.toString().padStart(2, '0');

        return formatString
            .replace('YYYY', this.year.toString())
            .replace('MM', pad(this.month))
            .replace('DD', pad(this.day));
    }

    // 等価性を確認するメソッド
    equals(other: DateOnly): boolean {
        return this.year === other.year && this.month === other.month && this.day === other.day;
    }
}