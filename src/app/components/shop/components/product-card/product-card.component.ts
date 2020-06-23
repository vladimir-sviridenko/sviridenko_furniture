import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '@shop/models/product';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Overlay } from '@angular/cdk/overlay';
import { take } from 'rxjs/internal/operators/take';
import { CartFacadeService } from '@store/facades/cart.facade';
import { CartProduct } from '@shop/models/cart-product';
import { ContactsFormComponent } from '../contacts-form/contacts-form.component';
import { EmailJSResponseStatus } from 'emailjs-com';
import { UserContacts } from '@shop/models/user-contacts';
import { EmailService } from '@shop/services/email.service';
import { DialogService } from '@shop/services/dialog.service';
import { ContactsSubmit } from '@shop/models/contacts-submit';
import { SubmitType } from '@shop/models/enums/submit-type.enum';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-product-card',
	templateUrl: './product-card.component.html',
	styleUrls: ['./product-card.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductCardComponent {

	@Input()
	public product: Product;

	@Input()
	public albumId: number;

	@Output()
	public imageLoad: EventEmitter<boolean> = new EventEmitter<boolean>();

	constructor(private emailService: EmailService,
		private cartFacadeService: CartFacadeService,
		public dialogService: DialogService) { }

	public addProductToCart(): void {
		const cartProduct: CartProduct = new CartProduct(this.product);
		this.cartFacadeService.addCartProduct(cartProduct);
	}

	public openRequestCallDialog(): void {
		const submitMethod: (contacts: UserContacts) => Observable<EmailJSResponseStatus> = (contacts: UserContacts) => {
			return this.emailService.sendCallRequest.call(this.emailService, contacts, this.product.photoUrl.low);
		};
		const contactsSubmit: ContactsSubmit = {
			type: SubmitType.RequestCall,
			method: submitMethod
		};

		this.dialogService.openContactsForm(contactsSubmit);
	}
}
