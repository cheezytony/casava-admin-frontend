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

export type APIRequestConfig = {
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
  { onSuccess, onError, onFinish }: APIResponseHandlers<T> = {}
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
        ...config.value,
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

export const useFormRequest = <T>(
  form: Ref<Form>,
  {
    useFormData = false,
    wrapperKey,
    ...config
  }: APIRequestConfig & { useFormData?: boolean, wrapperKey?: string },
  { onSuccess, onError, onFinish }: APIResponseHandlers<T>
) => {
  const { load, update, ...data } = useApiRequest<T>(
    config,
    {
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
    }
  );
  const submit = async () => {
    if (!validateForm(form)) return;

    form.value.loading = true;
    form.value.error = null;
    form.value.success = null;

    const data = useFormData ? getFormData(form) : getRawFormData(form);
    
    update({ data });
    
    await load();
  };

  return { ...data, submit };
};
