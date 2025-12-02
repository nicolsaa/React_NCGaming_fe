let sharedImageBase64: string = '';

export const setSharedImageBase64 = (value: string) => {
  sharedImageBase64 = value;
};

export const getSharedImageBase64 = (): string => {
  return sharedImageBase64;
};
