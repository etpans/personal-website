# Personal website

My personal website to showcase my projects and work, with some fun moooving elements involved. Visit https://evantran.ca/ to check it out.

## Build and run

With Docker installed, run these commands from the project root:

```sh
docker build -t personal-website .
docker run --rm -p 8080:80 personal-website
```

Open [localhost:8080](http://localhost:8080) to view the site.

To build the Tailwind stylesheet directly with Node.js and npm:

```sh
npm ci
npm run build
```

Edit shared styles in `src/input.css`; the build generates `style.css`.
