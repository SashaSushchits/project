<template>
  <header class="header">
    <div class="header__wrapper container">
      <span class="header__info">Каталог</span>

      <a class="header__logo" href="#">
        <img
          src="image/svg/logo.png"
          alt="Логотип интернет магазина"
          width="200"
          height="200"
        />
      </a>

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