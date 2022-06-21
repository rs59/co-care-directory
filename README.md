# Colorado Care Directory by the Behavioral Health Administration

## Notice

Right now this repo is just getting started and has been setup based on [github-repo-starter-template](https://github.com/jeffmaher/github-repo-starter-template).

This text should be replaced with documentation relevant to developing and operating this application in the future.

## Dev Setup

This setups up a dev environment within a container to reduce "it works on my machine" problems and to create a clean, consistent environment (but adds some complexity compared to the non-container setup below). Optionally, it pairs really well with [VSCode's Remote Container extension pack](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.vscode-remote-extensionpack).

### Prerequisites

- [Docker for Desktop](https://www.docker.com/products/docker-desktop/)

### Steps

Run these instructions whenever you change the `Dockerfile` or want to reset your environment.

1. Clone this repo
1. Navigate into its base directory
1. Run:
   - `docker build -t coloradodigitalservice/co-care-directory .`
1. Then, you can jump into the container's command line:
   - `docker run -p 3000:3000 -it -v $PWD:/app --rm coloradodigitalservice/co-care-directory sh`
   - Note: `$PWD` as the full path to the base directory. Change if you need something different.
1. Download dependencies:
   - `npm install`
   - Run whenever your `package.json` changes
1. Start the debug server:
   - `npm start`
1. Access the app at `http://localhost:3000`

## Dev Setup (non-container)

This is a simple, non-containerized setup, but might be impacted by other things installed on your machine (i.e. other devs might experience things differently than you).

### Prerequisites

Install these items first:

- [Node.js](https://nodejs.org/en/download/) at version 16.11.x LTS

### Steps

1. Clone this repo
1. Navigate into its base directory
1. Download dependencies:
   - `npm install`
   - Run whenever your `package.json` changes
1. Start the debug server:
   - `npm start`
1. Access the app at `http://localhost:3000`

## Heroku Review App Environment Setup

1. Create a pipeline
1. Connect to GitHub
1. Enable Review Apps, choosing these options:
   - Automatically create review apps for new PRs

## Heroku App Environment Setup

Good for ondemand environments in Heroku running in debug mode.

To do this, first install and login to [the Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli).

1. Create a new app
1. From the app's settings, go to the `Deploy` tab
1. Go to either `Automatic deploys` or `Manual deploys` and choose the branch you'd like deployed and trigger a deployment.
1. The deployment will initially fail because it doesn't understand that it is a container-based app. Issue this command from the Heroku CLI:
   - `heroku stack:set container -a (app name)`
1. Trigger another deployment

## Processing Data

We use a standalone script to transform a CSV export into a cleaned JSON file. To process data, run:

```
npm run processdata
```
