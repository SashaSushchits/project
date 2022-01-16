<template>
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
            <router-link class="breadcrumbs__link" :to="{ name: 'main' }">
                Каталог
            </router-link>
        </li>
        <li class="breadcrumbs__item">
            <router-link class="breadcrumbs__link" :to="{ name: 'cart' }">
                Корзина
            </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> Оформление заказа </a>
        </li>
      </ul>

      <h1 class="content__title">Корзина</h1>
      <span class="content__info"> Количество товаров: {{ totalProducts }}  шт.</span>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST" @submit.prevent="order">
        <div class="cart__field">
          <div class="cart__data">

            <BaseFormText title='ФИО' :error="formError.name" type="text" v-model="formData.name" placeholder="Введите ваше полное имя" />

            <BaseFormText title='Адрес доставки' :error="formError.address" type="text" v-model="formData.address" placeholder="Введите ваш адрес" />
            
            <BaseFormText title='Телефон' :error="formError.phone" type="tel" v-model="formData.phone" placeholder="Введите ваш телефон" />
            
            <BaseFormText title='Email' :error="formError.email" type="email" v-model="formData.email" placeholder="Введи ваш Email" />

            <BaseFormTextarea title='Комментарий к заказу' :error="formError.comment" v-model="formData.comment" placeholder="Ваши пожелания"/>

          </div>

          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item"  v-for="diliveri in diliveries" :key="diliveri.id">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="delivery"
                    v-model="diliveriId"
                    :value = diliveri.id 
                    checked=""
                  />
                  <span class="options__value">
                    {{diliveri.title}} <b>{{diliveri.price}}</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 v-if="payments && payments.length !== 0" class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="payment in payments" :key="payment.id">
                <label class="options__label">
                  <input
                    class="options__radio sr-only"
                    type="radio"
                    name="pay"
                    v-model="paymentId"
                    :value = payment.id 
                  />
                  <span class="options__value"> {{payment.title}} </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <ul class="cart__orders">
            <li class="cart__order" v-for="product in products" :key="product.productId">
              <h3>{{ product.product.productOffer.title }}</h3>
              <b>{{ (product.amount * product.product.price) | numberFormat }} Br</b>
              <span>Количесвто: {{ product.amount }} шт.</span> <br>
              <span>Артикул: {{ product.product.productOffer.product.id }}</span>
            </li>
          </ul>

          <div class="cart__total" v-if="totalProducts">
            <p>Доставка: <b>1200 Br</b></p>
            <p>Итого: <b>{{ totalProducts }}</b> товара на сумму <b>{{ (totalPrice + 1200) | numberFormat}} Br</b></p>
          </div>

          <button class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
        </div>

        <Preloader v-if="orderLoading"/>

        <div class="cart__error form__error-block" v-if="formErrorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            Похоже произошла ошибка. Попробуйте отправить снова или
            перезагрузите страницу.
          </p>
        </div>
      </form>
    </section>
  </main>
</template>

<script>
import BaseFormTextarea from '@/components/BaseFormTextarea';
import BaseFormText from '@/components/BaseFormText';
import { mapGetters } from "vuex";
import numberFormat from "@/helpers/numberFormat";
import axios from 'axios';
import {API_BASE_URL} from '../config';
import Preloader from '../components/Preloader.vue';

export default {
    components:{BaseFormText, BaseFormTextarea, Preloader},
    filters: {
        numberFormat
    },
    data() {
        return{
            formData: {},
            formError: {},
            formErrorMessage: '',

            diliveries: [],
            payments: [],
            diliveriId: '',
            paymentId: 2,

            orderLoading: false,
        }
    },
    computed: {
        ...mapGetters({products: 'cartDetailProducts', totalPrice: 'cartTotalPrice', totalProducts:'totalProducts'})
    },
    methods: {
        order() {
          this.formError = {};
          this.formErrorMessage = '';

          this.orderLoading = true;

          if(this.diliveries.length !== 0 && this.paymentId && this.diliveriId) {
            this.orderLoadingTimer = setTimeout(() => {
            axios.post(API_BASE_URL + '/api/orders', {
              ...this.formData,
              deliveryTypeId: this.diliveriId,
              paymentTypeId: this.paymentId
            }, {
             params: {userAccessKey: this.$store.state.userAccessKey}
            })
            .then(response => {
              this.$store.commit('resetCart');
              this.$store.commit('updateOrderInfo', response.data);
              this.$router.push({name: 'orderInfo', params: {id: response.data.id}})
            })
            .catch(error => {
                this.formError = error.response.data.error.request || {};
                this.formErrorMessage = error.response.data.error.message;
            })
            .then(() => this.orderLoading = false);
          }, 3000)
          } else {
            alert('Выберите вариант доставки')
            this.orderLoading = false
          }
          
        },
        loadDeliveries() {
          axios.get(API_BASE_URL+'/api/deliveries')
              .then(response => this.diliveries = response.data)
        },
        loadPayments() {
          axios.get(API_BASE_URL+`/api/payments?deliveryTypeId=${this.diliveriId}`)
              .then(response => this.payments = response.data)
        },
    },
    created() {
      this.loadDeliveries()
    },
    watch: {
      diliveriId() {
        this.loadPayments()
      }
    }
};
</script>