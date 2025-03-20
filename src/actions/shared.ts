export function paramsToObject<T>(searchParams: URLSearchParams) {
    const params: {[key: string]: any } = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params as T;
  }