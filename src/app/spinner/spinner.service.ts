import { Injectable } from '@angular/core';

@Injectable()
export class SpinnerService {
	private target: any;
	public count = 0;

	private stateChange: (x: boolean) => void;

	public registerCallback(callback: (x: boolean) => void) {
		this.stateChange = callback;
	}

	public incrementRequestCount() {
		this.count += 1;
		this.notifyChange();
	}

	public decrementRequestCount() {
		if (this.count >= 1) {
			this.count -= 1;
		}
		this.notifyChange();
	}

	private notifyChange() {
		if (this.stateChange) {
			this.stateChange(this.count > 0);
		}
	}
}
