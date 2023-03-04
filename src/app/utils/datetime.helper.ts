export class DateHelper {
	static toIsoDate(text: string): string {
		return text && text.replace(/(\d{1,2})[\\\/-](\d{1,2})[\\\/-](\d{4})/, '$3-$2-$1T00:00:00');
	}

	static toDateString(text: string): string {
		return text && text.substring(0, 19).replace(/T/g, ' ').replace(/:/g, '-');
	}

	static currentDateString(): string {
		var now = new Date();
		return this.toDateString(now.toISOString());
	}
}
