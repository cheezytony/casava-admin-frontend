// import toastr from 'toastr';

export const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
  // toastr.success('Text copied to clipboard');
};

export const isEmpty = (data: any) => {
  switch (data?.constructor) {
    case Array:
    case String:
      return data.length === 0;
    case Object:
      return Object.keys(data).length === 0;
    case Number:
      return data === 0;
    default:
      return !data;
  }
};

type TransformFunction = (...arguments_: any[]) => any;

export const optional = (
  value: any,
  transforms: (TransformFunction | [TransformFunction, ...any[]])[] = [],
  replacement = 'N/A',
) => {
  if (!value) return replacement;
  return transforms.reduce((v, fun) => {
    if (Array.isArray(fun)) {
      const [f, ...arguments_] = fun;
      return f(v, ...arguments_);
    }
    return fun(v);
  }, value);
};
