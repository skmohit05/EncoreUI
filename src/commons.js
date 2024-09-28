import _, { isString } from 'lodash';
import JSEncrypt from 'jsencrypt';

let apiServerURL = 'http://localhost:8080';
let authToken;

const publicKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA60pz'
  + 'EmfFVgYPRLN7Hi7Bdwdg2mR+h+6jV4HYQGLxj/UIOqX2ffXr4paUjaj5fIu5WxG/pGHND7f/2FIIXUGveWq'
  + 'lfvXYK3xmDPnh/5+o2UhDvgC750aeeHEp04bN9yZ2ztg7HzsadmFziE/CUr6+D7IZ3vqz077eTGvqZ+eCUC'
  + 'aAo0IHGsyC4Bte7+LXNw7XBhkFpzAyJSxcC6Wf7x4eIFYUKeNQXLI9qFkacXP7LwjHLpUmD1rIK223mWyMt'
  + 'y7/dm+HfRWmAThxK+twfqza9LvVCrvri1KYiwJTaN+copFG5P15EjjepIhXtLjGl0D8EkQ6om2CWs2gmwgw'
  + 'yJGlhwIDAQAB';

const getURL = (urlParts) => _.reduce(urlParts, (url, urlPart) => url + '/' + encodeURIComponent(urlPart), '');

const getParams = (params) =>
  params ? _.reduce(params, (result, value, key) =>
    result + (result !== '?' ? '&' : '') + encodeURIComponent(key) + '=' + encodeURIComponent(value) , '?') : '';

const setAPIServerURL = serverURL => apiServerURL = _.isNil(serverURL) ? '' : serverURL;

const setAuthToken = token => authToken = token;

const doGet = async (endPoint, queryParam) => {
  const headers = {'Content-Type': 'application/json'};
  if(!_.isNil(authToken)) {
    _.assign(headers, {'Authorization': 'Bearer ' + authToken});
  }

  return fetch(apiServerURL + getURL(endPoint) + getParams(queryParam), {
    method: 'GET',
    headers
  })
  .then(handleErrors)
  .catch(handleErrors);
};

const doPut = async (endPoint, body, queryParam) => {
  const headers = {'Content-Type': 'application/json'};
  if(!_.isNil(authToken)) {
    _.assign(headers, {'Authorization': 'Bearer ' + authToken});
  }

  return fetch(apiServerURL + getURL(endPoint) + getParams(queryParam), {
    method: 'PUT',
    headers,
    body: JSON.stringify(body)
  })
  .then(handleErrors)
  .catch(handleErrors);
};

const doPost = async (endPoint, body, queryParam) => {
  const headers = {'Content-Type': 'application/json'};
  if(!_.isNil(authToken)) {
    _.assign(headers, {'Authorization': 'Bearer ' + authToken});
  }

  return fetch(apiServerURL + getURL(endPoint) + getParams(queryParam), {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  })
  .then(handleErrors)
  .catch(handleErrors);
};

const doDelete = async (endPoint, queryParam) => {
  const headers = {'Content-Type': 'application/json'};
  if(!_.isNil(authToken)) {
    _.assign(headers, {'Authorization': 'Bearer ' + authToken});
  }

  return fetch(apiServerURL + getURL(endPoint) + getParams(queryParam), {
    method: 'DELETE',
    headers
  })
  .then(handleErrors)
  .catch(handleErrors);
};

const handleErrors = async (response) => {
  // when this method is invoked as part of then handling, it
  // could raise an exception, that can get into the immediate
  // catch which invokes this method again with the thrown object.
  // Since the response is already processed by this method
  // the parameter object is just thrown during the second call
  // (_fetch_error_handled is set to true when handled
  // the first time and during second call is thrown again)
  if (_.has(response, '_fetch_error_handled')) {
    throw response;
  }

  if (!response.ok) {
    const json = await getJson(response);
    const statusData = _.pick(response, ['status', 'statusText', 'url']);
    const data = {...statusData, json, '_fetch_error_handled': true};
    throw data;
  } else {
    return response;
  }
}

const getJson = async(response) => {
  try {
    const json = await response.json();
    return json;
  } catch (err) {
    return null;
  }
}

const doPostBasicAuth = async (endPoint, email, password, queryParam) => {
  const headers = {'Content-Type': 'application/json'};
  const encrPwd = getEncryptedPassWordString(password);
  _.assign(headers, {'Authorization': 'Basic ' + btoa(email + ':' + encrPwd) });
  return fetch(apiServerURL + getURL(endPoint) + getParams(queryParam), {
    method: 'POST',
    headers
  })
  .then(handleErrors)
  .catch(handleErrors);
}

const getEncryptedPassWordString = (text) => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(publicKey);
  return encrypt.encrypt(text);
};


export {
  setAPIServerURL, setAuthToken,
  doGet,
  doPostBasicAuth,
  doPost,
  doPut,
  doDelete,
  getEncryptedPassWordString
}
