<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="index.html"> Каталог </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="cart.html"> Корзина </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> Оформление заказа </a>
        </li>
      </ul>

      <h1 class="content__title">Заказ оформлен <span>№ 23621</span></h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет
            письмо с&nbsp;деталями заказа. Наши менеджеры свяжутся с&nbsp;Вами
            в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key"> Получатель </span>
              <span class="dictionary__value">
                {{ order.name }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key"> Адрес доставки </span>
              <span class="dictionary__value">
                {{ order.address }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key"> Телефон </span>
              <span class="dictionary__value"> {{ order.phone }} </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key"> Email </span>
              <span class="dictionary__value"> {{ order.email }} </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key"> Способ оплаты </span>
              <span class="dictionary__value"> картой при получении </span>
            </li>
          </ul>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order" v-for="product in order.basket.items" :key="product.id">
              <h3>{{ product.productOffer.title }}</h3>
              <b>{{ (product.quantity * product.price) | numberFormat }} Br</b>
              <span>Количесвто: {{ product.quantity }} шт.</span> <br>
              <span>Артикул: {{ product.productOffer.product.id }}</span>
            </li>
          </ul>

          <div class="cart__total">
            <p>Доставка: <b>50 Br</b></p>
            <p>Итого: <b>{{ order.basket.items.length }}</b> товара на сумму <b>{{ (order.totalPrice + 50) | numberFormat}} Br</b></p>
          </div>
        </div>

      </form>
    </section>
  </main>
</template>

<script>
import { mapGetters } from 'vuex';
import numberFormat from "@/helpers/numberFormat";

export default {
    created() {
        if(this.$store.state.orderInfo && this.$store.state.orderInfo.id === this.$route.params.id) {
            return;
        }
        this.$store.dispatch('loadOrderInfo', this.$route.params.id)
    },
    filters: {
        numberFormat
    },
    computed: {
        ...mapGetters({order: 'getOrderInfo'})
    }
    
};
</script>