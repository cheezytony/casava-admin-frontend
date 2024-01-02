<script lang="ts" setup>
import type { DataListItem } from '~/types';

definePageMeta({
  middleware: ['auth'],
});

useHead({
  title: 'Growth (BUSINESS GRO)',
});

const stats: Array<DataListItem> = [
  {
    title: 'TOTAL SIGNUP',
    value: '0',
    type: 'number',
    description: '',
  },
  {
    title: 'TOTAL BUSINESS GRO SUBSCRIBERS',
    value: '0',
    type: 'number',
    description: '',
  },
  {
    title: 'DIFFERENCE',
    value: '0',
    type: 'number',
    description: '',
  },
  {
    title: 'CHURN RATE IN %',
    value: '0',
    type: 'percentage',
    description: '',
  },
];
</script>

<template>
  <Container>
    <PageHeading>Growth (BUSINESS GRO)</PageHeading>

    <div class="gap-16 flex flex-col">
      <PageSection title="Stats" flush>
        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full md:flex-row"
        >
          <template v-for="(stat, index) in stats" :key="index">
            <Stat v-bind="stat" />
          </template>
        </div>
      </PageSection>
  
      <RouterView />
    </div>
  </Container>
</template>
