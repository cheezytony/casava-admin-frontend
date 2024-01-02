<script lang="ts" setup>
import DTableTD from './TD.vue';
import Dropdown from '../dropdown/Dropdown.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>

<template>
  <DTableTD class="px-0 align-middle w-0">
    <Dropdown class="flex items-center" @click.stop>
      <Button color-scheme="gray:soft" size="sm">
        <FontAwesomeIcon icon="ellipsis-v" />
      </Button>
      <template #items>
        <slot />
      </template>
    </Dropdown>
  </DTableTD>
</template>
