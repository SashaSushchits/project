<template>
  <aside class="filter">
    <h2 class="filter__title">Фильтры</h2>

    <form class="filter__form form" action="#" method="get" @submit="submit">
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input class="form__input" type="text" name="min-price" v-model.number="currentPriceFrom" />
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input class="form__input" type="text" name="max-price" v-model.number="currentPriceTo"/>
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select">
          <select class="form__select" type="text" name="category" v-model.number="currentCategoryId">
            <option value="0" disabled>Все категории</option>
            <option :value="category.id" v-for="category in categories" :key="category.id"> {{ category.title }} </option>
          </select>
        </label>
      </fieldset>

      <fieldset v-if="!categoriesDataId" class="form__block">
        <legend class="form__legend">Пожалуйста, выберите другую категорию, к сожалению, в данной категории товары закончились</legend>
      </fieldset>

      <fieldset v-if="categoriesDataId && categoriesDataId !== []" class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors">
          <li class="colors__item" v-for="color in colors" :key="color.id">
            <label class="colors__label">
              <input
                @click="pushColors(color.id)"
                class="colors__radio sr-only"
                type="checkbox"
                name="color"
                :value = color.id 
                :checked = 'false'
              />
              <span class="colors__value" :style="{backgroundColor: color.code}"></span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset v-if="categoriesDataId && categoriesDataId !== []" class="form__block">
        <legend class="form__legend">{{ categoriesDataId.title }}</legend>
        <ul class="check-list">
          <li class="check-list__item" v-for="categories in categoriesDataId.availableValues" :key="categories.value">
            <label class="check-list__label">
              <input
                @click="pushProps(categories.value)"
                class="check-list__check sr-only"
                type="checkbox"
                name="volume"
                :value="8"
                :checked = 'false'
              />
              <span class="check-list__desc">
                {{ categories.value }}
              <span>({{ categories.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
      </fieldset>

      <fieldset v-if="categoriesDataId && categoriesDataId.code === 'length'" class="form__block">
        <legend class="form__legend">Похоже товары закончились, пожалуйста, выберите другую категорию</legend>
      </fieldset>

      <button class="filter__submit button button--primery" type="submit" @click.prevent="submit">    <!-- почему клик не здесь -->
        Применить
      </button>
      <button class="filter__reset button button--second" type="button" @click.prevent="reset">
        Сбросить
      </button>
    </form>
  </aside>
</template>

<script>
// import categories from "../data/categories";
import products from "../data/products";
import gotoPage from "@/helpers/gotoPage";
import axios from 'axios';
import {API_BASE_URL} from '@/config'
export default {
  data() {
    return {
      currentPriceFrom: 0,
      currentPriceTo: 0,
      currentCategoryId: 0,
      currentColor:'', // передаем не цвет, а id цвета, и проверяем, есть ли это цвет в товаре

      categoriesData: null,
      colorsData: null,
      currentPropsData: [],
      currentPropsCode: [],
      currentColorData: [],

      categoriesDataId: []
    }
  },
  props:['priceFrom', 'priceTo', 'categoryId', 'filterColor', 'propsData', 'propsCode'],
  computed: {
    categories() {
      return this.categoriesData ? this.categoriesData.items : [];
    },
    colors() {
      return this.colorsData ? this.colorsData.items : [];
    },
  },
  methods: {
    submit(){
      this.$emit('update:priceFrom', this.currentPriceFrom);
      this.$emit('update:priceTo', this.currentPriceTo);
      this.$emit('update:categoryId', this.currentCategoryId);
      this.$emit('update:filterColor', this.currentColorData);
      this.$emit('update:propsData', this.currentPropsData);
      this.$emit('update:propsCode', this.currentPropsCode);
      this.propsCodeData();
    },
    reset(){
      this.$emit('update:priceFrom', 0);
      this.$emit('update:priceTo', 0);
      this.$emit('update:categoryId', 0);
      this.$emit('update:filterColor', []);
      this.$emit('update:propsData', []);
      this.$emit('update:propsCode', null);
      this.currentPropsCode = []
      this.currentPropsData = []
    },
    loadCategories(){
      axios.get(API_BASE_URL+'/api/productCategories')
        .then(response => this.categoriesData = response.data)
    },
    loadColors(){
      axios.get(API_BASE_URL+'/api/colors')
        .then(response => this.colorsData = response.data)
    },
    loadCategoriesId(){
      axios.get(API_BASE_URL+'/api/productCategories/' + this.currentCategoryId)
        .then(response => this.categoriesDataId = response.data.productProps[0])
        // .then(response => this.categoriesDataId = response.data.productProps.map(item => item.availableValues)[0])
    },
    pushProps(id){
      if(this.currentPropsData.includes(id)) this.currentPropsData.splice(this.currentPropsData.indexOf(id), 1)
      else this.currentPropsData.push(id)
    },
    pushColors(id){
      if(this.currentColorData.includes(id)) this.currentColorData.splice(this.currentColorData.indexOf(id), 1)
      else this.currentColorData.push(id)
    },
    propsCodeData() {
      if(this.categoriesDataId && this.currentPropsCode.length === 0) this.currentPropsCode.push(this.categoriesDataId.code)
      
    }
  },
  watch: {
    currentCategoryId() {
      this.loadCategoriesId()
      this.currentPropsData = [];
      this.currentPropsCode = []
    }
    },
    created() {
      this.loadCategories(),
      this.loadColors()
    }
}
</script>