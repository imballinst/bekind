<template>
  <div class="bg-green-700 main">
    <div class="flex mb-4 h-full flex-wrap">
      <div class="w-1/4 p-2 absolute" v-bind:class="{ clipped: isClipped }">
        <card
          :img="img"
          text="Grind hard, shine hard 🏆😎💪 #GX34 #arsenal #facommunityshield20"
        />
      </div>
      <div class="w-1/4 p-2 absolute" v-bind:class="{ clipped: isClipped }">
        <card
          :img="img"
          text="Grind hard, shine hard 🏆😎💪 #GX34 #arsenal #facommunityshield20"
        />
      </div>
      <div class="w-1/4 p-2 absolute" v-bind:class="{ clipped: isClipped }">
        <card
          :img="img"
          text="Grind hard, shine hard 🏆😎💪 #GX34 #arsenal #facommunityshield20"
        />
      </div>
      <div class="w-1/4 p-2 absolute" v-bind:class="{ clipped: isClipped }">
        <card
          :img="img"
          text="Grind hard, shine hard 🏆😎💪 #GX34 #arsenal #facommunityshield20"
        />
      </div>
      <div class="w-1/4 p-2 absolute" v-bind:class="{ clipped: isClipped }">
        <card
          :img="img"
          text="Grind hard, shine hard 🏆😎💪 #GX34 #arsenal #facommunityshield20"
        />
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
    const isClipped = ref(false);

    function setClipped(value) {
      isClipped.value = value;
    }

    setTimeout(() => {
      setClipped(true);
    }, 1000);

    return {
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

.tweets-raw {
  text-align: left;
  max-width: 100%;
  font-size: 16px;
  white-space: pre-wrap;
}

/* Clips. */
.clipped:nth-child(1) > div {
  clip-path: polygon(0 0, 29% 77%, 0 100%);
}
.clipped:nth-child(2) > div {
  clip-path: polygon(2% 0%, 29% 70%, 98% 0);
}
.clipped:nth-child(3) > div {
  clip-path: polygon(100% 0, 44% 57%, 100% 50%);
}
.clipped:nth-child(4) > div {
  clip-path: polygon(2% 100%, 31% 77%, 100% 100%);
}
.clipped:nth-child(5) > div {
  clip-path: polygon(100% 53%, 46% 60%, 31% 74%, 100% 98%);
}
</style>
