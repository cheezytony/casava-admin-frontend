// eslint-disable-next-line import/named
import type { ComputedRef, Ref } from 'vue';
import {
  getFormData,
  getRawFormData,
  setFormErrors,
  validateForm,
} from 'vue3-form';
import type { Form } from 'vue3-form';
// import toastr from 'toastr';
// eslint-disable-next-line import/named
import axios, { isCancel } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import type { HTTPError, HTTPErrorData, HTTPResponseData } from '~~/types/http';

export type ServiceNames = 'casava' | 'smedan';

export type APIRequestConfig<T> = {
  url: Ref<string> | ComputedRef<string> | string;
  baseURL?: string;
  method?: string;
  headers?: object;

  authorize?: boolean;
  autoLoad?: boolean;

  initialLoadingState?: boolean;

  service?: ServiceNames;

  onSuccess?: (data: T) => void;
  onError?: (error: HTTPErrorData) => void;
  onFinish?: () => void;
} & AxiosRequestConfig;

export type APIRequestPayload = {
  data?: object;
  params?: object;
};

export const useApiRequest = <T = object>({
  authorize = false,
  autoLoad = false,
  initialLoadingState = false,
  url,
  headers = {},
  service = 'casava',
  onSuccess,
  onError,
  onFinish,
  ...config
}: APIRequestConfig<HTTPResponseData<T>>) => {
  const { signOut, sessionToken } = useAuth();
  const { public: { casava, smedan } } = useRuntimeConfig();
  
  const baseURL = computed(() => {
    switch (service) {
      case 'smedan':
        return smedan.baseUrl;
      case 'casava':
      default:
        return casava.baseUrl;
    }
  });

  const isLoading = ref(initialLoadingState);
  const data = ref<HTTPResponseData<T>>();
  const error = ref<Error | HTTPError>();
  const load = computed(() => async (payload?: APIRequestPayload) => {
    isLoading.value = true;
    return await new Promise((resolve, reject) => {
      if (authorize) {
        headers.Authorization = `Bearer ${sessionToken.value}`;
      }

      axios<HTTPResponseData<T>>({
        ...config,
        ...payload,
        headers,
        baseURL: baseURL.value,
        url: typeof url === 'object' ? (url as Ref<string>).value : url,
      })
        .then((response) => {
          data.value = response?.data;
          resolve(response?.data);
          onSuccess?.(response.data);

          return response.data;
        })
        .catch((error_: HTTPError) => {
          error.value = error_;
          if (isCancel(error_)) return;
          const error__: HTTPErrorData = {
            ...error_?.response?.data,
            status: error_.response?.status,
            statusText: error_.response?.statusText,
          };

          if (authorize && error_.response?.status === 401) {
            return signOut();
          }

          reject(error__);
          onError?.(error__);
        })
        .finally(() => {
          isLoading.value = false;
          onFinish?.();
        });
    });
  });

  // onMounted(() => autoLoad && load());
  if (autoLoad) load.value();

  return { data, error, isLoading, load };
};

export const useFormRequest = <T>(
  form: Ref<Form>,
  {
    useFormData = false,
    wrapperKey,
    onSuccess,
    onFinish,
    onError,
    ...config
  }: APIRequestConfig<HTTPResponseData<T>> & { useFormData?: boolean, wrapperKey?: string }
) => {
  const { load, ...data } = useApiRequest<T>({
    ...config,
    onSuccess: (data) => {
      form.value.success = data?.message ?? null;
      // toastr.success(data?.message ?? 'Operation Successful');
      onSuccess?.(data);
    },
    onError: (error) => {
      form.value.error = error.message;
      error.errors && setFormErrors(form, error.errors);
      console.log(error.errors);

      onError?.(error);
    },
    onFinish: () => {
      form.value.loading = false;
      onFinish?.();
    },
  });
  const submit = async () => {
    if (!validateForm(form)) return;

    form.value.loading = true;
    form.value.error = null;
    form.value.success = null;

    const data = useFormData ? getFormData(form) : getRawFormData(form);
    
    await load.value({
      data: wrapperKey ? { [wrapperKey]: data } : data,
    });
  };

  return { ...data, submit };
};
