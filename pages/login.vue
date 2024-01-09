<script lang="ts" setup>
definePageMeta({
  middleware: ['guest-only'],
  // redirect: '/api/auth/signin',
});
const { signIn } = useAuth();
</script>

<template>
  <div class="grid h-[100dvh] -mt-20 place-items-center">
    <Button
      color-scheme="pink"
      left-icon="arrow-right-to-bracket"
      is-rounded
      @click="signIn('google')"
    >
      Click to sign in
    </Button>
  </div>
</template>
