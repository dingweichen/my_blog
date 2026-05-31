<template>
  <tr class="common-row">
    <td class="common-row__label">{{ label }}</td>
    <slot />
  </tr>
</template>

<script setup lang="ts">
defineProps<{
  label: string
}>()
</script>

<style scoped>
.common-row__label {
  font-weight: 500;
  white-space: nowrap;
  padding: 12px 14px;
  border: 1px solid var(--vp-c-divider);
  vertical-align: top;
  background-color: var(--vp-c-bg-soft);
}
</style>
