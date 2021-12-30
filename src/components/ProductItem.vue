<template>
  <li class="catalog_item">
    <router-link class="catalog__pic" :to="{name: 'product', params:{id: product.id}}">
      <img :src="product.image" :alt="product.title"/>
    </router-link>

    <h3 class="catalog__title">
      <router-link :to="{name: 'product', params:{id: product.id}}">
        <a> {{ product.title }} </a>
      </router-link>
    </h3>

    <span class="catalog__price"> {{ changePrice | numberFormat}} Br </span>

    <ul class="colors colors--black">
      <li class="colors__item" v-for="color in product.colors" :key="color.id">
        <label class="colors__label">
          <input
            class="colors__radio sr-only"
            type="radio"
            name="radio"
            value= color.id
          />
          <span class="colors__value" :style="{backgroundColor: color.color.code}"> </span>
        </label>
      </li>
    </ul>

    <ul class="sizes">
      <li class="sizes__item" v-for="offer in product.offers" :key="offer.id">
        <label class="sizes__label">
          <input class="sizes__radio sr-only" type="radio" name="sizes-1" :value='offer.id'>
          <!-- <span class="sizes__value" 
          :class="{ active: params === offer.id }" 
          v-for="prop in offer.propValues" 
          :key="prop.id" 
          @click="params = offer.id">{{ prop.value }}</span> -->
          <span class="sizes__value" 
                :class="{ active: params === offer.id }" 
                @click="params = offer.id">
                  {{ offer.propValues.map(item => {if(item.productProp.code !== 'color') return item.value})[0] }}
          </span>
        </label>
      </li>
    </ul>

  </li>
</template>

<script>
  import numberFormat from "@/helpers/numberFormat";

  export default {
    data() {
      return {
        params: null,
        totalPrice: null
      }
    },
    computed: {
      changePrice() {
        if(this.params) {
          return this.totalPrice = this.product.offers.find((item) => item.id === this.params).price
        } return this.product.price
      },
      offerValue() {
        return this.product.offers.map(item => {if (item.propValues[0].productProp.code !== 'color') return item.propValues[0]})
      },
    },
    filters: {
      numberFormat
    },
    methods: {
      // getOffer(arr){
      //   arr.propValues.map(item => {if(item.productProp.code !== 'color') return item.value})[0]
      // }
      // offerValue() {
      //   this.product.offers.propValues.productProp.map(item => {if(item.productProp.code !== 'color') return item.value})
      // }

    },
    props: ["product"],
  };
</script>