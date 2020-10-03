<template>
  <div class="p-2 main bg-black">
    <div class="flex flex-col items-center justify-center h-full">
      <!-- <div
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
      </div> -->

      <span class="message" v-bind:class="className">
        {{ message.text }}
      </span>

      <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        v-on:click="handleNextText"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { computed, ref, watchEffect } from 'vue';
import CardVue from './components/Card.vue';

import XhakaImg from './images/xhaka-community-shield.jpg';

const isClippingIn = ref(false);
const isClipped = ref(false);
const isLiked = ref(false);

const TRANSITION_DURATION = 1500;

const textStatesData = {
  SHOW_CLICK_THE_LIKE_BUTTON: {
    duration: undefined,
    text: 'Click the "Like" button.'
  },
  SHOW_IS_HE_HAPPY: {
    duration: 5000,
    text: 'Is he happy?'
  },
  SHOW_IF_ONE_DAY_HES_SAD: {
    duration: 7500,
    text: 'If he is actually sad, will you consider him as "ungrateful"?'
  },
  SHOW_TALKSPORT_QUOTE: {
    duration: 10000,
    text:
      'The 27-year-old waved his arms, cupped his ears and told fans to “f**k off” after he was jeered as he was substituted during the 2-2 draw at home to Crystal Palace.',
    source:
      'https://talksport.com/football/622334/arsenal-offer-granit-xhaka-counselling-outburst-fans-kroenke/'
  },
  SHOW_METRO_QUOTE: {
    duration: 10000,
    text: `
Granit Xhaka admitted he’d never felt such ‘hatred’ directed towards him as he lost his cool and told Arsenal fans to ‘f*** off’ earlier this season. Xhaka was taunted by supporters as he was substituted during a 2-2 draw with Crystal Palace at the Emirates last October and lost his temper.

Xhaka was taunted by supporters as he was substituted during a 2-2 draw with Crystal Palace at the Emirates last October and lost his temper.
    `.trim(),
    source:
      'https://metro.co.uk/2020/04/29/granit-xhaka-speaks-hatred-arsenal-fans-telling-f-off-12626935/'
  },
  SHOW_ITS_NOT_ALWAYS_A_HAPPY_STORY_BEHIND_A_SMILE: {
    duration: 7500,
    text: "It's not always a happy story behind a smile."
  },
  SHOW_BE_KIND_TO_OTHERS: {
    duration: 5000,
    text: 'Be kind to others.'
  }
};
const LIST_TEXT_STATES = Object.keys(textStatesData);

const currentlyShownTextState = ref('SHOW_CLICK_THE_LIKE_BUTTON');
const progress = ref(0);
const className = ref(undefined);

// I don't think we need a state to store this timeout thing.
let timeout = null;

export default {
  components: {
    card: CardVue
  },
  setup() {
    return {
      isClippingIn: computed(() => isClippingIn.value),
      isClipped: computed(() => isClipped.value),
      isLiked: computed(() => isLiked.value),
      textStateId: computed(() => currentlyShownTextState.value),
      message: computed(() => textStatesData[currentlyShownTextState.value]),
      className: computed(() => className.value)
    };
  },
  mounted() {
    watchEffect(() => {
      this.reanimate(textStatesData[currentlyShownTextState.value].duration);
    });
  },
  data() {
    return {
      img: XhakaImg
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
    },
    handleNextText() {
      // Trigger the hide transition.
      className.value = undefined;

      // Update the text.
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const idx = LIST_TEXT_STATES.findIndex(
          (text) => text === currentlyShownTextState.value
        );
        const nextTextState = LIST_TEXT_STATES[idx + 1];
        const nextDuration = textStatesData[nextTextState].duration;

        currentlyShownTextState.value = nextTextState;
        this.reanimate(nextDuration);
      }, 1500);
    },
    reanimate(duration) {
      // First transition in.
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        className.value = 'in';
      }, 0);

      if (duration !== undefined) {
        // Transition out.
        timeout = setTimeout(() => {
          this.handleNextText();
        }, TRANSITION_DURATION + duration);
      }
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

/* Text message. */
.message {
  color: #fff;
  transition: all 1500ms;
  opacity: 0;
}

.message.in {
  opacity: 1;
}
</style>
