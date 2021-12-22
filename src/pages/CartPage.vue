<template>
  <main class="content container" v-if="cartProductsLoading">
    <div class="content__top">
      <Preloader/>
    </div>
  </main>
  <main class="content container" v-else-if="cartProductsLoadingFailed">Не удалось загрузить товар <button @click="loadCart">Попробовать ещё раз</button></main>
  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link" href="index.html"> Каталог </a>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> Корзина </a>
        </li>
      </ul>

      <h1 class="content__title">Корзина</h1>
      <span class="content__info">Количество товаров: {{ totalProducts }} шт.</span>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <ul class="cart__list">
            <CartItem v-for="item in products" :key="item.productId" :item="item" />
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">Итого: <span>{{ totalPrice | numberFormat}} Br</span></p>

          <router-link v-if="totalProducts" tag="button" :to="{name: 'order'}" class="cart__button button button--primery" type="submit">
            Оформить заказ
          </router-link>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import numberFormat from "@/helpers/numberFormat";
import { mapActions, mapGetters } from "vuex";
import CartItem from '@/components/CartItem'
import Preloader from '../components/Preloader.vue';

export default {
  components: { CartItem, Preloader },
  filters: {
    numberFormat
  },
  computed: {
    // ...mapGetters(['cartDetailProducts']),
   
   ...mapGetters({products: 'cartDetailProducts', totalPrice: 'cartTotalPrice', totalProducts:'totalProducts', cartProductsLoading:'cartProductsLoading', cartProductsLoadingFailed:'cartProductsLoadingFailed'}), //название будущего вычисляемого свойства и геттер(который хотим проксировать)
   
   // products(){
    //   // return this.$store.getters.cartDetailProducts;
    //   return this.cartDetailProducts;
    // }
  },
  methods: {
    ...mapActions(['loadCart'])
  }

  
};
</script>