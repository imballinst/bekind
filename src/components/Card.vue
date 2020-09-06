<template>
  <div class="max-w-sm rounded overflow-hidden shadow-lg h-full">
    <img class="w-full image" v-bind:src="img" alt="Sunset in the mountains" />
    <div class="px-6 py-4 bg-white">
      <p class="text-gray-700 text-base truncate">{{ text }}</p>
    </div>
  </div>
</template>

<script>
export default {
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
  height: 300px;
  object-fit: cover;
}
</style>
