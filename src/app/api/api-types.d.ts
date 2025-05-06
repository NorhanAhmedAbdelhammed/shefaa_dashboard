declare interface IFormField extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  title: string;
  placeholder: string;
  type?: string;
  pattern?: string;
  wrapperClassName?: string;
}

interface IEndpointRequest<Params, Body> {
  params: Params;
  body: Body;
}

interface IEndpointResponse<DataResponseType, ErrorResponseType> {
  success: boolean;
  data?: DataResponseType;
  pagination?: Pagination;
  error?: ErrorResponseType;
}

declare interface Pagination {
  totalPages: number;
  totalItems: number;
  page: number;
  perPage: number;
}
