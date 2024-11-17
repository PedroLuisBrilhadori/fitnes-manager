export type CreateHeadersConfig = {
  json?: boolean;
};

export const createHeaders = ({ json = true }: CreateHeadersConfig) => {
  const headers = new Headers();

  if (json) {
    headers.append('Content-Type', 'application/json');
  }

  return headers;
};
