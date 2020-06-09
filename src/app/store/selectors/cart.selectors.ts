import { createFeatureSelector, createSelector, MemoizedSelector, DefaultProjectorFn } from '@ngrx/store';
import { AppState, FeatureKey } from '..';
import { CartState } from '@store/state/cart.state';
import { CartProduct } from '@shop/models/cart-product';

export const selectCartState: MemoizedSelector<AppState, CartState>
		= createFeatureSelector<AppState, CartState>(FeatureKey.Cart);

export const selectCartProducts: MemoizedSelector<AppState, CartProduct[]>
		= createSelector(selectCartState, (state: CartState) => state.cartProducts);

export const selectIsCartOpened: MemoizedSelector<AppState, boolean>
		= createSelector(selectCartState, (state: CartState) => state.isCartOpened);

export const selectTotalPrice: MemoizedSelector<AppState, number>
		= createSelector(selectCartState, (state: CartState) => state.totalPrice);