export type HTTPResponse<APIResource = any> = {
  data?: APIResource;
  message?: string;
  status: number;
  statusText: string;
};
export type HTTPResponseData<APIResource = any> = HTTPResponse<APIResource>;

export type HTTPPaginatedResponse<APIResource> = {
  success: boolean;
  data?: {
    data: APIResource[];
    meta: {
      current_page: number;
      from: number;
      last_page: number;
      path: string;
      per_page: number;
      to: number;
      total: number;
    };
  };
};
export type HTTPPaginatedResponseData<APIResource = any> =
  HTTPPaginatedResponse<APIResource>['data'];

export type HTTPError = {
  response?: HTTPResponse;
};

export type HTTPErrorData = HTTPResponse['data'] & {
  errors?: Record<string, string[]>;
  status?: HTTPResponse['status'];
  statusText?: HTTPResponse['statusText'];
};
