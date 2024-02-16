import { useReactiveApi } from './api-reactive';

export const useSmedanStats = (baseDate?: Date) => {
  const today = (baseDate ?? new Date()).toISOString().split('T')[0];
  return useReactiveApi<{
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
      start_date: today,
      end_date: today,
    },
  });
};

export const useD2cStats = (baseDate?: Date) => {
  const today = (baseDate ?? new Date()).toISOString().split('T')[0];
  return useReactiveApi<{
    total_signups: number;
    total_verified_users: number;
    total_policies_created: number;
    total_premium_payments: number;
    total_active_policies: number;
    total_inactive_policies: number;
  }>({
    url: '/dashboard-stats/customers',
    method: 'GET',
    autoLoad: true,
    params: {
      start_date: today,
      end_date: today,
    },
  });
};

export const useB2bStats = (baseDate?: Date) => {
  const today = (baseDate ?? new Date()).toISOString().split('T')[0];
  return useReactiveApi<{
    total_partners: number;
    total_policies_created: number;
    total_partner_premium_payments: number;
    total_active_partner_policies: number;
    total_inactive_partner_policies: number;
    total_partner_customers: number;
  }>({
    url: '/dashboard-stats/business',
    method: 'GET',
    autoLoad: true,
    params: {
      start_date: today,
      end_date: today,
    },
  });
};

export const useFinanceStats = (baseDate?: Date) => {
  const today = (baseDate ?? new Date()).toISOString().split('T')[0];
  return useReactiveApi<{
    total_policies: number;
    total_premium_payments: number;
    total_transactions: number;
  }>({
    url: '/dashboard-stats/financials',
    method: 'GET',
    autoLoad: true,
    params: {
      start_date: today,
      end_date: today,
    },
  });
};
