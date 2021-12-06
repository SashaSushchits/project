<template>
  <main class="content container">
    <div class="content__top content__top--catalog">
      <h1 class="content__title">Каталог</h1>
      <span class="content__info"> Количество товара: {{ allProducts.length }}</span>
    </div>

    <div class="content__catalog">
      <ProductFilter
        :price-from.sync="filterPriceFrom"
        :price-to.sync="filterPriceTo"
        :category-id.sync="filterCategoryId"
        :filter-color.sync="filterColor"
      />

      <section class="catalog">
        <ProductList :products="products"/>

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
import products from "./../data/products";
import ProductList from "@/components/ProductList.vue";
import BasePagination from "@/components/BasePagination.vue"; // @ - ссылается на апку SRC
import ProductFilter from "@/components/ProductFilter.vue";

export default {
  components: { ProductList, BasePagination, ProductFilter },
  data() {
    return {
      filterPriceFrom: 0,
      filterPriceTo: 0,
      filterCategoryId: 0,
      filterColor: '',
      page: 1,
      productsPerPage: 9, //на странице
      allProducts: products, // products:products можно просто products
    };
  },
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
    filteredProducts() {
      return this.allProducts.filter((product) => {
        if (this.filterPriceFrom > 0 && product.price < this.filterPriceFrom) {
          return false
        };
        if (this.filterPriceTo > 0 && product.price > this.filterPriceTo) {
          return false
        };
        if (this.filterCategoryId && product.categoryId !== this.filterCategoryId) {
          return false
        };
        if (this.filterColor && !product.color.includes(this.filterColor)) {
          console.log(this.filterColor)
          return false
        };
        return true
      });
    },
    products() {
      const offset = (this.page - 1) * this.productsPerPage;
      return this.filteredProducts.slice(offset, offset + this.productsPerPage);
    },
    countProducts() {
      return this.filteredProducts.length;
    },
  },
};
</script>