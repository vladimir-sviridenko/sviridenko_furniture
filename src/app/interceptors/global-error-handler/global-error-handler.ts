import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { CanOpenErrorPageGuard } from 'src/app/guards/can-open-error-page/can-open-error-page.guard';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

	constructor(private router: Router, private canOpenErrorPageGuard: CanOpenErrorPageGuard, private zone: NgZone) { }

	public handleError(error: Error): void {
		this.canOpenErrorPageGuard.isErrorThrown = true;
		this.zone.run(() => this.router.navigate(['/error']));
		//  todo: send message to my email
		console.log(error.name);
		console.log(error.message);
		console.log(error.stack);
	}
}