<template>
  <li class="catalog_item">
    <a class="catalog__pic" href="#" @click.prevent="gotoPage('product', {id: product.id})">
      <img :src="product.image" :alt="product.title"/>
    </a>

    <h3 class="catalog__title">
      <a href="#" @click.prevent="gotoPage('product', {id: product.id})">
        {{ product.title }}
      </a>
    </h3>

    <span class="catalog__price"> {{ product.price | numberFormat}} Br </span>

    <ul class="colors colors--black">
      <li class="colors__item">
        <label class="colors__label">
          <input
            class="colors__radio sr-only"
            type="radio"
            value="#73B6EA"
            v-model="color"
          />
          <span class="colors__value" style="background-color: #73b6ea"> </span>
        </label>
      </li>
      <li class="colors__item">
        <label class="colors__label">
          <input
            class="colors__radio sr-only"
            type="radio"
            value="#8BE000"
            v-model="color"
          />
          <span class="colors__value" style="background-color: #8be000"> </span>
        </label>
      </li>
      <li class="colors__item">
        <label class="colors__label">
          <input
            class="colors__radio sr-only"
            type="radio"
            value="#222"
            v-model="color"
          />
          <span class="colors__value" style="background-color: #222"> </span>
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