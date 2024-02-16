<script lang="ts" setup>
import type { DatatableFilter } from '~/types';

definePageMeta({
  middleware: ['auth'],
});

useHead({
  title: 'Customers',
});

const CustomerType = {} as {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  policies: number;
  date_registered: Date;
  source: string;
};

const filters: Array<DatatableFilter> = [
  {
    slug: 'policy',
    label: 'Policy',
    placeholder: 'Select Policy',
    type: 'select',
    options: [
      { value: undefined, title: '---' },
      { value: 'Health Insurance', title: 'Health Insurance' },
      { value: 'HealthCash Insurance', title: 'Health Cash' },
    ],
  },
  {
    slug: 'source',
    label: 'Source',
    placeholder: 'Select Source',
    type: 'select',
    options: [
      { value: undefined, title: '---' },
      { value: 'SMEDAN', title: 'SMEDAN' },
      { value: 'D2C', title: 'D2C' },
    ],
  },
  {
    slug: 'partner',
    label: 'Partner',
    placeholder: 'Select Partner',
    type: 'select',
    options: [
      { value: undefined, title: '---' },
      { value: 'AB Microfinance', title: 'AB Microfinance' },
      { value: 'Rex Credit Limited', title: 'Rex Credit Limited' },
      { value: 'SMEDAN', title: 'SMEDAN' },
      { value: 'bujeti', title: 'bujeti' },
      { value: 'P2vest Technology LTD', title: 'P2vest Technology LTD' },
    ],
  },
];

// First name
// Last name
// Email address
// Phone number
// Date registered
// Number of policies
// Number of premium payments
// Last Payment date (if possible)
// Source ( SMEDAN, D2C, BLOOM/PARTNER)
</script>

<template>
  <Container>
    <PageHeading>Customers</PageHeading>

    <PageSection title="Customers">
      <Datatable
        service="casava"
        url="/customer-data"
        :model="CustomerType"
        :filters="filters"
      >
        <template #heading>
          <DatatableTH>First Name</DatatableTH>
          <DatatableTH>Last Name</DatatableTH>
          <DatatableTH>Email</DatatableTH>
          <DatatableTH>Phone</DatatableTH>
          <DatatableTH align="right">No of Policies</DatatableTH>
          <!-- <DatatableTH>No of Premium Payments</DatatableTH> -->
          <!-- <DatatableTH>Last Payment Date</DatatableTH> -->
          <DatatableTH>Source</DatatableTH>
          <DatatableTH name="date_registered">Date Registered</DatatableTH>
        </template>
        <template #default="{ row }">
          <DatatableRow>
            <DatatableTD>{{ ucFirst(lowercase(row.first_name)) }}</DatatableTD>
            <DatatableTD>{{ ucFirst(lowercase(row.last_name)) }}</DatatableTD>
            <DatatableTD>{{ lowercase(row.email) }}</DatatableTD>
            <DatatableTD>{{ row.phone }}</DatatableTD>
            <DatatableTD align="right">{{ row.policies }}</DatatableTD>
            <!-- <DatatableTD>N/A</DatatableTD> -->
            <!-- <DatatableTD>N/A</DatatableTD> -->
            <DatatableTD>{{ row.source }}</DatatableTD>
            <DatatableTD>{{ dateTimeFormat(row.date_registered, 'date:compact') }}</DatatableTD>
          </DatatableRow>
        </template>
      </Datatable>
    </PageSection>
  </Container>
</template>
