cyber-b2-example
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

Then, to publish the worker to Cloudflare, use the `wrangler publish` command.

```sh
$ npx wrangler publish
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
