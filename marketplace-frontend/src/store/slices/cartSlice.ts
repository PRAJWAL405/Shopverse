import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { CartResponse } from '../../types'

interface CartState {
  cart: CartResponse | null
}

const initialState: CartState = {
  cart: null,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<CartResponse>) => {
      state.cart = action.payload
    },
    clearCartState: (state) => {
      state.cart = null
    },
  },
})

export const { setCart, clearCartState } = cartSlice.actions
export default cartSlice.reducer
