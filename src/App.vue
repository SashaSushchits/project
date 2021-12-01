<template>
  <!-- <section>
    <MainPage v-if="currentPage === 'main'" />
    <ProductPage v-if="currentPage === 'product'" />
    <NotFoudPage v-else/>
  </section> -->
  <component :is="currentPageComponent" :page-params="currentPageParams" @gotoPage="(pageName, pageParams) => gotoPage(pageName, pageParams)"/>
</template>

<script>
import MainPage from "./pages/MainPage.vue";
import ProductPage from "./pages/ProductPage.vue";
import NotFoudPage from "./pages/NotFoundPage.vue";

const routes = {
  main: 'MainPage',
  product: 'ProductPage'
}

export default {
  name: "App",
  components: { MainPage, ProductPage, NotFoudPage },
  data() {
    return {
      currentPage: 'main',
      currentPageParams: {},
    };
  },
  methods: {
    gotoPage(pageName, pageParams) {
      this.currentPage = pageName;
      this.currentPageParams = pageParams || {};
    }
  },
  computed: {
    currentPageComponent() {
      return routes[this.currentPage] || 'NotFoundPage';  //what this??!
    }
  },
};
</script>

