<script lang="ts" setup>
definePageMeta({
  middleware: ['guest-only'],
  // redirect: '/api/auth/signin',
});
const { signIn, signOut, session, status } = useAuth();
</script>

<template>
  <div class="grid h-[100dvh] -mt-20 place-items-center">
    <Button
      color-scheme="pink"
      href="/api/auth/signin"
      left-icon="arrow-right-to-bracket"
      is-rounded
    >
      Click to sign in
    </Button>
  </div>
</template>
