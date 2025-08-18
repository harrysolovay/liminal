<template>
  <span v-html="breaks"></span>
</template>

<script setup lang="ts">
import L from "liminal"
import { computed } from "vue"

const breaks = computed(() => "<br />".repeat(Object.values(L).length + 2))
</script>
