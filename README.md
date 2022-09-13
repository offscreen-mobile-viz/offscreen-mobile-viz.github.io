# offscreen-mobile-viz
> Developed by `Prof. Alark Joshi` and `Asst. Colm Lang`

This project aims to serve as an example of effective off-screen mobile data visualization techniques.

## Installation

1. Install and use the correct version of node using [NVM](https://github.com/nvm-sh/nvm)
    ```sh
    nvm install
    # and
    nvm use
    ```

2. Navigate to this project's directory
    ```sh
    cd path/to/offscreen-mobile-viz
    ```

3. Install dependencies
    ```sh
    npm i
    ```

4. Start the development server
    ```sh
    npm run dev
    ```

## Building and Running for Production

1. Generate a full static production build

   ```sh
   npm run build
   ```

2. Preview the site as it will appear once deployed

   ```sh
   npm run preview
   ```
  
## Deploying to gh-pages
  As long as you are a contributer to this repository, upon pushing to `main`, GH Actions will [Build & Deploy to the gh-pages branch](https://github.com/offscreen-mobile-viz/offscreen-mobile-viz.github.io/actions/workflows/deploy.yml).
