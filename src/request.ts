import { add } from './db';
import { METHOD_POST } from './constants/methods';

import { PATH_DELIM, NO_OP } from './constants/request';

/**
 * This function splits a url path and returns the segments
 *
 * @param {string} path
 * @returns {string[]}
 */
export function getPathParams(path: string): string[] {
  return path.slice(1).split(PATH_DELIM);
}

/**
 * This function returns the path and query strings of a url
 *
 * @param {string} path
 * @returns {[string, string[]]}
 */
export function getResource(path: string): [string, string[]] {
  const [resource, ...rest] = getPathParams(path);
  return [resource, rest];
}

/**
 * This function takes a POST request and handles adding the data
 *
 * @param {Object} request
 * @returns {Promise<void>}
 */
export async function handlePost(request: Request): Promise<void> {
  const { pathname } = new URL(request.url);
  const [entity] = getResource(pathname);
  const data = await request.json();
  add(entity, data);
}

const methods = new Map([[METHOD_POST, handlePost]]);

/**
 * This function takes a request and calls the appropriate handler method
 *
 * @param {Object} request
 * @returns {void}
 */
export function handleRequest(request: Request): void {
  const fnHandler = methods.get(request.method) || NO_OP;

  fnHandler(request);
}
