import Vue from 'vue'
import Vuex from 'vuex'
import products from "@/data/products"

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        cartProducts: [
            {productId: 1, amount: 1}
        ]
    },
    mutations: {
        addProductToCart(state, payload){
            const item = state.cartProducts.find(item => item.productId === payload.productId);
            if(item) {
                item.amount+=payload.amount;
            } else {
                state.cartProducts.push({
                    productId: payload.productId,
                    amount: payload.amount,
                })
            }  
        }
    },
    getters: {
        cartDetailProducts(state) {
            return state.cartProducts.map(item => {
                return {
                    ...item,
                    product: products.find(p => p.id === item.productId)
                }
            })
        },
        cartTotalPrice(state, getters){
            return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.amount) + acc, 0)
        }
    },
});