<template>
  <div class="common-table-wrapper">
    <table class="common-table">
      <thead>
        <tr>
          <th v-for="header in headers" :key="header">{{ header }}</th>
        </tr>
      </thead>
      <tbody>
        <slot />
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  headers: string[]
}>()
</script>

<style scoped>
.common-table-wrapper {
  overflow-x: auto;
  margin: 1.5rem 0;
}

.common-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.common-table th {
  padding: 10px 14px;
  text-align: left;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  font-weight: 600;
  white-space: nowrap;
}

/* 覆盖全局斑马纹 */
.common-table :deep(tr) {
  background-color: transparent !important;
}
.common-table :deep(tr:nth-child(2n)) {
  background-color: transparent !important;
}
</style>
