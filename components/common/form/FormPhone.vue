<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useCountries, type Country } from '~/utils/hooks/countries';

const emit = defineEmits(['update:modelValue']);
const props = withDefaults(
  defineProps<{
    type?: string;
    modelValue?: string | number;
  }>(),
  {
    type: 'text',
    modelValue: '',
  }
);

const inputRef = ref<HTMLInputElement>();

const splitValue = (value: string) => {
  const country = countries.find(({ dialCode }) => {
    return value.startsWith(dialCode);
  });
  if (!country) return;

  selectedCountry.value = country;
  value = value.replace(country.dialCode, '');

  return { country, value };
};

const inputValue = ref<string>('');
const { countries } = useCountries();
const search = ref<string>('');
const filteredCountries = computed(() => {
  if (!search.value) return countries;

  return countries.filter(({ name }) => {
    return name.match(new RegExp(search.value, 'i'));
  });
});
const selectedCountry = ref<Country>(countries[0]);
const selectCountry = (country: Country) => {
  selectedCountry.value = country;
  search.value = '';
};

const listeners = {
  change: (event: KeyboardEvent) => {
    const { value } = event.target as HTMLInputElement;
    emit('update:modelValue', selectedCountry.value.dialCode + value);
  },
  input: (event: KeyboardEvent) => {
    const { value } = event.target as HTMLInputElement;
    emit('update:modelValue', selectedCountry.value.dialCode + value);
  },
};

const onKeyPress = (event: KeyboardEvent) => {
  if (event.key.length === 1 && isNaN(Number(event.key)))
    event.preventDefault();
};
const focus = () => {
  setTimeout(() => {
    inputRef.value?.focus();
  }, 100);
};

const updateInputValue = (value: string) => {
  const split = splitValue(value);
  if (!split) {
    inputValue.value = value;
    return;
  }
  selectedCountry.value = split.country;
  inputValue.value = split.value;
}

onMounted(() => {
  updateInputValue(props.modelValue as string);
});
watch(
  () => props.modelValue,
  (value) => {
    updateInputValue(value as string);
  }
);
</script>

<template>
  <div class="flex gap-2">
    <Dropdown @open="focus">
      <button
        type="button"
        class="border flex font-medium gap-2 h-full items-center px-4 rounded"
      >
        <span>{{ selectedCountry.flag.emoji }}</span>
        <span class="text-sm">
          <FontAwesomeIcon icon="chevron-down" />
        </span>
      </button>
      <template #items>
        <div class="px-4 py-4">
          <div
            class="border flex items-center pl-4 overflow-hidden rounded focus-within:border-blue-500"
          >
            <span class="text-sm">
              <FontAwesomeIcon icon="search" />
            </span>
            <input
              v-model="search"
              class="px-3 py-2 text-sm w-full focus:outline-none"
              placeholder="Search country"
              @click.stop
              ref="inputRef"
            />
          </div>
        </div>
        <div class="max-h-[250px] overflow-auto">
          <template
            :key="country.countryCode"
            v-for="country in filteredCountries"
          >
            <button
              type="button"
              class="flex gap-4 items-center px-4 py-2 whitespace-nowrap w-full hover:bg-gray-100"
              @click="selectCountry(country)"
            >
              <span>{{ country.flag.emoji }}</span>
              <span class="font-medium text-left">
                {{ country.name }}
              </span>
              <span class="ml-auto text-gray-500 text-left text-xs">
                {{ country.dialCode }}
              </span>
            </button>
          </template>
        </div>
      </template>
    </Dropdown>
    <label
      class="bg-transparent flex h-full input items-center focus:outline-none"
    >
      <span class="font-medium text-xs whitespace-nowrap">
        {{ selectedCountry.dialCode }}
      </span>
      <input
        v-model="inputValue"
        v-on="listeners"
        type="text"
        inputmode="numeric"
        class="bg-transparent h-full w-full focus:outline-none"
        @keypress="onKeyPress"
      />
    </label>
  </div>
</template>

<style scoped>
.input {
  display: flex;
  padding: 0;
  padding-left: var(--tw-input-padding-x);
}
.input input {
  --tw-input-padding-y: 1rem;
  height: var(--tw-input-height);
  font: inherit;
  padding: var(--tw-input-padding-y) var(--tw-input-padding-x);
}
</style>
