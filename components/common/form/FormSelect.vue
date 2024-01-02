<script lang="ts" setup>
const emit = defineEmits(['update:modelValue']);
defineProps<{
  modelValue?: number | string;
  searchable?: boolean;
  options?: Array<{
    value?: string;
    name?: string;
    option?: string;
    title?: string;
  } | string | number>;
  type?: string;
}>();

const listeners = {
  change: (event: KeyboardEvent) => {
    emit('update:modelValue', (event.target as HTMLInputElement)?.value);
  },
};
</script>

<template>
  <!-- <div>
    <Ghost>
      <template>
        <input v-bind="$attrs" type="text" class="input" :readonly="!searchable" />
      </template>
      <template #content>
        <div>Hello?</div>
      </template>
    </Ghost>
  </div> -->
  <select v-bind="$attrs" class="input" :value="modelValue" v-on="listeners">
    <template :key="n" v-for="(option, n) in options">
      <option :value="typeof option === 'object' ? option.value : option">
        <template v-if="typeof option === 'object'">
          {{ option.name || option.title }}
        </template>
        <template v-else>
          {{ option }}
        </template>
      </option>
    </template>
  </select>
</template>
