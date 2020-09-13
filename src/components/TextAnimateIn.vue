<template>
  <span
    class="text-animate text-base"
    v-bind:class="{ animated: isAnimated }"
    v-bind:style="{ transitionDuration: duration + 'ms'}"
  >
    <slot />
  </span>
</template>

<script>
import { computed, ref } from 'vue';

export default {
  props: {
    /** Duration in milliseconds. */
    duration: Number
  },
  setup() {
    const isAnimated = ref(false);

    setTimeout(() => {
      isAnimated.value = true;
    }, 1000);

    return {
      isAnimated: computed(() => isAnimated.value)
    };
  },
  data() {
    return {
      duration: this.duration
    };
  }
};
</script>

<style>
.text-animate {
  transition: all;
  opacity: 0;
}

.text-animate.animated {
  opacity: 1;
}
</style>
