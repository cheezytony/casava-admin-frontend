<script lang="ts" setup>
import type { HTTPError } from '~/types/http';

const props = defineProps<{
  error: HTTPError | Error;
}>();

const error = computed(() => props.error);
const status = computed<number>(
  () => (error.value as HTTPError)?.response?.status ?? 500
);
const heading = computed<string>(() => {
  switch (status.value) {
    case 400:
      return 'There was an error with your request';
    case 401:
      return 'You are not authorized to view this page';
    case 403:
      return 'You do not have permission to view this page';
    case 404:
      return 'The requested resource was not found';
    case 422:
      return 'The data you sent was invalid';
    case 500:
    default:
      return 'An error occurred on the server';
  }
});
const recommendation = computed<string>(() => {
  switch (status.value) {
    case 400:
      return 'Please check your request and try again.';
    case 401:
      return 'Please log in and try again or contact an administrator.';
    case 403:
      return 'Please contact an administrator to request access.';
    case 404:
      return 'Please reach out to a developer to fix this issue, or try again later.';
    case 422:
      return 'Please check your data and try again.';
    case 500:
    default:
      return 'Please reach out to a developer to fix this issue, or try again later.';
  }
});
const message = computed<string | undefined>(() => {
  return (
    (error.value as HTTPError).response?.data?.message ??
    (error.value as Error).message
  );
});
</script>

<template>
  <div class="grid place-items-center px-6 py-8 rounded-xl w-full md:px-8">
    <div
      class="bg-white border border-pink-200 inline-block px-6 py-8 rounded-xl text-center max-w-sm w-fit md:px-8"
    >
      <div
        class="font-medium mb-4 text-base leading-6 md:text-lg md:mb-3"
      >
        {{ heading }}
      </div>
      <p class="max-w-md mx-auto text-sm text-gray-500 md:mx-0 md:text-sm md:leading-5">
        {{ recommendation }}
      </p>
    </div>
  </div>
</template>
