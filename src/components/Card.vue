<template>
  <div class="max-w-sm rounded overflow-hidden shadow-lg">
    <img class="w-full image" v-bind:src="img" alt="Sunset in the mountains" />
    <div class="px-6 py-4 bg-white">
      <fav-outlined />
      <p class="text-gray-700 text-base">{{ text }}</p>
    </div>
  </div>
</template>

<script>
import FavoriteOutlinedVue from '../icons/FavoriteOutlined.vue';

export default {
  components: {
    'fav-outlined': FavoriteOutlinedVue
  },
  props: {
    img: String,
    text: String
  },
  data() {
    return {
      img: this.img,
      text: this.text
    };
  }
};
</script>

<style>
.image {
  object-fit: cover;
}
</style>
