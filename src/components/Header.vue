<template>
  <header class="header">
    <div class="header__wrapper container">
      <router-link :to="{name:'main'}"><span class="header__info">Каталог</span></router-link>

      <router-link class="header__logo" :to="{name:'main'}">
        <img src="image/svg/logo.png" alt="Логотип интернет магазина" width="200" height="200" >
      </router-link>
      
      <a class="header__tel" href="tel:375291234577"> +375 (29) 123-45-77 </a>
      
      <CartIndicator/>

    </div>
  </header>
</template>

<script>
import CartIndicator from "@/components/CartIndicator.vue";
export default {
    components:{ CartIndicator },
};
</script>