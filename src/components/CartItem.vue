<template>
  <li class="cart__item product">
    <div class="product__pic">
      <img
        :src="item.product.image"
        width="120"
        height="120"
        :alt="item.product.title"
      />
    </div>
    <h3 class="product__title">
      {{ item.product.productOffer.title }}
    </h3>
    <p class="product__info product__info--color">Цвет:
      <span>
       <i :style="{backgroundColor: item.product.color.color.code}"></i> {{ item.product.color.color.title }}
      </span>
    </p>
   <div><p class="product__info">{{ item.product.propTitle }}: <span>{{ item.product.productOffer.propValues[0].value }}</span></p></div>
    <span class="product__code"> Артикул: {{ item.product.productOffer.product.id }} </span>

    <div class="product__counter form__counter">
      <button :class="{'pagination__link--disabled': amount === 1}" type="button" aria-label="Убрать один товар" @click="amount--">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <input type="text" v-model.number="amount" name="count" />

      <button type="button" aria-label="Добавить один товар" @click="amount++">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price">
      {{ (item.amount * item.product.price) | numberFormat }} Br
    </b>

    <button class="product__del button-del" type="button" aria-label="Удалить товар из корзины" @click="deleteProduct(item.productId)">
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
</template>

<script>
import numberFormat from "@/helpers/numberFormat";
// import { mapActions } from "vuex";

export default {
  props: ['item'],
  filters: {numberFormat},
  computed: {
      amount: {
          get(){
            if (this.item.amount < 1 && value !== "") {
              this.item.amount = 1;
              alert('Вы ввели не корректное значение, пожалуйста, введите количество товара равное одному и больше')
            } else {
              return this.item.amount;
              }
          },
          set(value){
            if (value < 1 && value !== "") {
              value = 1;
              alert('Вы ввели не корректное значение, пожалуйста, введите количество товара равное одному и больше')
            } else {
              this.$store.dispatch('updateCartProductAmount', {productId: this.item.productId, amount: value})
              }
          }
      }
  },
  methods: {
      // ...mapActions({deleteProduct: 'deleteCartProduct'}),
      // ...mapMutations({deleteProduct: 'deleteCartProduct'}),
      deleteProduct(productId){
        console.log(productId)
          this.$store.dispatch('deleteCartProduct', {productId})
      }
  }
};
</script>