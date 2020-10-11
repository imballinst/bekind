<template>
  <div class="root bg-black flex flex-col items-center justify-center">
    <div
      class="wrapper flex flex-col items-center relative p-4 pt-5"
      v-bind:class="{
        'justify-center': message.centerText
      }"
    >
      <div
        class="absolute bg-white top-0 left-0 h-2 transition-base"
        v-bind:class="{
          in:
            message.duration === undefined || currentStoryProgress === 100
              ? false
              : true
        }"
        v-bind:style="{
          width: `${currentStoryProgress}%`
        }"
      ></div>
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
        class="flex flex-col transition-base items-center"
        v-bind:class="{
          [className]: true,
          'mt-4': showCard,
          'w-full': message.withBorder
        }"
      >
        <div class="flex flex-row justify-center">
          <iframe
            v-bind:aria-label="
              iframe1Src !== undefined ? 'Active iframe' : 'Inactive Iframe'
            "
            v-bind:src="iframe1Src"
            v-bind:title="message.title"
            v-bind:style="{
              display:
                currentlyActiveIframe === 0 && iframe1Src ? 'block' : 'none'
            }"
            scrolling="no"
            v-bind:width="
              currentlyActiveIframe === 0 && iframe1Src !== undefined
                ? maxContentWidth - 50
                : 0
            "
            v-bind:height="
              currentlyActiveIframe === 0 && iframe1Src !== undefined
                ? maxContentWidth - 200
                : 0
            "
            frameborder="0"
          ></iframe>
          <iframe
            v-bind:aria-label="
              iframe2Src !== undefined ? 'Active iframe' : 'Inactive Iframe'
            "
            v-bind:src="iframe2Src"
            v-bind:title="message.title"
            v-bind:style="{
              display:
                currentlyActiveIframe === 1 && iframe2Src ? 'block' : 'none'
            }"
            scrolling="no"
            v-bind:width="
              currentlyActiveIframe === 1 && iframe2Src !== undefined
                ? maxContentWidth - 50
                : 0
            "
            v-bind:height="
              currentlyActiveIframe === 1 && iframe2Src !== undefined
                ? maxContentWidth - 200
                : 0
            "
            frameborder="0"
          ></iframe>
          <figure
            class="w-full"
            v-if="
              message.img !== undefined && message.articleLink !== undefined
            "
          >
            <img v-bind:src="message.img" v-bind:alt="message.title" />
            <figcaption class="text-white text-center">
              {{ message.imgCredits }}
            </figcaption>
          </figure>
        </div>

        <span
          class="text-white"
          v-bind:class="{
            'text-center': message.articleLink === undefined,
            'mt-4': !message.centerText && !showCard,
            'border rounded border-white w-full p-4': message.withBorder,
            italic: message.articleLink !== undefined
          }"
        >
          {{ message.text }}

          <span v-if="message.articleLink !== undefined">
            --
            <a
              v-bind:href="message.articleLink"
              target="_blank"
              rel="noopener noreferrer"
              class="text-blue-500 hover:text-blue-700"
            >
              {{ message.articleSourceAndDate }} </a
            >.
          </span>
        </span>
      </section>
    </div>

    <!-- This button is used to debug state-by-state. I'm too lazy to remove it. -->
    <!-- <button
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 fixed w-full bottom-0"
      v-on:click="handleNextText"
      v-if="
        textStateId !== 'SHOW_CLICK_THE_LIKE_BUTTON' &&
        textStateId !== 'SHOW_BE_KIND_TO_OTHERS'
      "
    >
      Next
    </button> -->
  </div>
</template>

<script>
import { computed, ref, watchEffect } from 'vue';
import qs from 'qs';
import CardVue from './components/Card.vue';
import XhakaImg from './images/xhaka-community-shield.jpg';

// An offset of 1000ms from the CSS style so we won't see some "jumpy stuff".
const TRANSITION_DURATION = 2000;

const isClippingIn = ref(false);
const isClipped = ref(false);
const isLiked = ref(false);

const className = ref(undefined);
const cardClassName = ref(undefined);

const iframe1Src = ref(undefined);
const iframe2Src = ref(undefined);
const currentlyActiveIframe = ref(undefined);

const maxContentWidth = ref(window.innerWidth);

const textStatesData = {
  SHOW_CLICK_THE_LIKE_BUTTON: {
    duration: undefined,
    withBorder: true,
    img: XhakaImg,
    text: 'Click the "Like" button (the one with the heart icon).'
  },
  SHOW_IS_HE_HAPPY: {
    duration: 5000,
    withBorder: true,
    img: XhakaImg,
    text: 'Is he happy?'
  },
  SHOW_IF_ONE_DAY_HES_SAD: {
    duration: 7500,
    withBorder: true,
    img: XhakaImg,
    text: 'If he is actually sad, will you consider him "ungrateful"?'
  },
  SHOW_TALKSPORT_QUOTE: {
    duration: 12500,
    withBorder: true,
    iframeSrc: createPrefetchSrc({
      et: 'Q8sqFCZ4QepLHDg28FMJOQ',
      id: '1183802758',
      sig: '59kcSk8uB4t8bt0okASGKg95gGJ40ZK7SqOSDccwZZw='
    }),
    title:
      'Granit Xhaka waved his arms to the crowd when they jeered him as he was substituted.',
    text:
      '"The 27-year-old waved his arms, cupped his ears and told fans to \'f**k off\' after he was jeered as he was substituted during the 2-2 draw at home to Crystal Palace."',
    articleSourceAndDate: 'talkSPORT, October 30th, 2019',
    articleLink:
      'https://talksport.com/football/622334/arsenal-offer-granit-xhaka-counselling-outburst-fans-kroenke/'
  },
  SHOW_ARSENAL_TWITTER_RESPONSE_QUOTE: {
    duration: 20000,
    withBorder: true,
    iframeSrc: createPrefetchSrc({
      et: '4lLiUHyxRStwHtqopnOBmQ',
      id: '1193086399',
      sig: 'y-4yP3COV8GdM8V73LFnB9O0GWe6vulkG65L0OJMyV4='
    }),
    title:
      "Granit Xhaka's response on Arsenal Twitter, few days after the incident.",
    text:
      "\"People have said things like 'We will break your legs', 'Kill your wife' and 'Wish that your daughter gets cancer'. That has stirred me up and I reached boiling point when I felt the rejection in the stadium on Sunday.\"",
    articleSourceAndDate:
      "Granit Xhaka's response on Arsenal Twitter, October 30th, 2019",
    articleLink: 'https://twitter.com/Arsenal/status/1189985747580936192'
  },
  SHOW_METRO_QUOTE: {
    duration: 17500,
    withBorder: true,
    iframeSrc: createPrefetchSrc({
      et: 'k-VscjmWTstPBd7N8cqgkQ',
      id: '1183802772',
      sig: '-CPd5mGTFm5050iUVV4_mHokMVXDnFl5iNS4sqJY52w='
    }),
    title:
      'Granit Xhaka admitted he’d never felt such ‘hatred’ directed towards him.',
    text:
      '"Granit Xhaka admitted he’d never felt such ‘hatred’ directed towards him as he lost his cool and told Arsenal fans to ‘f*** off’ earlier this season. Xhaka was taunted by supporters as he was substituted during a 2-2 draw with Crystal Palace at the Emirates last October and lost his temper."',
    articleSourceAndDate: 'Metro, April 29th, 2020',
    articleLink:
      'https://metro.co.uk/2020/04/29/granit-xhaka-speaks-hatred-arsenal-fans-telling-f-off-12626935/'
  },
  SHOW_ITS_NOT_ALWAYS_A_HAPPY_STORY_BEHIND_A_SMILE: {
    duration: 7500,
    centerText: true,
    text: "It's not always a happy story behind a smile."
  },
  SHOW_BE_KIND_TO_OTHERS: {
    duration: undefined,
    centerText: true,
    text: 'Be kind to others.'
  }
};
const LIST_TEXT_STATES = Object.keys(textStatesData);

const currentlyShownTextState = ref('SHOW_CLICK_THE_LIKE_BUTTON');
const currentStoryProgress = ref(0);

// I don't think we need a state to store this timeout thing.
let timeout = null;
let interval = null;

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
      // So the template is clear of logic. Well, at least "dirty" logics.
      showCard: computed(
        () =>
          currentlyShownTextState.value === 'SHOW_CLICK_THE_LIKE_BUTTON' ||
          currentlyShownTextState.value === 'SHOW_IS_HE_HAPPY' ||
          currentlyShownTextState.value === 'SHOW_IF_ONE_DAY_HES_SAD'
      ),
      message: computed(() => textStatesData[currentlyShownTextState.value]),
      className: computed(() => className.value),
      cardClassName: computed(() => cardClassName.value),
      iframe1Src: computed(() => iframe1Src.value),
      iframe2Src: computed(() => iframe2Src.value),
      currentlyActiveIframe: computed(() => currentlyActiveIframe.value),
      maxContentWidth: computed(() =>
        maxContentWidth.value > 625 ? 625 : maxContentWidth.value
      ),
      currentStoryProgress: computed(
        () =>
          (currentStoryProgress.value * 100) /
          textStatesData[currentlyShownTextState.value].duration
      )
    };
  },
  created() {
    window.addEventListener('resize', updateWindowWidth);
  },
  destroyed() {
    window.removeEventListener('resize', updateWindowWidth);
  },
  mounted() {
    // Hook to automatically re-animate.
    watchEffect(() => {
      if (currentlyShownTextState.value === 'SHOW_IF_ONE_DAY_HES_SAD') {
        // Update changes when we "like" an image.
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

        setTimeout(() => {
          // Pre-fetch the next image.
          iframe1Src.value = textStatesData.SHOW_TALKSPORT_QUOTE.iframeSrc;
          currentlyActiveIframe.value = 0;
        }, textStatesData[currentlyShownTextState.value].duration + 1000);
      } else if (currentlyShownTextState.value === 'SHOW_TALKSPORT_QUOTE') {
        setTimeout(() => {
          // Pre-fetch the next image.
          iframe2Src.value =
            textStatesData.SHOW_ARSENAL_TWITTER_RESPONSE_QUOTE.iframeSrc;
          currentlyActiveIframe.value = 1;
        }, textStatesData[currentlyShownTextState.value].duration + 1000);
      } else if (
        currentlyShownTextState.value === 'SHOW_ARSENAL_TWITTER_RESPONSE_QUOTE'
      ) {
        setTimeout(() => {
          // Pre-fetch the next image.
          iframe1Src.value = textStatesData.SHOW_METRO_QUOTE.iframeSrc;
          currentlyActiveIframe.value = 0;
        }, textStatesData[currentlyShownTextState.value].duration + 1000);
      }

      // If the current state does not have `iframeSrc`, then hide all iframes.
      if (
        textStatesData[currentlyShownTextState.value].iframeSrc === undefined
      ) {
        currentlyActiveIframe.value = undefined;
      }

      // If next state has image, then pre-fetch it.
      const currentIdx = LIST_TEXT_STATES.indexOf(
        currentlyShownTextState.value
      );
      const nextTextState = LIST_TEXT_STATES[currentIdx + 1];

      // Only prefetch from the fourth state.
      // We prefetch it BEFORE the next state.
      if (
        currentIdx > 2 &&
        nextTextState !== undefined &&
        textStatesData[nextTextState].img
      ) {
        prefetchStaticImage(textStatesData[nextTextState].img);
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
      currentStoryProgress.value = 0;
      clearInterval(interval);

      interval = setInterval(() => {
        if (currentStoryProgress.value < duration) {
          currentStoryProgress.value += duration / 1000;
        }
      }, duration / 1000);

      // First transition in.
      clearTimeout(timeout);
      className.value = 'in';

      if (duration !== undefined) {
        timeout = setTimeout(() => {
          this.handleNextText();
        }, duration);
      }
    }
  }
};

// Update the window size.
let resizeTimer;

function updateWindowWidth() {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(function () {
    maxContentWidth.value = window.innerWidth;
  }, 250);
}

// Pre-fetch the image.
function createPrefetchSrc({ id, et, sig }) {
  return `//embed.gettyimages.com/embed/${id}${qs.stringify(
    {
      et,
      tld: 'com',
      sig,
      ver: 2
    },
    { addQueryPrefix: true }
  )}`;
}

function prefetchStaticImage(src) {
  const img = new Image();
  img.src = src;
}
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

/* The rest of the styles. */
figcaption {
  font-size: 11px;
  font-style: italic;
}

.root {
  font-family: 'Nunito', sans-serif;
  height: 100vh;
  width: 100vw;
}

@media (max-width: 624px) {
  .wrapper {
    width: 100%;
    height: 100%;
  }
}

@media (min-width: 625px) {
  .wrapper {
    width: 625px;
    height: 625px;
    justify-content: center;
    align-items: center;
  }
}

.card-wrapper {
  width: 300px;
  height: 466.167px;
}

.transition-base {
  transition: opacity 1000ms;
  opacity: 0;
}

.transition-base.in {
  opacity: 1;
}
</style>
