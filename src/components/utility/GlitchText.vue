<template>
  <span class="glitch-text" :class="{ 'is-glitching': isGlitching }" :data-text="text">{{ text }}</span>
</template>

<script setup>
import { ref, watch } from '@vue/reactivity'

const props = defineProps({
  text: {
    type: String,
    required: true
  }
})

const isGlitching = ref(false)

// Trigger glitch effect when text changes
watch(() => props.text, () => {
  isGlitching.value = true
  setTimeout(() => {
    isGlitching.value = false
  }, 300) 
})
</script>

<style scoped>
.glitch-text {
  position: relative;
  display: inline-block;
}

.is-glitching {
  transform: scaleX(var(--scale, 1));
  animation: glitch-p 1s infinite alternate;
}

.is-glitching::before,
.is-glitching::after {
  --top: 0;
  --left: 0;
  --v-height: 30%;
  
  content: attr(data-text);
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  transform: translateX(calc(var(--left) * 100%));
  filter: drop-shadow(0 0 transparent);
}

.is-glitching::before {
  text-shadow: calc(var(--left) * -3em) 0 .02em lime;
  animation: glitch-b .8s infinite alternate-reverse;
}

.is-glitching::after {
  text-shadow: calc(var(--left) * -6em) 0 .02em #ff00e1;
  animation: glitch-a .8s infinite alternate;
}

@keyframes glitch-p {
  17% { --scale: .87; }
  31% { --scale: 1.1; }
  37% { --scale: 1.3; }
  47% { --scale: .91; }
  87% { --scale: 1; }
}

@keyframes glitch-a {
  10%,30%,50%,70%,90% { --top: 0; --left: 0; }
  0% { --v-height: 15%; }
  20% { --left: .005; }
  40% { --left: .01; --v-height: 20%; --top: 3; }
  60% { --left: .03; --v-height: 25%; --top: 6; }
  80% { --left: .07; --v-height: 5%; --top: 8; }
  100% { --left: .083; --v-height: 30%; --top: 1; }
}

@keyframes glitch-b {
  10%,30%,50%,70%,90% { --top: 0; --left: 0; }
  0% { --v-height: 15%; --top: 10; }
  20% { --left: -.005; }
  40% { --left: -.01; --v-height: 17%; --top: 3; }
  60% { --left: -.03; --v-height: 35%; --top: 6; }
  80% { --left: -.07; --v-height: 5%; --top: 8; }
  100% { --left: -.083; --v-height: 30%; --top: 1; }
}
</style>