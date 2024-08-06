export class Time {
    private hours: number;
    private minutes: number;
    private seconds: number;

    constructor(hours: number, minutes: number, seconds: number = 0) {
        if (!Time.isValid(hours, minutes, seconds)) {
            throw new Error('Invalid time');
        }
        this.hours = hours;
        this.minutes = minutes;
        this.seconds = seconds;
    }

    // バリデーション関数
    static isValid(hours: number, minutes: number, seconds: number = 0): boolean {
        return (
            hours >= 0 && hours < 24 &&
            minutes >= 0 && minutes < 60 &&
            seconds >= 0 && seconds < 60
        );
    }

    // 時間を文字列でフォーマットする関数
    toString(): string {
        const pad = (num: number) => num.toString().padStart(2, '0');
        return `${pad(this.hours)}:${pad(this.minutes)}:${pad(this.seconds)}`;
    }

    // 時間を加算する関数
    addMinutes(minutesToAdd: number): Time {
        let totalMinutes = this.hours * 60 + this.minutes + minutesToAdd;
        totalMinutes %= 1440;  // 1440 分 = 24 時間
        if (totalMinutes < 0) totalMinutes += 1440; // 負の値を調整

        const newHours = Math.floor(totalMinutes / 60);
        const newMinutes = totalMinutes % 60;

        return new Time(newHours, newMinutes, this.seconds);
    }

    // 時間を加算する関数
    addSeconds(secondsToAdd: number): Time {
        let totalSeconds = (this.hours * 3600) + (this.minutes * 60) + this.seconds + secondsToAdd;
        totalSeconds %= 86400;  // 86400 秒 = 24 時間
        if (totalSeconds < 0) totalSeconds += 86400; // 負の値を調整

        const newHours = Math.floor(totalSeconds / 3600);
        const newMinutes = Math.floor((totalSeconds % 3600) / 60);
        const newSeconds = totalSeconds % 60;

        return new Time(newHours, newMinutes, newSeconds);
    }

    // 時間の差を計算する関数
    diffInMinutes(other: Time): number {
        const thisTotalMinutes = this.hours * 60 + this.minutes;
        const otherTotalMinutes = other.hours * 60 + other.minutes;
        return thisTotalMinutes - otherTotalMinutes;
    }

    diffInSeconds(other: Time): number {
        const thisTotalSeconds = (this.hours * 3600) + (this.minutes * 60) + this.seconds;
        const otherTotalSeconds = (other.hours * 3600) + (other.minutes * 60) + other.seconds;
        return thisTotalSeconds - otherTotalSeconds;
    }
}