<template>
  <div class="main">
    <div class="menu">
      <div class="item">
        <router-link class="clear-link" :to="{name: 'game'}">
          Новая игра
        </router-link>
      </div>
      <div class="item">Загрузить игру</div>
      <div class="item">Настройки</div>
      <div class="item">
        <router-link class="clear-link" :to="{name: 'model_editor'}">
          Редактор моделей
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Main"
}
</script>

<style scoped>

</style>