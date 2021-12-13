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
          <h2>Выполняется загрузка</h2>
        </div>

        <div v-if="productsLoadingFailed">
          <h2>Произошла ошибка при загрузке товаров</h2> <button @click="loadProducts">Попробовать ещё раз</button>
        </div>

        <ProductList :products="products" />

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

export default {
  components: { ProductList, BasePagination, ProductFilter },
  data() {
    return {
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterColor: "",
      page: 1,
      productsPerPage: 3, //на странице
      // allProducts: products, // products:products можно просто products

      productsData: null,

      productsLoading: false,
      productsLoadingFailed: false
    }
  },
  // created() {
  //   eventBus.$on('gotoPage', (pageName, pageParams) => {this.page = pageParams.page})
  // }, // eventBus должен принимать и обрабатывать
  computed: {
    // filteredProducts() {
    //   let filteredProducts = this.allProducts;
    //   if (this.filterPriceFrom > 0) {
    //     filteredProducts = filteredProducts.filter(
    //       (product) => product.price > this.filterPriceFrom
    //     );
    //   }
    //   if (this.filterPriceTo > 0) {
    //     filteredProducts = filteredProducts.filter(
    //       (product) => product.price < this.filterPriceTo
    //     );
    //   }
    //   if (this.filterCategoryId) {
    //     filteredProducts = filteredProducts.filter(
    //       (product) => product.categoryId === this.filterCategoryId
    //     );
    //   }
    //   if (this.filterColor) {
    //     console.log(this.filterColor)
    //     filteredProducts = filteredProducts.filter(
    //       (product) => product.color.includes(this.filterColor)
    //     );
    //   }
    //   return filteredProducts;
    // },
    // filteredProducts() {
    //   return this.allProducts.filter((product) => {
    //     if (this.filterPriceFrom > 0 && product.price < this.filterPriceFrom) {
    //       return false
    //     };
    //     if (this.filterPriceTo > 0 && product.price > this.filterPriceTo) {
    //       return false
    //     };
    //     if (this.filterCategoryId && product.categoryId !== this.filterCategoryId) {
    //       return false
    //     };
    //     if (this.filterColor && !product.color.includes(this.filterColor)) {
    //       console.log(this.filterColor)
    //       return false
    //     };
    //     return true
    //   });
    // },
    products() {
      return this.productsData
        ? this.productsData.items.map((product) => {
            return {
              ...product,
              image: product.image.file.url,
              // color: product.colors.code, 
            };
          })
        : [];
      // const offset = (this.page - 1) * this.productsPerPage;
      // return this.filteredProducts.slice(offset, offset + this.productsPerPage);
    },
    countProducts() {
      return this.productsData ? this.productsData.pagination.total : 0;
      // return this.filteredProducts.length;
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
                minPrice: this.filterPriceFrom,
                maxPrice: this.filterPriceTo,
                colorId: this.filterColor
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
    //   filterPriceFrom() {
    //     this.page = 1
    //   } ,
    //   filterPriceTo: 0,
    //   filterCategoryId: 0,
    //   filterColor() {
    //     this.page = 1
    //   },
  },
};
</script>