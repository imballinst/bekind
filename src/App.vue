<template>
  <div class="main bg-black">
    <div class="wrapper">
      <section
        aria-label="Card"
        class="card-wrapper transition-base"
        v-if="showCard"
        v-bind:class="cardClassName"
      >
        <div
          class="absolute"
          v-bind:class="{ clippingIn: isClippingIn, clipped: isClipped }"
          v-for="n in 5"
          v-bind:key="n"
        >
          <card
            :img="message.img"
            :isLiked="isLiked"
            text="Grind hard, shine hard 🏆😎💪 #GX34 #arsenal #facommunityshield20"
            v-on:handle-like="handleLike"
          />
        </div>
      </section>

      <section
        aria-label="Message"
        class="message-wrapper transition-base"
        v-bind:class="className"
      >
        <div aria-label="Figure" class="image-wrapper" v-if="!showCard">
          <img v-bind:src="message.img" v-bind:alt="message.text" />
        </div>
        <span
          class="message"
          v-bind:class="{
            'text-center': !(
              textStateId === 'SHOW_TALKSPORT_QUOTE' ||
              textStateId === 'SHOW_METRO_QUOTE'
            )
          }"
        >
          {{ message.text }}
        </span>

        <!-- <button
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          v-on:click="handleNextText"
          v-if="
            textStateId !== 'SHOW_CLICK_THE_LIKE_BUTTON' &&
            textStateId !== 'SHOW_BE_KIND_TO_OTHERS'
          "
        >
          Next
        </button> -->
      </section>
    </div>
  </div>
</template>

<script>
import { computed, ref, watchEffect } from 'vue';
import CardVue from './components/Card.vue';

import XhakaImg from './images/xhaka-community-shield.jpg';
import XhakaCupEar from './images/dazn-xhaka-arm-crowd.png';
import XhakaPutOffShirt from './images/getty-images-getty-xhaka-put-off-arsenal-shirt.jpeg';

const isClippingIn = ref(false);
const isClipped = ref(false);
const isLiked = ref(false);

// An offset of 500ms from the CSS style so we won't see some "jumpy stuff".
const TRANSITION_DURATION = 1500;

const textStatesData = {
  SHOW_CLICK_THE_LIKE_BUTTON: {
    duration: undefined,
    img: XhakaImg,
    text: 'Click the "Like" button.'
  },
  SHOW_IS_HE_HAPPY: {
    duration: 5000,
    img: XhakaImg,
    text: 'Is he happy?'
  },
  SHOW_IF_ONE_DAY_HES_SAD: {
    duration: 7500,
    img: XhakaImg,
    text: 'If he is actually sad, will you consider him "ungrateful"?'
  },
  SHOW_TALKSPORT_QUOTE: {
    duration: 10000,
    img: XhakaCupEar,
    text:
      'The 27-year-old waved his arms, cupped his ears and told fans to “f**k off” after he was jeered as he was substituted during the 2-2 draw at home to Crystal Palace.',
    source:
      'https://talksport.com/football/622334/arsenal-offer-granit-xhaka-counselling-outburst-fans-kroenke/'
  },
  SHOW_METRO_QUOTE: {
    duration: 10000,
    img: XhakaPutOffShirt,
    text:
      'Granit Xhaka admitted he’d never felt such ‘hatred’ directed towards him as he lost his cool and told Arsenal fans to ‘f*** off’ earlier this season. Xhaka was taunted by supporters as he was substituted during a 2-2 draw with Crystal Palace at the Emirates last October and lost his temper.',
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
// const currentlyShownTextState = ref('SHOW_TALKSPORT_QUOTE');
const progress = ref(0);
const className = ref(undefined);
const cardClassName = ref(undefined);

// I don't think we need a state to store this timeout thing.
let timeout = null;

export default {
  components: {
    card: CardVue
  },
  setup() {
    setTimeout(() => {
      cardClassName.value = 'in';
    }, 0);

    return {
      isClippingIn: computed(() => isClippingIn.value),
      isClipped: computed(() => isClipped.value),
      isLiked: computed(() => isLiked.value),
      textStateId: computed(() => currentlyShownTextState.value),
      showCard: computed(
        () =>
          currentlyShownTextState.value === 'SHOW_CLICK_THE_LIKE_BUTTON' ||
          currentlyShownTextState.value === 'SHOW_IS_HE_HAPPY' ||
          currentlyShownTextState.value === 'SHOW_IF_ONE_DAY_HES_SAD'
      ),
      message: computed(() => textStatesData[currentlyShownTextState.value]),
      className: computed(() => className.value),
      cardClassName: computed(() => cardClassName.value)
    };
  },
  mounted() {
    // Hook to automatically re-animate.
    watchEffect(() => {
      // Update changes when we "like" an image.
      if (currentlyShownTextState.value === 'SHOW_IF_ONE_DAY_HES_SAD') {
        const timings =
          textStatesData[currentlyShownTextState.value].duration / 2;

        setTimeout(() => {
          isClippingIn.value = true;
        }, timings);

        setTimeout(() => {
          isClipped.value = true;
        }, timings + timings / 4);

        setTimeout(() => {
          cardClassName.value = undefined;
        }, textStatesData[currentlyShownTextState.value].duration);
      }

      // Re-animate.
      this.reanimate(textStatesData[currentlyShownTextState.value].duration);
    });
  },
  methods: {
    handleLike() {
      isLiked.value = true;
      this.handleNextText();
    },
    handleNextText() {
      // Transition out.
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
      }, TRANSITION_DURATION);
    },
    reanimate(duration) {
      // First transition in.
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        className.value = 'in';
      }, 0);

      if (duration !== undefined) {
        timeout = setTimeout(() => {
          this.handleNextText();
        }, duration);
      }
    }
  }
};
</script>

<style>
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
.main {
  height: 100vh;
  width: 100vw;
}

.wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.card-wrapper {
  width: 300px;
  height: 500px;
  margin-bottom: 16px;
}

.image-wrapper {
  width: 600px;
  margin-bottom: 16px;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
}

@media (min-width: 601px) {
  .message-wrapper {
    max-width: 600px;
  }
}

.transition-base {
  transition: all 1000ms;
  opacity: 0;
}

.transition-base.in {
  opacity: 1;
}

.message {
  color: #fff;
}
</style>
