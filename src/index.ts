import { b2_authorize_account, b2_list_file_names } from "./backblaze";

/**
 * Typescript interface for the environment and secrets
 */
export interface Env {
	B2_BUCKET_NAME: string;
	B2_BUCKET_ID: string;
	B2_APP_ID: string;
	B2_APP_KEY: string;
}

export default {
	/**
	 * This is the entry point for your Worker code.
	 * Whenever you send an API request to your Worker, this is the function that will run.
	 */
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		// Parse the request URL
		const url = new URL(request.url);

		// Homepage
		if (url.pathname === '/' && request.method === 'GET') {
			return new Response('Hello, world!', {
				headers: { 'content-type': 'text/plain' },
			});
		}

		// List files API
		if (url.pathname === '/api/v1/list_all_files' && request.method === 'GET') {
			// If the file list is already cached, return that instead of fetching from the b2 API
			const cacheKey = new Request(request.url, request);
			let response = await caches.default.match(cacheKey);
			if (response) {
				return response;
			}

			// Authorize account
			const authorizationData = await b2_authorize_account(env.B2_APP_ID, env.B2_APP_KEY);

			// Get the authorization data
			const downloadUrl = authorizationData.apiInfo.storageApi.downloadUrl;
			const apiUrl = authorizationData.apiInfo.storageApi.apiUrl;
			const authorizationToken = authorizationData.authorizationToken;

			// List all files in the bucket
			const listFilesData = await b2_list_file_names(apiUrl, authorizationToken, env.B2_BUCKET_ID);

			// Simplify the list of files
			const filesInBucket = listFilesData.files
				.filter(file => file.action === "upload") // Only include files that were uploaded
				.map(file => ({
					fileName: file.fileName,
					url: `${downloadUrl}/file/${env.B2_BUCKET_NAME}/${file.fileName}`,
					contentType: file.contentType,
					contentLength: file.contentLength,
					uploadTimestamp: file.uploadTimestamp,
					fileInfo: file.fileInfo,
				}));

			// Create a response with the list of files
			response = new Response(JSON.stringify(filesInBucket), {
				headers: {
					'Content-Type': 'application/json',
					'Cache-Control': 's-maxage=3600' // 1 hour cache
				},
			});

			// Cache the response
			ctx.waitUntil(caches.default.put(cacheKey, response.clone()));

			return response;
		}

		// If the request does not match any of the above, return a 404
		return new Response('Not Found', { status: 404 });
	},
};
