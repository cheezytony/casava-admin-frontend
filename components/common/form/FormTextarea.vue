<template>
  <textarea
    :type="type"
    v-bind="$attrs"
    class="input input-textarea"
    :value="modelValue"
    v-on="listeners"
  ></textarea>
</template>

<script lang="ts" setup>
const emit = defineEmits(['update:modelValue']);
const props = withDefaults(defineProps<{
  type?: string;
  modelValue?: string | number;
  modelModifiers?: {
    capitalize: boolean;
    number: boolean;
  };
}>(), {
  type: 'text'
});

const listeners = {
  // change: (event: KeyboardEvent) => {
  //   console.log(props.modelModifiers);
  //   let value = (event.target as HTMLInputElement).value;
  //   if (props.modelModifiers.capitalize) {
  //     value = value.charAt(0).toUpperCase() + value.slice(1);
  //   }
  //   if (props.modelModifiers.number) {
  //     value = value.replace(/[^\d\.]/g, '');
  //   }
  //   emit('update:modelValue', (event.target as HTMLInputElement)?.value);
  // },
  input: (event: KeyboardEvent) => {
    let value = (event.target as HTMLInputElement).value;
    
    // if (props.modelModifiers.capitalize) {
    //   console.log('here');
      
    //   value = value.charAt(0).toUpperCase() + value.slice(1);
    // }
    // if (props.modelModifiers.number) {
      
    //   value = value.replace(/[^\d\.]/g, '');
    // }
    emit('update:modelValue', value);
  },
};
</script>
