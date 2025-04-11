---
layout: home
title: Liminal
hero:
  name: Liminal
  text: Agents in TypeScript
  image: /liminal_puzzle.png
  tagline: Primitives for composing model-agnostic agents and meta agents using TypeScript generator functions.
  actions:
    - theme: brand
      text: Getting Started
      link: /getting_started
    - theme: alt
      text: npx liminal init
features:
  - icon:
      src: /iconoir--planet.svg
    title: Decoupling From Models
    details: Create reusable conversation patterns, which can be shared without vendor lock-in.
  - icon:
      src: /iconoir--chat-bubble-check.svg
    title: Message Lists, Simplified
    details: Manage conversations through implicit message buffers, blended into function control flow.
  - icon:
      src: /iconoir--text-magnifying-glass.svg
    title: Infer Static Event Types
    details: Infer the static types of the events emitted from within an agent and its descendants.
---

<br />
<br />

---

<script setup>

import { onMounted } from 'vue'

onMounted(() => {
  const element = document.querySelector('a.VPButton.medium.alt');
  element.addEventListener('click', function() {
    navigator.clipboard
      .writeText("npx liminal init")
      .then(() => {
        console.log('Text copied to clipboard successfully!');
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  })
})

</script>
