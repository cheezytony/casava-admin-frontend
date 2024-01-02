// eslint-disable-next-line import/named
import { ComputedRef, Ref, reactive, ref, watch } from 'vue';

export const useAssetFunction = () => {
  const {
    public: { assetsBaseURL },
  } = useRuntimeConfig();

  return (uri: string) => {
    return uri.replace(/(^|^\/)/, assetsBaseURL?.replace(/($|\/$)/, '/'));
  };
}

export const useAsset = (uri: ComputedRef<string | undefined>) => {
  const {
    public: { assetsBaseURL },
  } = useRuntimeConfig();

  return computed(() => {
    return uri.value?.replace(
      /(^|^\/)/,
      assetsBaseURL?.replace(/($|\/$)/, '/'),
    );
  });
};

type OnTickEventListener = (timeLeft: number) => void;
type OnFinishEventListener = () => void;

interface EventListenerRegistry {
  onTick: Array<OnTickEventListener>;
  onFinish: Array<OnFinishEventListener>;
}

export const useCountdown = (duration = 30, autoStart = true) => {
  const eventListeners: EventListenerRegistry = {
    onFinish: [],
    onTick: [],
  };

  const timeout = ref<ReturnType<typeof setTimeout>>();
  const timeLeft = ref(duration);
  const timeLeftFormatted = computed(() => {
    const seconds = timeLeft.value % 60;
    const minutes = Math.floor(timeLeft.value / 60);
    return [
      minutes < 10 ? `0${minutes}` : minutes,
      seconds < 10 ? `0${seconds}` : seconds,
    ].join(':');
  });
  const resume = () => {
    if (timeLeft.value <= 0) {
      eventListeners.onFinish.forEach((listener) => listener());
      return stop();
    }
    timeLeft.value--;
    timeout.value = setTimeout(resume, 1000);
    eventListeners.onTick.forEach((listener) => listener(timeLeft.value));
  };
  const start = () => {
    resume();
  };
  const stop = () => {
    clearTimeout(timeout.value);
  };
  const restart = () => {
    stop();
    timeLeft.value = duration;
    start();
  };
  const onTick = (listener: OnTickEventListener) => {
    eventListeners.onTick.push(listener);
  };
  const onFinish = (listener: OnFinishEventListener) => {
    eventListeners.onFinish.push(listener);
  };

  onMounted(() => {
    if (autoStart) start();
  });

  return {
    duration,
    timeLeft,
    timeLeftFormatted,
    start,
    stop,
    resume,
    restart,
    onTick,
    onFinish,
  };
};

export const useDebounce = (
  function_: (...parameters: any[]) => unknown,
  timeout = 300,
) => {
  let allowFunction = true;
  return (...parameters: unknown[]) => {
    if (!allowFunction) return;
    function_(...parameters);
    allowFunction = false;
    setTimeout(() => (allowFunction = true), timeout);
  };
};

export type DisclosureEventListener = (isOpen?: boolean) => void;

export interface DisclosureEventListenerRegistry {
  close: Array<DisclosureEventListener>;
  open: Array<DisclosureEventListener>;
  toggle: Array<DisclosureEventListener>;
}

export interface Disclosure {
  isOpen: Ref<boolean>;
  open: () => void;
  close: () => void;
  toggle: () => void;
  update: (value: boolean) => void;
  onClose: (callback: DisclosureEventListener) => void;
  onOpen: (callback: DisclosureEventListener) => void;
  onToggle: (callback: DisclosureEventListener) => void;
}

export const useDisclosure = (initialValue = false) => {
  const listeners: DisclosureEventListenerRegistry = reactive({
    close: [],
    open: [],
    toggle: [],
  });
  const isOpen = ref(initialValue);
  const close = () => (isOpen.value = false);
  const open = () => (isOpen.value = true);
  const toggle = () => (isOpen.value = !isOpen.value);
  const update = (value: boolean) => (isOpen.value = value);
  const onClose = (callback: DisclosureEventListener) => {
    listeners.close.push(callback);
  };
  const onOpen = (callback: DisclosureEventListener) => {
    listeners.open.push(callback);
  };
  const onToggle = (callback: DisclosureEventListener) => {
    listeners.toggle.push(callback);
  };

  watch(isOpen, (state) => {
    listeners.toggle.forEach((callback) => callback(state));

    if (state) {
      listeners.open.forEach((callback) => callback());
    } else {
      listeners.close.forEach((callback) => callback());
    }
  });

  return {
    isOpen,
    close,
    open,
    toggle,
    update,
    onClose,
    onOpen,
    onToggle,
  } as Disclosure;
};
