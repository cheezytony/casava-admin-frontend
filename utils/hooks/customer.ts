export const useCustomerData = () => {
  return useReactiveApi<{ data: [], links: [], meta: {} }>({
    url: '/customer-data',
    method: 'GET',
    autoLoad: true,
  });
};
