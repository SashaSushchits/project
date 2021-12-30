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
      filterColor: "",
      page: 1,
      productsPerPage: 12, //на странице

      productsData: null,

      productsLoading: false,
      productsLoadingFailed: false
    }
  },
  computed: {
    products() {
      return this.productsData
        ? this.productsData.items.map((product) => {
            return {
              ...product,
              image: product.preview.file.url, 
            };
          })
        : [];
    },
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
    },
  },
  methods: {
    loadProducts() {
      this.productsLoading = true;
      this.productsLoadingFailed = false;
      clearTimeout(this.loadProductsTimer);
      this.loadProductsTimer = setTimeout(() => {
        axios
          .get(
            API_BASE_URL+'/api/products',
            {
              params: {
                page: this.page,
                limit: this.productsPerPage,
                categoryId: this.filterCategoryId,
                
                
              },
            }
          )
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
    page() {
      this.loadProducts();
    },
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
    filteredProducts() {
      this.page = 1;
    },
  },
};
</script>