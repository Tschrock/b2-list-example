b2-list-example
================

A basic example of using a Cloudflare Worker to list files in a Backblaze B2 bucket.

## Setup
Clone the repo and install the npm packages

```sh
$ npm install
```

If you haven't already, you will also need to log into cloudflare and allow wrangler to access your account.

```sh
$ npx wrangler login
```

## Development
For local development, you will need to store the app secrets in a `.dev.env` file in the root of the project.

```ini
# .dev.env
B2_BUCKET_NAME=my-bucket-name
B2_BUCKET_ID=my-bucket-id
B2_APP_ID=my-app-id
B2_APP_KEY=my-app-key
```

Then you can run a local copy of the worker using the `wrangler dev` command.

```sh
$ npx wrangler dev
```

## Publishing
First, you will need to set the following secrets in your Cloudflare Worker:

- `B2_BUCKET_NAME`: The name of the B2 bucket you want to list files from
- `B2_BUCKET_ID`: The ID of the B2 bucket you want to list files from
- `B2_APP_ID`: Your Backblaze B2 application ID
- `B2_APP_KEY`: Your Backblaze B2 application key

You can set these secrets using the `wrangler secret` command.

```sh
$ npx wrangler secret put B2_BUCKET_NAME
```

Then, to publish the worker to Cloudflare, use the `wrangler deploy` command.

```sh
$ npx wrangler deploy
```

## Usage
Once published, you can use the `/api/v1/list_all_files` API to list all files in the B2 bucket.

Curl:
```sh
$ curl https://<worker_url>/api/v1/list_all_files
```

JS:
```js
fetch('https://<worker_url>/api/v1/list_all_files')
  .then(response => response.json())
  .then(data => console.log(data));
```

The response will look like this:
```json
[
	{
		"name": "/folder/file1.txt",
		"size": 12345,
		"contentType": "text/plain",
		"uploadTime": "2021-01-01T00:00:00Z",
		"url": "https://f001.backblazeb2.com/file/my-bucket-name/folder/file1.txt",
		"fileInfo": { }
	},
	{
		"name": "file2.jpg",
		"size": 54321,
		"contentType": "image/jpeg",
		"uploadTime": "2021-01-01T00:00:00Z",
		"url": "https://f001.backblazeb2.com/file/my-bucket-name/file2.jpg",
		"fileInfo": { }
	}
]
```
