import { NgModule } from '@angular/core';
import { CommonModule, registerLocaleData } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { MaterialModules } from '../../ui/material/material.modules';
import { ShopRoutingModule } from './shop-routing.module';

import { HeaderComponent } from './components/header/header.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ShopComponent } from './shop.component';
import { ProductCardComponent} from './components/product-card/product-card.component';
import { ContactsFormComponent } from './components/contacts-form/contacts-form.component';
import { LazyImageComponent } from './components/lazy-image/lazy-image.component';
import { ProductOptionsComponent } from './components/product-options/product-options.component';
import { CartComponent } from './components/cart/cart.component';

import { GalleryService } from './services/gallery.service';
import { ProductsService } from 'src/app/components/shop/services/products.service';
import { EmailService } from 'src/app/components/shop/services/email.service';
import { CanOpenProductGuard } from 'src/app/components/shop/guards/can-open-product/can-open-product.guard';
import { SizePipe } from 'src/app/components/shop/pipes/size/size.pipe';

import { CanOpenAlbumGuard } from 'src/app/components/shop/guards/can-open-album/can-open-album.guard';

import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { ProductsOptionsService } from 'src/app/components/shop/services/products-options.service';
import { ProductPageComponent } from './components/product-page/product-page.component';
import { ProductsTableComponent } from './components/products-table/products-table.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { reducers } from '@store/.';

import ru from '@angular/common/locales/ru';
import { DialogService } from './services/dialog.service';
import { HideUntilImagesLoadedDirective } from './directives/hide-until-images-loaded.directive';
import { FullPhotoComponent } from './components/full-photo/full-photo.component';
import { HTMLGeneratorService } from './services/html-generator.service';
import { LocalStorageService } from './services/local-storage.service';
import { ShopEffects } from '@store/effects/shop.effects';

@NgModule({
	declarations: [
		HeaderComponent,
		ContactsComponent,
		ShopComponent,
		ProductCardComponent,
		ProductPageComponent,
		ProductsTableComponent,
		LazyImageComponent,
		ProductOptionsComponent,
		ContactsFormComponent,
		CartComponent,
		FullPhotoComponent,
		SizePipe,
		HideUntilImagesLoadedDirective,
		NotFoundComponent,
	],
	imports: [
		CommonModule,
		ShopRoutingModule,
		HttpClientModule,
		HttpClientJsonpModule,
		ReactiveFormsModule,
		...MaterialModules,
		StoreModule.forRoot(reducers),
		StoreRouterConnectingModule.forRoot(),
		EffectsModule.forRoot([ShopEffects]),
		StoreDevtoolsModule.instrument({ maxAge: 25, logOnly: environment.production })
	],
	providers: [
		GalleryService,
		ProductsService,
		ProductsOptionsService,
		EmailService,
		DialogService,
		HTMLGeneratorService,
		LocalStorageService,
		CanOpenProductGuard,
		CanOpenAlbumGuard
	],
	bootstrap: [ShopComponent]
})
export class ShopModule {
	constructor() {
		registerLocaleData(ru);
	}
}