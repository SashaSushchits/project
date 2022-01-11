<template>
  <main class="content container" v-if="productsLoading">Загрузка товара</main>
  <main class="content container" v-else-if="!productsData">Не удалось загрузить товар</main>
  <main class="content container" v-else>
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link class="breadcrumbs__link" :to="{ name: 'main' }">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link"> {{ product.title }} </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img
            width="570"
            height="570"
            :src="product.preview.file.url"
            :alt="product.title"
          />
        </div>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title">{{ product.title }}</h2>
        <div class="item__form">
          <form
            class="form"
            action="#"
            method="POST"
            @submit.prevent="addToCart"
          >
            <b class="item__price"> {{ changePrice | numberFormat }} Br </b>

            <fieldset class="form__block">
              <legend class="form__legend">Цвет:</legend>
              <ul class="colors">
                <li class="colors__item" v-for="color in product.colors" :key="color.id">
                  <label class="colors__label">
                    <input
                      class="colors__radio sr-only"
                      type="radio"
                      name="color-item"
                      :value= color.color.id
                      v-model="colorId"
                      checked=""
                    />
                    <span
                      class="colors__value"
                      :style="{backgroundColor: color.color.code}"
                    >
                    </span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <fieldset class="form__block">
              <legend class="form__legend">{{propTitle}}:</legend>
              <ul class="sizes sizes--primery">
                <li class="sizes__item" v-for="offer in product.offers" :key="offer.id">
                  <label class="sizes__label">
                    <input class="sizes__radio sr-only" type="radio" name="sizes-1" :value='offer.id'>
                    <span class="sizes__value" 
                          :class="{ active: params === offer.id }" 
                          @click="params = offer.id">
                          {{ offer.propValues.map(item => item.value)[0] }}
                            <!-- {{ offer.propValues.map(item => {if(item.productProp.code !== 'color') return item.value})[0] }} -->
                    </span>
                  </label>
                </li>
              </ul>
            </fieldset>

            <div class="item__row">
              <div class="form__counter">
                <button
                  :class="{ 'pagination__link--disabled': productAmount === 1 }"
                  type="button"
                  aria-label="Убрать один товар"
                  @click.prevent="productAmount--"
                >
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="text" v-model.number="productAmount" />

                <button
                  type="button"
                  aria-label="Добавить один товар"
                  @click.prevent="productAmount++"
                >
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>

              <button class="button button--primery" type="submit" :disabled="productAddSending">
                В корзину
              </button>
            </div>
            <div v-show="productAdded">Товар добавлен в корзину</div>
            <div v-show="productAddSending">Добавляем товар в корзину...</div>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a class="tabs__link" href="#"> Описание </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#"> Характеристики </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#"> Гарантия </a>
          </li>
          <li class="tabs__item">
            <a class="tabs__link" href="#"> Оплата и доставка </a>
          </li>
        </ul>

        <div class="item__content">
          <p>
            Навигация GPS, ГЛОНАСС, BEIDOU Galileo и QZSS<br />
            Синхронизация со смартфоном<br />
            Связь по Bluetooth Smart, ANT+ и Wi-Fi<br />
            Поддержка сторонних приложений<br />
          </p>

          <a href="#"> Все характеристики </a>

          <h3>Что это?</h3>

          <p>
            Wahoo ELEMNT BOLT GPS – это велокомпьютер, который позволяет
            оптимизировать свои велотренировки, сделав их максимально
            эффективными. Wahoo ELEMNT BOLT GPS синхронизируется с датчиками по
            ANT+, объединяя полученную с них информацию. Данные отображаются на
            дисплее, а также сохраняются на смартфоне. При этом на мобильное
            устройство можно установить как фирменное приложение, так и
            различные приложения сторонних разработчиков. Велокомпьютер точно
            отслеживает местоположение, принимая сигнал с целого комплекса
            спутников. Эта информация позволяет смотреть уже преодоленные
            маршруты и планировать новые велопрогулки.
          </p>

          <h3>Дизайн</h3>

          <p>
            Велокомпьютер Wahoo ELEMNT BOLT очень компактный. Размеры устройства
            составляют всего 74,6 x 47,3 x 22,1 мм. что не превышает габариты
            смартфона. Корпус гаджета выполнен из черного пластика.
            На обращенной к пользователю стороне расположен дисплей диагональю
            56 мм. На дисплей выводятся координаты и скорость, а также
            полученная со смартфона и синхронизированных датчиков информация:
            интенсивность, скорость вращения педалей, пульс и т.д. (датчики не
            входят в комплект поставки). Корпус велокомпьютера имеет степень
            защиты от влаги IPX7. Это означает, что устройство не боится пыли, а
            также выдерживает кратковременное (до 30 минут) погружение в воду на
            глубину не более 1 метра.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import gotoPage from "@/helpers/gotoPage";
import numberFormat from "@/helpers/numberFormat";
import { API_BASE_URL } from "@/config";
import axios from "axios";
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      productsData: null,
      productAmount: 1,

      productsLoading: false,
      productsLoadingFailed: false,

      productAdded: false,
      productAddSending: false,

      params: null,
      totalPrice: null,

      colorId: null,
    };
  },
  filters: {
    numberFormat,
  },
  computed: {
    product() {
      return this.productsData ? this.productsData : [];
    },
    changePrice() {
      if(this.params) {
        return this.totalPrice = this.product.offers.find((item) => item.id === this.params).price
      } return this.product.price
    },
    propTitle(){
      let propTitle = this.product.offers.find(item => item.propValues).propValues.find(item => item.productProp).productProp.title
      // if(propTitle !=='Цвет') return propTitle
      return propTitle
    },
  },
  methods: {
    ...mapActions(['addProductToCart']),

    gotoPage,
    addToCart() {
      if (this.productAmount < 1) {
        this.productAmount = 1;
        alert(
          "Вы ввели не корректное значение, пожалуйста, введите количество товара равное одному и больше"
        );
      } else {
        this.productAdded = false;
        this.productAddSending = true;
        this.addProductToCart({productOfferId: this.params, colorId: this.colorId, amount: this.productAmount})
          .then(() => {
            this.productAdded = true;
            this.productAddSending = false;
          })
          .catch(() => {
            alert('Что-то пошло не так, попробуйте снова передав все параметры')
            this.productAddSending = false;
          })
        }
    },
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      axios.get(API_BASE_URL + "/api/products/" + this.$route.params.id)
        .then(response => this.productsData = response.data)
        .catch(() => this.productsLoadingFailed = true)
        .then(() => this.productsLoading = false);
    }
  },
  watch: {
    '$route.params.id': {
      handler() {
        this.loadProducts();
      },
      immediate: true
    }
  }
};
</script>