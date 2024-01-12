<script lang="ts" setup>
import type { DataListItem } from '~/types';
import { useFinanceStats } from '~/utils';

definePageMeta({
  middleware: ['auth'],
  auth: {
    guestRedirectTo: '/login',
  },
});

useHead({
  title: 'Finance Stats',
});

const { session } = useAuth();
const allowedUsers = [
  'segun@casava.co',
  'bp@casava.co',
  'funmilayo@casava.co',
  'daisy@casava.co',
  'adelekan@casava.co',
  'antonio@casava.co',
];
const isAllowed = computed(() =>
  allowedUsers.includes(session.value?.user?.email as string)
);

const smedanStats = useSmedanStats();
const d2cStats = useD2cStats();
const b2bStats = useB2bStats();
const financeStats = useFinanceStats();

const isLoading = computed(
  () =>
    smedanStats.isLoading.value ||
    d2cStats.isLoading.value ||
    b2bStats.isLoading.value ||
    financeStats.isLoading.value
);

const totalPremiumPayments = computed(() => {
  if (b2bStats.isLoading.value && d2cStats.isLoading.value) return 0;
  if (!b2bStats.data.value || !d2cStats.data.value) return 0;
  return (
    Number(b2bStats.data.value.data?.total_partner_premium_payments) +
    Number(d2cStats.data.value.data?.total_premium_payments)
  );
});

const sections = computed<
  Array<{
    title: string;
    href?: string;
    isLoading: boolean;
    stats: Array<DataListItem>;
  }>
>(() => {
  const totalPolicies =
    Number(d2cStats.data.value?.data?.total_policies_created ?? 0) +
    Number(b2bStats.data.value?.data?.total_policies_created ?? 0) +
    Number(smedanStats.data.value?.data?.total_business_gro_subscribers ?? 0);
  return [
    {
      title: 'FINANCIALS',
      href: '',
      isLoading: isLoading.value,
      stats: [
        {
          title: 'TOTAL POLICIES CREATED',
          value: totalPolicies,
          type: 'number',
          description: '',
        },
        {
          title: 'TOTAL PREMIUM PAYMENT AMOUNT',
          value: totalPremiumPayments.value,
          type: 'currency:compact',
          description: '',
        },
        // {
        //   title: 'TOTAL PREMIUM PAYMENTS',
        //   value: totalPremiumPayments.value,
        //   type: 'number',
        //   description: '',
        // },
        {
          title: 'NUMBER AND VALUE OF TRANSACTIONS',
          value: financeStats.data.value?.data?.total_transactions ?? '0',
          type: 'number',
          description: '',
        },
        {
          title: 'PAYMENT SUCCESS RATE (%)',
          value: undefined,
          type: 'percentage',
          description: '',
        },
        {
          title: 'AVERAGE TRANSACTION VALUE',
          value: undefined,
          type: 'number',
          description: '',
        },
      ],
    },
  ];
});

const reload = () => {
  financeStats.load();
  d2cStats.load();
  b2bStats.load();
};

const onDateChange = ([startDate, endDate]: [string | null, string | null]) => {
  const params = { start_date: startDate, end_date: endDate };
  financeStats.update({ params });
  d2cStats.update({ params });
  b2bStats.update({ params });

  reload();
};
</script>

<template>
  <Container v-if="isAllowed">
    <PageHeading>Finance</PageHeading>

    <div class="flex flex-wrap gap-4 items-end mb-8">
      <DateRange @update:model-value="onDateChange" />
      <Button
        color-scheme="pink"
        size="sm"
        :is-loading="isLoading"
        is-rounded
        left-icon="rotate-right"
        @click="reload"
      >
        Reload
      </Button>
    </div>

    <div class="gap-16 flex flex-col">
      <template v-for="(section, sectionIndex) in sections" :key="sectionIndex">
        <PageSection :title="section.title" flush>
          <template #default>
            <div
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full md:flex-row"
            >
              <template v-for="(stat, index) in section.stats" :key="index">
                <Skeleton
                  v-if="section.isLoading"
                  class="border border-pink-200 bg-white w-full h-32 rounded-xl"
                />
                <Stat v-else v-bind="stat" />
              </template>
            </div>
          </template>
          <template #cta>
            <LoaderSmall v-if="section.isLoading" />
          </template>
        </PageSection>
      </template>
    </div>
  </Container>
  <div v-else class="grid h-[100dvh] -mt-20 place-items-center">
    <div
      class="bg-white border border-pink-200 px-6 py-8 rounded-xl max-w-full text-center w-[40rem] md:px-8"
    >
      <h1 class="text-lg">You are not authorized to access this page</h1>
    </div>
  </div>
</template>
