<script setup lang="ts">
import type { DataListItem } from '~/types';

definePageMeta({
  middleware: ['auth'],
  auth: {
    guestRedirectTo: '/login',
  },
});

useHead({
  title: 'Dashboard',
});

const today = new Date().toISOString().split('T')[0];
const startDate = ref<string | null>(today);
const endDate = ref<string | null>(today);

const smedanStats = useApiRequest<{
  churn_rate: number;
  difference: number;
  total_business_gro_subscribers: number;
  total_signup: number;
}>({
  url: '/dashboard-stats',
  method: 'GET',
  autoLoad: true,
  service: 'smedan',
  params: {
    start_date: startDate.value,
    end_date: endDate.value,
  },
});
const d2cStats = useApiRequest<{
  total_signups: number;
  total_verified_users: number;
  total_policies_created: number;
  total_premium_payments: number;
  total_active_policies: number;
  total_inactive_policies: number;
}>({
  url: '/dashboard-stats/customers',
  method: 'GET',
  // autoLoad: true,
  params: {
    start_date: startDate.value,
    end_date: endDate.value,
  },
});
const b2bStats = useApiRequest<{
  total_partners: number;
  total_policies_created: number;
  total_partner_premium_payments: number;
  total_active_partner_policies: number;
  total_inactive_partner_policies: number;
  total_partner_customers: number;
}>({
  url: '/dashboard-stats/business',
  method: 'GET',
  // autoLoad: true,
  params: {
    start_date: startDate.value,
    end_date: endDate.value,
  },
});
const financialStats = useApiRequest<{
  total_policies: number;
  total_premium_payments: number;
  total_transactions: number;
}>({
  url: '/dashboard-stats/financials',
  method: 'GET',
  // autoLoad: true,
  params: {
    start_date: startDate.value,
    end_date: endDate.value,
  },
});

const isLoading = computed(
  () =>
    d2cStats.isLoading.value ||
    b2bStats.isLoading.value ||
    financialStats.isLoading.value
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
>(() => [
  {
    title: 'SMEDAN (BUSINESS GRO)',
    href: '/business-gro',
    isLoading: smedanStats.isLoading.value,
    stats: [
      {
        title: 'TOTAL SIGNUP',
        value: smedanStats.data.value?.data?.total_signup ?? '0',
        type: 'number',
        description: '',
      },
      {
        title: 'TOTAL BUSINESS GRO SUBSCRIBERS',
        value: smedanStats.data.value?.data?.total_business_gro_subscribers,
        type: 'number',
        description: '',
      },
      {
        title: 'DIFFERENCE',
        value: smedanStats.data.value?.data?.difference,
        type: 'number',
        description: '',
      },
      {
        title: 'CHURN RATE',
        value: smedanStats.data.value?.data?.churn_rate,
        type: 'number',
        description: '',
      },
    ],
  },
  {
    title: 'D2C',
    href: '',
    isLoading: d2cStats.isLoading.value,
    stats: [
      {
        title: 'TOTAL SIGNUPS',
        value: d2cStats.data.value?.data?.total_signups ?? '0',
        type: 'number',
        description: '',
      },
      {
        title: 'TOTAL VERIFIED USERS',
        value: d2cStats.data.value?.data?.total_verified_users ?? '0',
        type: 'number',
        description: '',
      },
      {
        title: 'TOTAL UNVERIFIED USERS',
        value:
          (d2cStats.data.value?.data?.total_signups ?? 0) -
          (d2cStats.data.value?.data?.total_verified_users ?? 0),
        type: 'number',
        description: '',
      },
      {
        title: 'TOTAL POLICIES CREATED',
        value: d2cStats.data.value?.data?.total_policies_created ?? '0',
        type: 'number',
        description: '',
      },
      {
        title: 'TOTAL PREMIUM PAYMENTS',
        value: d2cStats.data.value?.data?.total_premium_payments ?? '0',
        type: 'currency:compact',
        description: '',
      },
      {
        title: 'TOTAL ACTIVE POLICIES',
        value: d2cStats.data.value?.data?.total_active_policies ?? '0',
        type: 'number',
        description: '',
      },
      {
        title: 'TOTAL INACTIVE POLICIES',
        value: d2cStats.data.value?.data?.total_inactive_policies ?? '0',
        type: 'number',
        description: '',
      },
    ],
  },
  {
    title: 'B2B (BLOOM)',
    href: '',
    isLoading: b2bStats.isLoading.value,
    stats: [
      {
        title: 'TOTAL SIGNUPS (PARTNERS)',
        value: b2bStats.data.value?.data?.total_partners ?? '0',
        type: 'number',
        description: '',
      },
      {
        title: 'TOTAL POLICIES CREATED',
        value: b2bStats.data.value?.data?.total_policies_created ?? '0',
        type: 'number',
        description: '',
      },
      {
        title: 'TOTAL CUSTOMERS (CUSTOMERS EACH PARTNER ONBOARDED)',
        value: b2bStats.data.value?.data?.total_partner_customers,
        type: 'number',
        description: '',
      },
      {
        title: 'TOTAL PREMIUM PAYMENTS',
        value: b2bStats.data.value?.data?.total_partner_premium_payments ?? '0',
        type: 'currency:compact',
        description: '',
      },
      {
        title: 'TOTAL ACTIVE POLICIES',
        value: b2bStats.data.value?.data?.total_active_partner_policies ?? '0',
        type: 'number',
        description: '',
      },
      {
        title: 'TOTAL INACTIVE POLICIES',
        value:
          b2bStats.data.value?.data?.total_inactive_partner_policies ?? '0',
        type: 'number',
        description: '',
      },
    ],
  },
  {
    title: 'FINANCIALS',
    href: '',
    isLoading: financialStats.isLoading.value,
    stats: [
      {
        title: 'TOTAL POLICIES CREATED',
        value: financialStats.data.value?.data?.total_policies ?? '0',
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
        value: financialStats.data.value?.data?.total_transactions ?? '0',
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
]);

type Range =
  | 'today'
  | 'yesterday'
  | 'this-week'
  | 'this-month'
  | 'this-year'
  | 'last-year'
  | 'all-time'
  | 'custom';
interface RangeOption {
  title: string;
  value: Range;
}
const rangeOptions = computed<Array<RangeOption>>(() => [
  { title: 'Today', value: 'today' },
  { title: 'Yesterday', value: 'yesterday' },
  { title: 'This Week', value: 'this-week' },
  { title: 'This Month', value: 'this-month' },
  { title: 'This Year', value: 'this-year' },
  { title: 'Last Year', value: 'last-year' },
  { title: 'All Time', value: 'all-time' },
  { title: 'Custom', value: 'custom' },
]);
const range = ref<Range>('today');
const selectedRange = computed(() =>
  rangeOptions.value.find((item) => item.value === range.value)
);

const setRange = (value: Range) => {
  let start: Date | null = new Date();
  let end: Date | null = new Date();
  range.value = value;
  switch (value) {
    case 'yesterday':
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
      break;
    case 'this-week':
      start.setDate(start.getDate() - 7);
      break;
    case 'this-month':
      start.setMonth(start.getMonth() - 1);
      break;
    case 'this-year':
      start.setFullYear(start.getFullYear() - 1);
      start.setMonth(0);
      start.setDate(1);
      break;
    case 'last-year':
      start.setFullYear(start.getFullYear() - 1);
      start.setMonth(0);
      start.setDate(1);
      end.setFullYear(end.getFullYear() - 1);
      end.setMonth(11);
      end.setDate(31);
      break;
    case 'all-time':
      start = null;
      end = null;
      break;
  }

  if (value !== 'custom') {
    startDate.value = start?.toISOString().split('T')[0] ?? null;
    endDate.value = end?.toISOString().split('T')[0] ?? null;
    nextTick(reload);
  }

  console.log(startDate.value, endDate.value);
};

const reload = () => {
  smedanStats.load();
  d2cStats.load();
  b2bStats.load();
  financialStats.load();
};

watch([startDate, endDate], () => {
  const params = { start_date: startDate.value, end_date: endDate.value };
  smedanStats.update({ params });
  d2cStats.update({ params });
  b2bStats.update({ params });
  financialStats.update({ params });
});
</script>

<template>
  <Container>
    <PageHeading>Dashboard</PageHeading>

    <div class="flex flex-wrap gap-4 items-end mb-8">
      <Dropdown>
        <template #default="{ isOpen }">
          <Button
            color-scheme="pink"
            size="sm"
            is-rounded
            left-icon="calendar-days"
            :right-icon="isOpen ? 'angle-up' : 'angle-down'"
          >
            {{ selectedRange?.title ?? 'Today' }}
          </Button>
        </template>
        <template #items="{ close }">
          <div id="something" class="min-w-[16rem]">
            <DropdownItem
              v-for="item in rangeOptions"
              :key="item.value"
              :value="item.value"
              :is-selected="item.value === range"
              @click="() => {
                setRange(item.value);
                close();
              }"
            >
              {{ item.title }}
            </DropdownItem>
          </div>
        </template>
      </Dropdown>
      <FormGroup
        type="date"
        class="input-sm"
        :disabled="range !== 'custom'"
        label="From"
        v-model="startDate"
      />
      <FormGroup
        type="date"
        class="input-sm"
        :disabled="range !== 'custom'"
        label="To"
        v-model="endDate"
      />
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
            <!-- <Button
              color-scheme="pink"
              :href="section.href"
              size="sm"
              is-rounded
            >
              <span>View more</span>
              <IconChevronRight class="w-3 h-3" />
            </Button> -->
            <LoaderSmall v-if="section.isLoading" />
          </template>
        </PageSection>
      </template>
    </div>
  </Container>
</template>
