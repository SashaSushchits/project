<template>
  <li class="catalog_item">
    <router-link class="catalog__pic" :to="{name: 'product', params:{id: product.id}}">
      <img :src="product.image" :alt="product.title"/>
    </router-link>

    <h3 class="catalog__title">
      <a href="#" @click.prevent="gotoPage('product', {id: product.id})">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price"> {{ product.price | numberFormat}} Br </span>

    <ul class="colors colors--black">
      <li class="colors__item" v-for="color in product.colors" :key="color.id">
        <label class="colors__label">
          <input
            class="colors__radio sr-only"
            type="radio"
            value= color.id
          />
          <span class="colors__value" :style="{backgroundColor: color.code}"> </span>
        </label>
      </li>
    </ul>
  </li>
</template>

<script>
  import gotoPage from "@/helpers/gotoPage";
  import numberFormat from "@/helpers/numberFormat";

  export default {
    data() {
      return {
        color:'#73B6EA',
      }
    },
    filters: {
      numberFormat
    },
    methods: {
      gotoPage
    },
    props: ["product"],
  };
</script>