<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">Каталог</h1>
      <span class="content__info"> Количество товара: {{ countProducts }}</span>
    </div>

    <div class="content__catalog">
      <ProductFilter
        :price-from.sync="filterPriceFrom"
        :price-to.sync="filterPriceTo"
        :category-id.sync="filterCategoryId"
        :filter-color.sync="filterColor"
        :props-data.sync="propsData"
        :props-code.sync="propsCode"
        
      />

      <section class="catalog">
        <div v-if="productsLoading">
          <Preloader />
        </div>

         <div v-if="countProducts === 0 && !productsLoading && !productsLoadingFailed">
          <h1>Попробуйте выбрать другую категорию</h1>
        </div>

        <div v-if="productsLoadingFailed">
          <h2>Произошла ошибка при загрузке товаров</h2> <button @click="loadProducts">Попробовать ещё раз</button>
        </div>

        <ProductList v-if="!productsLoading" :products="products" />

        <BasePagination
          v-model="page"
          :count="countProducts"
          :per-page="productsPerPage"
        />
      </section>
    </div>
  </main>
</template>

<script>
// import products from "./../data/products";
import ProductList from "@/components/ProductList.vue";
import BasePagination from "@/components/BasePagination.vue"; // @ - ссылается на апку SRC
import ProductFilter from "@/components/ProductFilter.vue";
import {API_BASE_URL} from '@/config'
// import eventBus from '@/eventBus'
import axios from "axios";
import Preloader from '../components/Preloader.vue';

export default {
  components: { ProductList, BasePagination, ProductFilter, Preloader },
  data() {
    return {
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterColor: [],
      page: 1,
      productsPerPage: 12, //на странице

      productsData: null,
      propsData: null,
      propsCode: null,

      productsLoading: false,
      productsLoadingFailed: false
    }
  },
  computed: {
    productsFrom() {
      return this.productsData
        ? this.productsData.items.map((product) => {
            return {
              ...product,
              image: product.preview.file.url, 
            };
          })
        : [];
    },
    filteredProducts(){
      let filteredProducts = this.productsFrom;
      if (this.filterPriceFrom > 0) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price > this.filterPriceFrom
        );
      }
      if (this.filterPriceTo > 0) {
        filteredProducts = filteredProducts.filter(
          (product) => product.price < this.filterPriceTo
        );
      }
      if (this.filterColor.length !== 0 ){
        for (let i = 0; i < this.filterColor.length; i++) {
          filteredProducts = filteredProducts.filter(item => item.colors.find(item => item.color.id === this.filterColor[i]))
        }
      }
      console.log(filteredProducts)
      return filteredProducts;
      
    },
    
    productsCode(){ return this.propsCode ? this.propsCode : []  },
    productsPropsData(){ return this.propsData ? this.propsData : []  },
    countProducts() {
      return this.filteredProducts ? this.filteredProducts.length : 0;
    },
    products() {
      const offset = (this.page - 1) * this.productsPerPage;
      return this.filteredProducts.slice(offset, offset + this.productsPerPage);
    },
  },
  methods: {
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        if(this.productsPropsData.length !== 0 && this.propsCode) {
          console.log(this.propsCode, this.productsPropsData.length)
          let link = API_BASE_URL+`/api/products?page=${this.page}&limit=${this.productsPerPage}&categoryId=${this.filterCategoryId}`;
          let newLink = this.propsData.reduce((acc, el) => acc+`&props[${this.productsCode}][]=${el}`, link)
          axios
          .get(newLink)
          .then((response) => (this.productsData = response.data))
          .catch(() => this.productsLoadingFailed = true)
          .then(() => this.productsLoading = false);
        } else axios
          .get(API_BASE_URL+`/api/products?&categoryId=${this.filterCategoryId}`)
          .then((response) => (this.productsData = response.data))
          .catch(() => this.productsLoadingFailed = true)
          .then(() => this.productsLoading = false);
      }, 3000) 
    },
  },
  created() {
    this.loadProducts();
  },

  watch: {
    
    filterPriceFrom() {
      this.loadProducts();
      this.page = 1;
    },
    filterPriceTo() {
      this.loadProducts();
      this.page = 1;
    },
    filterCategoryId() {
      this.loadProducts();
      this.page = 1;
    },
    filterColor() {
      this.loadProducts();
      this.page = 1;
    },
    propsData() {
      this.loadProducts();
      this.page = 1;
    },
    propsCode() {
      this.loadProducts();
      this.page = 1;
    },
    filteredProducts() {
      this.page = 1;
    },
  },
};
</script>