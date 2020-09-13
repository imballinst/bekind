<template>
  <div class="bg-green-700 main">
    <div class="flex mb-4 h-full flex-wrap">
      <div
        class="w-1/4 p-2 absolute"
        v-bind:class="{ clippingIn: isClippingIn, clipped: isClipped }"
        v-for="n in 5"
        v-bind:key="n"
      >
        <div class="absolute bg-filter"></div>
        <card :img="img" text="Grind hard, shine hard 🏆😎💪 #GX34 #arsenal #facommunityshield20" />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import CardVue from './components/Card.vue';

import XhakaImg from './images/xhaka-community-shield.jpg';

export default {
  components: {
    card: CardVue
  },
  setup() {
    const isClippingIn = ref(false);
    const isClipped = ref(false);

    setTimeout(() => {
      isClippingIn.value = true;
    }, 1000);

    setTimeout(() => {
      isClipped.value = true;
    }, 1500);

    return {
      isClippingIn: computed(() => isClippingIn.value),
      isClipped: computed(() => isClipped.value)
    };
  },
  data() {
    return {
      img: XhakaImg,
      message: 'Learn Vue'
    };
  }
};
</script>

<style>
.main {
  height: 100vh;
}

.bg-filter {
  width: calc(100% - 1rem);
  height: calc(100% - 1rem);
}

/* Clips. */
.clippingIn > div {
  filter: grayscale(100%);
  transition: all 0.5s;
}
.clipped:nth-child(1) > div {
  clip-path: polygon(0 0, 11% 80%, 0 100%);
}
.clipped:nth-child(2) > div {
  clip-path: polygon(1% 0%, 12% 80%, 99% 0);
}
.clipped:nth-child(3) > div {
  clip-path: polygon(100% 0, 46% 50%, 100% 52%);
}
.clipped:nth-child(4) > div {
  clip-path: polygon(1% 100%, 12% 81%, 100% 100%);
}
.clipped:nth-child(5) > div {
  clip-path: polygon(100% 53%, 45% 51%, 13% 80.5%, 100% 99%);
}
</style>
