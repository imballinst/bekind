<template>
  <div class="p-2 main bg-black">
    <div class="flex flex-col items-center justify-center h-full">
      <div
        class="p-2 absolute"
        v-bind:class="{ clippingIn: isClippingIn, clipped: isClipped }"
        v-for="n in 5"
        v-bind:key="n"
      >
        <card
          :img="img"
          :isLiked="isLiked"
          text="Grind hard, shine hard 🏆😎💪 #GX34 #arsenal #facommunityshield20"
          v-on:handle-like="handleLike"
        />
      </div>

      <!-- <text-animate-in :duration="1000">
        Granit
        <span class="font-bold">Xhaka</span> won both FA Cup and Community Shield with Arsenal in August 2020.
        <span class="italic">If</span> he complaints about being an Arsenal player, would you believe him?
      </text-animate-in>-->
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue';
import CardVue from './components/Card.vue';

import XhakaImg from './images/xhaka-community-shield.jpg';
import TextAnimateInVue from './components/TextAnimateIn.vue';

const isClippingIn = ref(false);
const isClipped = ref(false);
const isLiked = ref(false);

export default {
  components: {
    card: CardVue,
    'text-animate-in': TextAnimateInVue
  },
  setup() {
    return {
      isClippingIn: computed(() => isClippingIn.value),
      isClipped: computed(() => isClipped.value),
      isLiked: computed(() => isLiked.value)
    };
  },
  data() {
    return {
      img: XhakaImg,
      message: 'Learn Vue'
    };
  },
  methods: {
    handleLike() {
      isLiked.value = true;

      setTimeout(() => {
        isClippingIn.value = true;
      }, 1000);

      setTimeout(() => {
        isClipped.value = true;
      }, 1500);
    }
  }
};
</script>

<style>
.main {
  height: 100vh;
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
