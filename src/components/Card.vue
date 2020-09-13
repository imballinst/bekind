<template>
  <div class="card-root rounded overflow-hidden shadow-lg">
    <img class="image" v-bind:src="img" alt="Sunset in the mountains" />
    <div class="px-6 py-4 bg-white">
      <button v-on:click="$emit('handle-like')">
        <favorite v-if="isLiked" />
        <favorite-outlined v-else />
      </button>
      <p class="text-gray-700 text-base">{{ text }}</p>
    </div>
  </div>
</template>

<script>
import FavoriteVue from '../icons/Favorite.vue';
import FavoriteOutlinedVue from '../icons/FavoriteOutlined.vue';

export default {
  components: {
    'favorite-outlined': FavoriteOutlinedVue,
    favorite: FavoriteVue
  },
  props: {
    img: String,
    text: String,
    isLiked: Boolean
  },
  data() {
    return {
      img: this.img,
      text: this.text,
      isLiked: this.isLiked
    };
  }
};
</script>

<style>
.card-root {
  width: 300px;
}

.image {
  object-fit: cover;
}
</style>
