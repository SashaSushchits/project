import Vue from 'vue'
import Vuex from 'vuex'
// import products from "@/data/products"
import axios from 'axios'
import { API_BASE_URL } from '../config';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        cartProducts: [],
        userAccessKey: null,
        cartProductsData: [],

        orderInfo: null,
        
        cartProductsLoading: false,
        cartProductsLoadingFailed: false
    },
    mutations: {
        // addProductToCart(state, payload){
        //     const item = state.cartProducts.find(item => item.productId === payload.productId);
        //     if(item) {
        //         item.amount+=payload.amount;
        //     } else {
        //         state.cartProducts.push({
        //             productId: payload.productId,
        //             amount: payload.amount,
        //         })
        //     }  
        // },
        updateOrderInfo(state, orderInfo) {
            state.orderInfo = orderInfo;
        },
        resetCart(state) {
            state.cartProducts = [];
            state.cartProductsData = [];
        },
        
        updateCartProductAmount(state, {productId, amount}){
            const item = state.cartProducts.find(item => item.productId === productId);
            if(item) {
                item.amount = amount
            }
        },
        deleteCartProduct(state, productId){
            state.cartProducts =  state.cartProducts.filter(item => item.productId !== productId)
        },
        updateUserAccessKey(state, accessKey){
            state.userAccessKey = accessKey;
        },
        updateCartProductsData(state, items){
            state.cartProductsData = items;
        },
        syncCartProducts(state){
            state.cartProducts = state.cartProductsData.map(item => {
                return {
                    productId: item.id,
                    amount: item.quantity
                }
            })
        }
    },
    getters: {
        cartDetailProducts(state) {
            return state.cartProducts.map(item => {
                const product = state.cartProductsData.find(p => p.id === item.productId);
                return {
                    ...item,
                    product: {
                        ...product,
                        image: product.productOffer.product.preview.file.url,
                        propTitle: product.productOffer.product.mainProp.title
                    }
                }
            })
        },
        cartTotalPrice(state, getters){
            return getters.cartDetailProducts.reduce((acc, item) => (item.product.price * item.amount) + acc, 0)
        },
        totalProducts(state, getters){
            return getters.cartDetailProducts.reduce((acc, item) => item.amount + acc, 0)
        },
        cartProductsLoading(state){
            return state.cartProductsLoading
        },
        cartProductsLoadingFailed(state){
            return state.cartProductsLoadingFailed
        },
        getOrderInfo(state){
            return state.orderInfo
        }
    },
    actions: { //действия хранящиеся в функции actions, не ограниченные в синхронности, можно выполнять любые операции (в отличие от mutations)
        loadOrderInfo(context, orderId) {
           return axios.get(API_BASE_URL + '/api/orders/' + orderId, {
                params: {userAccessKey: context.state.userAccessKey}
            })
            .then(response => {
                context.commit('updateOrderInfo', response.data)
            })
        },
        loadCart(context){
            context.state.cartProductsLoading = true;
            context.state.cartProductsLoadingFailed = false;
            setTimeout(() => {
                axios.get(API_BASE_URL + '/api/baskets', {
                    params: {userAccessKey: context.state.userAccessKey}
                })
                .then(response => {
                    if(!context.state.userAccessKey){
                        localStorage.setItem('userAccessKey', response.data.user.accessKey)
                        context.commit('updateUserAccessKey', response.data.user.accessKey);
                    }

                    context.commit('updateCartProductsData', response.data.items);
                    context.commit('syncCartProducts');
                })
                .catch(() => context.state.cartProductsLoadingFailed = true)
                .then(() => context.state.cartProductsLoading = false);
            }, 3000)
        },
        addProductToCart(context, {productOfferId, colorId, amount}){
            return (new Promise(resolve => setTimeout(resolve, 2000)))
                .then(() => {
                    return axios.post(API_BASE_URL + '/api/baskets/products', {
                        productOfferId: productOfferId,
                        colorId: colorId,
                        quantity: amount
                    }, {
                        params: {userAccessKey: context.state.userAccessKey}
                    })
                    .then(response => {
                        context.commit('updateCartProductsData', response.data.items);
                        context.commit('syncCartProducts');
                    })
                })
        },
        updateCartProductAmount(context, {productId, amount}){
            context.commit('updateCartProductAmount', {productId, amount});

            if(amount < 1) {
                return;
            }
            return axios.put(API_BASE_URL + '/api/baskets/products', {
                basketItemId: productId,
                quantity: amount
            }, {
                params: {userAccessKey: context.state.userAccessKey}
            })
            .then(response => {
                context.commit('updateCartProductsData', response.data.items);
            })
            .catch(() => {
                context.commit('syncCartProducts');
            })
        },
        deleteCartProduct(context, {productId}) {
            return axios.delete(API_BASE_URL + '/api/baskets/products', {
                params: {userAccessKey: context.state.userAccessKey},
                data: {basketItemId : productId}
            })
            .then(response => {
                context.commit('updateCartProductsData', response.data.items);
                context.commit('syncCartProducts');
            })
            .catch(() => {
                console.log('Error')
            })
        }
    }
});