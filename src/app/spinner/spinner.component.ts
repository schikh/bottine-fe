import { Component, OnInit } from '@angular/core';
import { SpinnerService } from './spinner.service';

@Component({
	selector: 'xyz-spinner-component',
	template: `
	<div class="ctr-spinner-container" *ngIf="show">
    <div class="ctr-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
    </div>
    </div>`,
	styles: [`
.ctr-spinner-container {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	z-index: 9999;
	background-color: rgba(42, 54, 60, 0.3);
}

.ctr-spinner {
	top: 50%;
	left: 50%;
	color: official;
	display: inline-block;
	position: relative;
	width: 100px;
	height: 100px;
	margin-top: 25px;
	margin-left: -50px;
}

.ctr-spinner div {
	transform-origin: 50px 50px;
	animation: ctr-spinner 1.2s linear infinite;
}

.ctr-spinner div:after {
	content: " ";
	display: block;
	position: absolute;
	top: 100px;
	left: 50px;
	width: 10px;
	height: 50px;
	background: rgb(42, 54, 60);
}

.ctr-spinner div:nth-child(1)  { transform: rotate(0deg);   animation-delay: -1.1s; }
.ctr-spinner div:nth-child(2)  { transform: rotate(30deg);  animation-delay:   -1s; }
.ctr-spinner div:nth-child(3)  { transform: rotate(60deg);  animation-delay: -0.9s; }
.ctr-spinner div:nth-child(4)  { transform: rotate(90deg);  animation-delay: -0.8s; }
.ctr-spinner div:nth-child(5)  { transform: rotate(120deg); animation-delay: -0.7s; }
.ctr-spinner div:nth-child(6)  { transform: rotate(150deg); animation-delay: -0.6s; }
.ctr-spinner div:nth-child(7)  { transform: rotate(180deg); animation-delay: -0.5s; }
.ctr-spinner div:nth-child(8)  { transform: rotate(210deg); animation-delay: -0.4s; }
.ctr-spinner div:nth-child(9)  { transform: rotate(240deg); animation-delay: -0.3s; }
.ctr-spinner div:nth-child(10) { transform: rotate(270deg); animation-delay: -0.2s; }
.ctr-spinner div:nth-child(11) { transform: rotate(300deg); animation-delay: -0.1s; }
.ctr-spinner div:nth-child(12) { transform: rotate(330deg); animation-delay:    0s; }

@keyframes ctr-spinner {
	0% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
}`]
})
export class SpinnerComponent implements OnInit {
	constructor(private spinnerService: SpinnerService) {
	}

	private showTimer: any;
	show: boolean;

	public ngOnInit() {
		this.spinnerService.registerCallback((show: boolean) => show ? this.showSpinner() : this.hideSpinner());
	}

	private showSpinner() {
		if (this.showTimer) { return; }
		this.showTimer = setTimeout(() => this.showSpinnerElement(true), 150);
	}

	private hideSpinner() {
		if (this.showTimer) {
			clearTimeout(this.showTimer);
		}
		this.showTimer = undefined;
		this.show = false;
	}

	private showSpinnerElement(show: boolean) {
		this.show = show;
	}
}
