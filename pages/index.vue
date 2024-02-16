<script setup lang="ts">
import type { DataListItem } from '~/types';

definePageMeta({
  middleware: ['auth'],
  auth: {
    guestRedirectTo: '/login',
  },
});

useHead({ title: 'Business Today' });

const yesterday = new Date();
yesterday.setDate(yesterday.getDate() - 1);

const smedanStats = useSmedanStats();
const d2cStats = useD2cStats();
const b2bStats = useB2bStats();
const yesterdayD2cStats = useD2cStats(yesterday);
const yesterdaySmedanStats = useSmedanStats(yesterday);
const yesterdayB2bStats = useB2bStats(yesterday);

const isLoading = computed(
  () =>
    smedanStats.isLoading.value ||
    d2cStats.isLoading.value ||
    b2bStats.isLoading.value
);

const sections = computed<
  Array<{
    title: string;
    href?: string;
    isLoading: boolean;
    stats: Array<DataListItem>;
  }>
>(() => {
  const totalLeadsToday =
    Number(d2cStats.data.value?.data?.total_signups ?? 0) -
    Number(d2cStats.data.value?.data?.total_active_policies ?? 0) +
    Number(smedanStats.data.value?.data?.difference ?? 0);
  const totalPoliciesToday =
    Number(d2cStats.data.value?.data?.total_policies_created ?? 0) +
    Number(b2bStats.data.value?.data?.total_policies_created ?? 0) +
    Number(smedanStats.data.value?.data?.total_business_gro_subscribers ?? 0);
  const totalSignupsToday =
    Number(d2cStats.data.value?.data?.total_signups ?? 0) +
    Number(smedanStats.data.value?.data?.total_signup ?? 0);

  const totalLeadsYesterday =
    Number(yesterdayD2cStats.data.value?.data?.total_signups ?? 0) -
    Number(yesterdayD2cStats.data.value?.data?.total_active_policies ?? 0) +
    Number(yesterdaySmedanStats.data.value?.data?.difference ?? 0);
  const totalPoliciesYesterday =
    Number(yesterdayD2cStats.data.value?.data?.total_policies_created ?? 0) +
    Number(yesterdayB2bStats.data.value?.data?.total_policies_created ?? 0) +
    Number(yesterdaySmedanStats.data.value?.data?.total_business_gro_subscribers ?? 0);
  const totalSignupsYesterday =
    Number(yesterdayD2cStats.data.value?.data?.total_signups ?? 0) +
    Number(yesterdaySmedanStats.data.value?.data?.total_signup ?? 0);

  const signupsGrowth = ((totalSignupsToday - totalSignupsYesterday) / totalSignupsYesterday);
  const leadsGrowth = ((totalLeadsToday - totalLeadsYesterday) / totalLeadsYesterday);
  const policiesGrowth = ((totalPoliciesToday - totalPoliciesYesterday) / totalPoliciesYesterday);

  return [
    {
      title: 'BUSINESS TODAY',
      href: '',
      isLoading: isLoading.value,
      stats: [
        {
          title: 'Total policies Generated',
          value: totalPoliciesToday,
          type: 'number',
          description: '',
        },
        {
          title: 'Total Leads',
          value: totalLeadsToday,
          type: 'number',
          description: '',
        },
        {
          title: 'Total claims',
          value: undefined,
          type: 'number',
          description: '',
        },
      ],
    },
    {
      title: 'Growth',
      isLoading: isLoading.value,
      stats: [
        {
          title: 'Signups',
          value: signupsGrowth,
          type: 'percentage:compact',
          description: '',
        },
        {
          title: 'Leads',
          value: leadsGrowth,
          type: 'percentage:compact',
          description: '',
        },
        {
          title: 'Policies Created',
          value: policiesGrowth,
          type: 'percentage:compact',
          description: '',
        },
      ],
    },
  ];
});
</script>

<template>
  <Container>
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
</template>
