import axios from 'axios';

interface IRequestParams {
  url: string;
  data?: any;
  urlParams?: any;
}

interface IRequestParamsWithMethod extends IRequestParams {
  method: 'post' | 'get' | 'patch';
}

const objToUri = (params: any) =>
  Object.keys(params)
    .map(k => {
      return encodeURIComponent(k) + '=' + encodeURIComponent(params[k]);
    })
    .join('&');

//* Можно вынести в переменные окружения или куда вообще нужно
const config = { API_URL: 'http://193.124.114.46:3001' };

class Api {
  public get = (params: IRequestParams) => {
    return this.request({ ...params, method: 'get' });
  };
  public post = (params: IRequestParams) => {
    return this.request({ ...params, method: 'post' });
  };

  public patch = (params: IRequestParams) => {
    return this.request({ ...params, method: 'patch' });
  };

  public request = async (params: IRequestParamsWithMethod) => {
    const urlParams = params.urlParams ? `/?${objToUri(params.urlParams)}` : '';
    const token = sessionStorage.getItem('id_token');
    const response = await axios({
      ...params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      url: `${config.API_URL}/${params.url}${urlParams}`,
    });
    return response;
  };
}
export const api = new Api();
