<script lang="ts" setup>
const { signIn, signOut, session, status } = useAuth();
const links: Array<{ title: string; href: string }> = [
  // {
  //   title: 'Business GRO',
  //   href: '/business-gro',
  // },
  // {
  //   title: 'D2C',
  //   href: '/d2c',
  // },
  // {
  //   title: 'B2B',
  //   href: '/b2b',
  // },
  {
    title: 'Overview',
    href: '/',
  },
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
  {
    title: 'Finance',
    href: '/finance',
  },
];
const logout = async () => {
  await signOut({ callbackUrl: '/login' });
};
const route = useRoute();
const isActive = (link: { href: string; exact?: boolean }) => {
  const { href, exact = false } = link;
  const routePath = route.path;
  return (
    href &&
    (exact ? href === routePath : !!routePath.match(new RegExp(`^${href}`)))
  );
};
</script>

<template>
  <header
    class="fixed bg-white border-b border-pink-200 shadow-md shadow-gray-200 left-0 top-0 w-full z-[1000]"
  >
    <Container class="flex gap-6 h-20 items-center md:gap-16" flush-y>
      <NuxtLink class="font-light inline-flex flex-col text-2xl" href="/dashboard">
        <LogoDefault />
        <span class="text-xs font-bold font-mono text-pink-500">Admin</span>
      </NuxtLink>
      <ul class="flex-grow flex flex-row gap-8">
        <template v-for="(link, index) in links" :key="index">
          <li>
            <NuxtLink
              :href="link.href"
              class="text-sm"
              :class="[isActive(link) ? 'font-bold text-pink-500' : 'font-normal text-gray-500']"
            >
              {{ link.title }}
            </NuxtLink>
          </li>
        </template>
      </ul>
      <section>
        <Button
          v-if="status === 'loading'"
          color-scheme="pink"
          size="sm"
          is-rounded
          is-loading
          >...</Button
        >
        <Button
          v-else-if="status === 'authenticated'"
          color-scheme="pink"
          size="sm"
          is-rounded
          @click="logout"
        >
          <span>{{ session?.user?.name?.at(0) }}.</span>
          <span>Sign Out</span>
        </Button>
        <Button
          v-else-if="status === 'unauthenticated'"
          color-scheme="pink"
          size="sm"
          is-rounded
          @click="signIn('google')"
        >
          Sign In
        </Button>
      </section>
    </Container>
  </header>
</template>
