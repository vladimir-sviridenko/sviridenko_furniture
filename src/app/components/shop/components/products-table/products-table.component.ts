import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, OnDestroy, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { ProductCardComponent } from '../product-card/product-card.component';
import { Subject, BehaviorSubject } from 'rxjs';
import { takeUntil, delay, take, filter } from 'rxjs/operators';
import { Album } from '@shop/models/album';
import { ShopFacadeService } from '@store/facades/shop.facade';
import { PageEvent, MatPaginator } from '@angular/material/paginator';
import { Product } from '@shop/models/product';

@Component({
	selector: 'app-products-table',
	templateUrl: './products-table.component.html',
	styleUrls: ['./products-table.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductsTableComponent implements AfterViewInit, OnDestroy {

	@ViewChildren(ProductCardComponent)
	private productCardComponents: QueryList<ProductCardComponent>;

	@ViewChild(MatPaginator)
	private paginator: MatPaginator;

	public unsubscriber$: Subject<void> = new Subject();

	constructor(public shopFacadeService: ShopFacadeService) {}

	private showProductsAfterAllLoaded(): void {
		const loadingPhotos$: Array<Promise<void>>
			= this.productCardComponents.map((component: ProductCardComponent) => {
				return new Promise((resolve: (value?: void | PromiseLike<void>) => void) => {
					component.imageLoad.subscribe((isSuccessLoading: boolean) => {
						resolve();
					});
				});
			});
		Promise.all(loadingPhotos$).then(() => {
			this.shopFacadeService.hideShopLoader();
		});
	}

	public ngAfterViewInit(): void {
		this.shopFacadeService.currentAlbum$
			.pipe(
				filter((album: Album) => Boolean(album)),
				delay(0),
				takeUntil(this.unsubscriber$)
			)
			.subscribe(() => {
				const firstPageEvent: PageEvent = new PageEvent();
				firstPageEvent.length = this.paginator.length;
				firstPageEvent.pageSize = this.paginator.pageSize;
				firstPageEvent.pageIndex = 0;
				this.paginator.firstPage();
				this.paginator.page.next(firstPageEvent);
			});

		this.productCardComponents.changes.pipe(takeUntil(this.unsubscriber$)).subscribe(() => {
			this.showProductsAfterAllLoaded();
		});
	}

	public onPageEvent($event: PageEvent): void {
		this.shopFacadeService.currentAlbum$.pipe(filter((album: Album) => Boolean(album)),	take(1)).subscribe((album: Album) => {
			const firstProductIndex: number = ($event.pageIndex) * ($event.pageSize );
			const lastProductIndex: number = firstProductIndex + $event.pageSize;
			const paginatedProducts: Product[] = album.products.slice(firstProductIndex, lastProductIndex);
			this.shopFacadeService.changeCurrentProducts(paginatedProducts);
		});
	}

	public ngOnDestroy(): void {
		this.unsubscriber$.next();
		this.unsubscriber$.complete();
	}
}
