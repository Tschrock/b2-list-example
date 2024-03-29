/**
 * Typescript interface for b2_authorize_account
 */
export interface AuthorizeAccountResponse {
	accountId: string;
	apiInfo: {
		storageApi: {
			apiUrl: string;
			downloadUrl: string;
		}
	}
	authorizationToken: string;
	applicationKeyExpirationTimestamp: number;
}

/**
 * Typescript interface for b2_list_file_names
 */
export interface ListFilesResponse {
	files: {
		action: "start" | "upload" | "hide" | "folder";
		contentLength: number;
		contentSha1: string;
		contentType: string;
		fileId: string;
		fileInfo: {
			src_last_modified_millis: string;
		}
		fileName: string;
		uploadTimestamp: number;
	}[];
	nextFileName: string;
}

/**
 * Typescript interface for B2 API error responses
 */
export interface ErrorResponse {
	status: number;
	code: string;
	message: string;
}

/**
 * Custom error class for B2 API errors
 */
export class B2Error extends Error {
	constructor(public response: ErrorResponse) {
		super();
	}
}

/**
 * Authorize an account with the given accountId and applicationKey
 * @param accountId The account ID
 * @param applicationKey The application key
 * @returns The response from the API
 */
export async function b2_authorize_account(accountId: string, applicationKey: string): Promise<AuthorizeAccountResponse> {
	const response = await fetch('https://api.backblazeb2.com/b2api/v3/b2_authorize_account', {
		method: 'GET',
		headers: {
			Authorization: `Basic ${btoa(`${accountId}:${applicationKey}`)}`,
		},
	});

	if (!response.ok) {
		throw new B2Error(await response.json());
	}

	return response.json();
}

/**
 * List all files in the bucket
 * @param apiUrl The API URL
 * @param authorizationToken The authorization token
 * @param bucketId The bucket ID
 * @returns The response from the API
 */
export async function b2_list_file_names(apiUrl: string, authorizationToken: string, bucketId: string): Promise<ListFilesResponse> {
	const response = await fetch(`${apiUrl}/b2api/v3/b2_list_file_names?bucketId=${bucketId}`, {
		method: 'GET',
		headers: {
			Authorization: authorizationToken,
		},
	});

	if (!response.ok) {
		throw new B2Error(await response.json());
	}

	return response.json();
}
