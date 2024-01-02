<script lang="ts" setup>
import type { CurrencyInputOptions } from 'vue-currency-input';
import { useCurrencyInput, CurrencyDisplay } from 'vue-currency-input';

const props = defineProps<{
  modelValue: string | number;
  options?: CurrencyInputOptions;
  type?: string;
}>();

const { inputRef, setOptions, setValue } = useCurrencyInput({
  currency: 'USD',
  currencyDisplay: CurrencyDisplay.hidden,
  hideGroupingSeparatorOnFocus: false,
  hideNegligibleDecimalDigitsOnFocus: false,
  hideCurrencySymbolOnFocus: false,
  locale: 'en-NG',
  ...props.options,
});

watch(
  () => props.modelValue,
  (value) => {
    setValue(Number(value));
  }
);

watch(
  () => props.options,
  (options) => {
    if (!options) return;
    setOptions(options);
  }
);
</script>

<template>
  <input
    ref="inputRef"
    v-bind="$attrs"
    class="input autofill:bg-white"
    type="text"
  />
</template>
