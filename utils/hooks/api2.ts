import type { ComputedRef, Ref } from 'vue';
import {
  getFormData,
  getRawFormData,
  setFormErrors,
  validateForm,
} from 'vue3-form';
import type { Form } from 'vue3-form';
import axios, { isCancel } from 'axios';
import type { AxiosRequestConfig } from 'axios';
import type { HTTPError, HTTPErrorData, HTTPResponseData } from '~~/types/http';

export type ServiceNames = 'casava' | 'smedan';

export type APIRequestConfig = {
  url: Ref<string> | ComputedRef<string> | string;
  baseURL?: string;
  method?: string;
  headers?: object;

  authorize?: boolean;
  autoLoad?: boolean;

  initialLoadingState?: boolean;

  service?: ServiceNames;
} & AxiosRequestConfig;

export type APIResponseHandlers<T> = {
  onSuccess?: (data: HTTPResponseData<T>) => void;
  onError?: (error: HTTPErrorData) => void;
  onFinish?: () => void;
};

export const useApiRequest = <T>(
  {
    autoLoad = false,
    authorize = false,
    initialLoadingState = false,
    service = 'casava',
    ...requestConfig
  }: APIRequestConfig,
  { onSuccess, onError, onFinish }: APIResponseHandlers<T>
) => {
  const { signOut, sessionToken } = useAuth();
  const {
    public: { casava, smedan },
  } = useRuntimeConfig();
  const isLoading = ref(initialLoadingState ?? false);
  const data = ref<HTTPResponseData<T>>();
  const error = ref<Error | HTTPError>();

  const config = ref(requestConfig);
  const update = (newConfig: APIRequestConfig) => {
    config.value = {
      ...config.value,
      ...newConfig,
    };
  };

  const baseURL = computed(() => {
    switch (service) {
      case 'smedan':
        return smedan.baseUrl;
      case 'casava':
      default:
        return casava.baseUrl;
    }
  });

  const load = async () => {
    const { headers = {} } = config.value;
    isLoading.value = true;
    return await new Promise((resolve, reject) => {
      if (authorize) {
        headers.Authorization = `Bearer ${sessionToken.value}`;
      }

      axios<HTTPResponseData<T>>({
        ...config,
        headers,
        baseURL: baseURL.value,
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
  };

  // onMounted(() => autoLoad && load());
  if (autoLoad) load();

  return { isLoading, data, error, update, load };
};
