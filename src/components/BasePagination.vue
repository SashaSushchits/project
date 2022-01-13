<template>
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <a class="pagination__link pagination__link--arrow"
        :class="{'pagination__link--disabled': page === 1}"
        aria-label="Предыдущая страница"
        v-if="page !== 0"
        @click.prevent="paginate(page-1)">
      <svg width="8" height="14" fill="currentColor">
        <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </a>
    </li>
    <li class="pagination__item" v-for="pageNumber in pages" :key="pageNumber">
      <a class="pagination__link" :class="{'pagination__link--current': pageNumber === page}" @click.prevent="paginate(pageNumber)"> {{ pageNumber }}   
      </a>
    </li>
    <li class="pagination__item">
      <a
        class="pagination__link pagination__link--arrow"
        :class="{'pagination__link--disabled': page === pages}"
        aria-label="Следующая страница"
        @click.prevent="paginate(page+1)">
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </a>
    </li>
    <fieldset class="form_block">
      <label class="form__label form__label--select">
        <select @click="submit()" class="form__select" type="text" name="category" v-model.number="currentPerPage">
          <option :value="item.page" v-for="(item, index) in data" :key="index"> {{ item.page }}</option>
        </select>
      </label>
    </fieldset>
  </ul>
</template>

<script>
export default {
  data(){
    return{
      data:[{page:4},{page:12},{page:24}],
      currentPerPage: this.perPage
    }
  },
  model: {
    prop:'page',
    event:'paginate'
  },
  props: ['page', 'count', 'perPage'],  //perPage -количество товаров выводимых на странице
  computed: {
    pages() {
      return Math.ceil(this.count / this.perPage)
    }
  },
  // watch: {
  //   переключение за счет вотч
  // },
  methods: {
    paginate(page) {
      this.$emit('paginate', page)
    },
    submit(){
      this.$emit('update:perPage', this.currentPerPage);
    }
  }
}
</script>

<style scoped>
  .form_block {
    border: 1;
    padding: 0;
    margin-left: 10px
}
</style>