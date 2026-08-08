# Shan Ye — About Me

A dependency-free, one-page professional website built for GitHub Pages.

## Preview locally

Run a local static server from the repository root:

```bash
python3 -m http.server 4173
```

Then open [http://localhost:4173](http://localhost:4173).

## Verify

If Node.js and npm are installed, run:

```bash
npm test
```

The test command uses only Node's built-in test runner; it does not download or require any packages.

## Publish with GitHub Pages

1. Push this repository to GitHub.
2. In the repository, open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Select the branch to publish (for example, `main`) and select the repository root (`/`).
5. Save. GitHub Pages will publish the root-level static files without a build step.

GitHub Pages can take a few minutes to make the site available. Subsequent pushes to the selected branch update the site automatically.
