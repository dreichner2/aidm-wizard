export const isValidUrl = (urlString: string): boolean => {
  if (!urlString || urlString.trim() === '') {
    return false;
  }
  
  try {
    new URL(urlString);
    return true;
  } catch (err: unknown) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return false;
  }
};

export const extractOriginPath = (urlString: string): { origin: string, path: string } | null => {
  if (!isValidUrl(urlString)) {
    return null;
  }

  try {
    const url = new URL(urlString);
    return {
      origin: url.origin,
      path: url.pathname + url.search + url.hash
    };
  } catch (err: unknown) { // eslint-disable-line @typescript-eslint/no-unused-vars
    return null;
  }
};
