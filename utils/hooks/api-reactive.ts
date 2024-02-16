import type { Ref } from 'vue';
import {
  getFormData,
  getRawFormData,
  setFormErrors,
  validateForm,
  type Form,
} from 'vue3-form';
import axios, { isCancel, type AxiosRequestConfig } from 'axios';
import type { HTTPError, HTTPErrorData, HTTPResponseData } from '~~/types/http';

export type ServiceNames = 'casava' | 'smedan';

type APIRequestConfig<T, HttpResponseWrapper = HTTPResponseData<T>> = {
  method?: string;
  headers?: object;

  authorize?: boolean;
  autoLoad?: boolean;
  autoReload?: boolean;
  initialData?: T;
  initialLoadingState?: boolean;

  service?: ServiceNames;

  onSuccess?: (data: HttpResponseWrapper) => void;
  onError?: (error: HTTPErrorData) => void;
  onFinish?: () => void;
} & AxiosRequestConfig;

export const useServiceBaseUrl = (service?: ServiceNames) => {  
  const {
    public: { casava, smedan },
  } = useRuntimeConfig();

  switch (service) {
    case 'smedan':
      return smedan.baseUrl;
    case 'casava':
    default:
      return casava.baseUrl;
  }
}

export const useReactiveApi = <T, HttpResponseWrapper = HTTPResponseData<T>>(
  baseConfig: APIRequestConfig<T, HttpResponseWrapper>
) => {
  const config = ref(baseConfig);

  const { signOut, sessionToken } = useAuth();
  const baseURL = useServiceBaseUrl(config.value.service);

  const isLoading = ref(false);
  const data = ref<HttpResponseWrapper>();
  const error = ref<Error | HTTPError>();

  const load = async () => {
    const { headers = {} } = config.value;
    isLoading.value = true;
    return await new Promise((resolve, reject) => {
      if (config.value.authorize) {
        headers.Authorization = `Bearer ${sessionToken}`;
      }
      axios<HttpResponseWrapper>({
        ...config.value,
        headers,
        baseURL,
      })
        .then((response) => {
          data.value = response?.data;
          resolve(response?.data);
          config.value?.onSuccess?.(response.data);

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

          if (config.value.authorize && error_.response?.status === 401) {
            return signOut();
          }

          reject(error__);
          config.value?.onError?.(error__);
        })
        .finally(() => {
          isLoading.value = false;
          config.value?.onFinish?.();
        });
    });
  };

  if (config.value.autoLoad) load();

  watch(config, (config) => config.autoLoad && load());

  return { isLoading, data, error, config, load };
};

export const useReactiveFormRequest = <T>(
  form: Ref<Form>,
  {
    useFormData,
    wrapperKey,
    ...baseConfig
  }: APIRequestConfig<T> & { useFormData?: boolean; wrapperKey?: string }
) => {
  const { load, config, ...data } = useReactiveApi<T>({
    ...baseConfig,
    onSuccess: (data) => {
      form.value.success = data?.message ?? null;
      baseConfig.onSuccess?.(data);
    },
    onError: (error) => {
      form.value.error = error.message ?? null;
      error.errors && setFormErrors(form, error.errors);
      baseConfig.onError?.(error);
    },
    onFinish: () => {
      form.value.loading = false;
      baseConfig.onFinish?.();
    },
  });

  const submit = async () => {
    if (!validateForm(form)) return;

    form.value.loading = true;
    form.value.error = null;
    form.value.success = null;

    const data = useFormData ? getFormData(form) : getRawFormData(form);

    config.value.data = wrapperKey ? { [wrapperKey]: data } : data;

    // await load();
  };

  return { ...data, submit };
};
