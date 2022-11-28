import { URLExt } from '@jupyterlab/coreutils';
import { ServerConnection } from '@jupyterlab/services';
/**
 * Call the API extension
 *
 * @param endPoint API REST end point for the extension
 * @param init Initial values for the request
 * @returns The response body interpreted as JSON
 */
export async function requestAPIServer(endPoint = '', init = {}) {
    // Make request to Jupyter API
    const settings = ServerConnection.makeSettings();
    // console.log(JSON.stringify(settings));
    const requestUrl = URLExt.join(settings.baseUrl, 'docker-host', endPoint);
    let response;
    try {
        response = await ServerConnection.makeRequest(requestUrl, init, settings);
    }
    catch (error) {
        throw new ServerConnection.NetworkError(error);
    }
    const data = await response.json();
    if (!response.ok) {
        throw new ServerConnection.ResponseError(response, data.message);
    }
    return data;
}