export const applicationColors = {
  black: {
    bg: 'bg-black',
    border: 'border-black',
    text: 'text-white',
    focus: {
      bg: 'focus:bg-gray-500',
      border: 'focus:border-gray-500',
    },
    hover: {
      bg: 'hover:bg-gray-700',
      border: 'hover:border-gray-700',
    },
  },
  'black:ghost': {
    bg: 'bg-transparent',
    border: 'border-transparent',
    text: 'text-black',
    focus: {
      bg: 'focus:bg-gray-200',
      border: 'focus:border-gray-200',
    },
    hover: {
      bg: 'hover:bg-gray-100',
      border: 'hover:border-gray-100',
    },
  },
  'black:soft': {
    bg: 'bg-gray-200',
    border: 'border-gray-200',
    text: 'text-black',
    focus: {
      bg: 'focus:bg-black',
      border: 'focus:border-black',
    },
    hover: {
      bg: 'hover:bg-gray-300',
      border: 'hover:border-gray-300',
    },
  },
  'black:outline': {
    bg: 'bg-transparent',
    border: 'border-black',
    text: 'text-black',
    focus: {
      bg: 'focus:bg-black',
      border: 'focus:border-black',
    },
    hover: {
      bg: 'hover:bg-gray-300',
      border: 'hover:border-gray-300',
    },
  },
  blue: {
    bg: 'bg-blue-500',
    border: 'border-blue-500',
    text: 'text-white',
    focus: {
      bg: 'focus:bg-blue-700',
      border: 'focus:border-blue-700',
    },
    hover: {
      bg: 'hover:bg-blue-600',
      border: 'hover:border-blue-600',
    },
  },
  'blue:outline': {
    bg: 'bg-white',
    border: 'border-blue-500',
    text: 'text-blue-500',
    focus: {
      bg: 'focus:bg-blue-100',
      border: 'focus:border-blue-100',
    },
    hover: {
      bg: 'hover:bg-blue-50',
      border: 'hover:border-blue-50',
    },
  },
  gray: {
    bg: 'bg-gray-500',
    border: 'border-gray-500',
    text: 'text-white',
    focus: {
      bg: 'focus:bg-gray-600',
      border: 'focus:border-gray-600',
    },
    hover: {
      bg: 'hover:bg-gray-400',
      border: 'hover:border-gray-400',
    },
  },
  'gray:soft': {
    bg: 'bg-gray-200',
    border: 'border-gray-200',
    text: 'text-gray-600',
    focus: {
      bg: 'focus:bg-gray-400',
      border: 'focus:border-gray-400',
    },
    hover: {
      bg: 'hover:bg-gray-300',
      border: 'hover:border-gray-300',
    },
  },
  green: {
    bg: 'bg-green-500',
    border: 'border-green-500',
    text: 'text-white',
    focus: {
      bg: 'focus:bg-green-700',
      border: 'focus:border-green-700',
    },
    hover: {
      bg: 'hover:bg-green-600',
      border: 'hover:border-green-600',
    },
  },
  'green:soft': {
    bg: 'bg-green-50',
    border: 'border-green-50',
    text: 'text-green-600',
    focus: {
      bg: 'focus:bg-green-200',
      border: 'focus:border-green-200',
    },
    hover: {
      bg: 'hover:bg-green-100',
      border: 'hover:border-green-100',
    },
  },
  orange: {
    bg: 'bg-orange-500',
    border: 'border-orange-500',
    text: 'text-white',
    focus: {
      bg: 'focus:bg-orange-700',
      border: 'focus:border-orange-700',
    },
    hover: {
      bg: 'hover:bg-orange-600',
      border: 'hover:border-orange-600',
    },
  },
  purple: {
    bg: 'bg-purple-500',
    border: 'border-purple-500',
    text: 'text-white',
    focus: {
      bg: 'focus:bg-purple-700',
      border: 'focus:border-purple-700',
    },
    hover: {
      bg: 'hover:bg-purple-600',
      border: 'hover:border-purple-600',
    },
  },
  'purple:soft': {
    bg: 'bg-purple-50',
    border: 'border-purple-50',
    text: 'text-purple-600',
    focus: {
      bg: 'focus:bg-purple-200',
      border: 'focus:border-purple-200',
    },
    hover: {
      bg: 'hover:bg-purple-100',
      border: 'hover:border-purple-100',
    },
  },
  red: {
    bg: 'bg-red-500',
    border: 'border-red-500',
    text: 'text-white',
    focus: {
      bg: 'focus:bg-red-600',
      border: 'focus:border-red-600',
    },
    hover: {
      bg: 'hover:bg-red-400',
      border: 'hover:border-red-400',
    },
  },
  'red:soft': {
    bg: 'bg-red-50',
    border: 'border-red-50',
    text: 'text-red-600',
    focus: {
      bg: 'focus:bg-red-200',
      border: 'focus:border-red-200',
    },
    hover: {
      bg: 'hover:bg-red-100',
      border: 'hover:border-red-100',
    },
  },
  white: {
    bg: 'bg-white',
    border: 'border-gray-300',
    text: 'text-pink-500',
    focus: {
      bg: 'focus:bg-gray-300',
      border: 'focus:border-gray-200',
    },
    hover: {
      bg: 'hover:bg-gray-200',
      border: 'hover:border-gray-100',
    },
  },
  pink: {
    bg: 'bg-pink-500',
    border: 'border-pink-500',
    text: 'text-white',
    focus: {
      bg: 'focus:bg-pink-700',
      border: 'focus:border-pink-700',
    },
    hover: {
      bg: 'hover:bg-pink-600',
      border: 'hover:border-pink-600',
    },
  },
};
export const getAppColor = (
  color: keyof typeof applicationColors = 'black',
  config: GetApplicationColorConfig = []
) => {
  const hasBg = config.includes('bg');
  const hasBorder = config.includes('border');
  const hasFocus = config.includes('focus');
  const hasHover = config.includes('hover');
  const hasText = config.includes('text');

  const result: Array<string | undefined> = [];
  if (hasBg) result.push(applicationColors[color].bg);
  if (hasBorder) result.push(applicationColors[color].border);
  if (hasText) result.push(applicationColors[color].text);

  if (hasFocus) {
    if (hasBg) result.push(applicationColors[color]?.focus?.bg);
    if (hasBorder) result.push(applicationColors[color]?.focus?.border);
    // if (hasText) result.push(applicationColors[color]?.focus?.text)
  }
  if (hasHover) {
    if (hasBg) result.push(applicationColors[color]?.hover?.bg);
    if (hasBorder) result.push(applicationColors[color]?.hover?.border);
    // if (hasText) result.push(applicationColors[color]?.hover?.text)
  }
  return result.join(' ');
};

export type ApplicationColor = keyof typeof applicationColors;
export type GetApplicationColorConfig = Array<
  'bg' | 'border' | 'text' | 'focus' | 'hover'
>;
