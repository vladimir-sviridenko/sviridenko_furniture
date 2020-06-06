import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, OnDestroy } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Subject } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import { Album } from '@shop/models/Album';
import { ShopFacadeService } from '@store/facades/shop.facade';

@Component({
	selector: 'app-products-table',
	templateUrl: './products-table.component.html',
	styleUrls: ['./products-table.component.scss']
})
export class ProductsTableComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChildren(ProductCardComponent)
	private productCardComponents: QueryList<ProductCardComponent>;

	public album: Album;

	public unsubscriber$: Subject<void> = new Subject();

	constructor(public shopFacadeService: ShopFacadeService) { }

	private showCardsAfterAllLoaded(): void {
		const loadingPhotos$: Array<Promise<void>>
				= this.productCardComponents.map((component: ProductCardComponent, index: number) => {
			return new Promise((resolve: (value?: void | PromiseLike<void>) => void) => {
				component.imageLoad.subscribe((isSuccessLoading: boolean) => {
					if (isSuccessLoading) {
						resolve();
					} else {
						const elementToDelete: Element = document.querySelectorAll('.products-table__card')[index];
						elementToDelete.parentNode.removeChild(elementToDelete);
					}
				});
			});
		});
		Promise.all(loadingPhotos$).then(() => {
			this.shopFacadeService.hideShopLoader();
		});
	}

	public ngOnInit(): void {
		this.shopFacadeService.currentAlbum$
			.pipe(
				delay(0),
				takeUntil(this.unsubscriber$)
			)
			.subscribe((album: Album) => {
				this.album = album;
			});
	}

	public ngAfterViewInit(): void {
		this.productCardComponents.changes.pipe(takeUntil(this.unsubscriber$)).subscribe(() => {
			this.showCardsAfterAllLoaded();
		});
	}

	public ngOnDestroy(): void {
		this.unsubscriber$.next();
		this.unsubscriber$.complete();
	}
}
