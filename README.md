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

All pages follow the browser's system appearance preference using CSS
`prefers-color-scheme`, with a light default and a dark palette when requested.
Changes to the preference apply automatically. Cow-page controls share the theme;
the moon landscape retains its night-time artwork.

## Icons

Footer icons and the cow beside the homepage link use
[Font Awesome Free 7.3.1](https://github.com/FortAwesome/Font-Awesome/tree/7.3.1).
Two self-hosted WOFF2 subsets in `assets/fonts/` contain only GitHub, LinkedIn,
envelope, graduation-cap, code and cow (2.1 KB total). Icon styling and character
codes live in `src/input.css`; no icon CDN or JavaScript is required. Decorative
icon spans are hidden from assistive technology; footer links have accessible names.
The upstream license is retained in `assets/fonts/LICENSE.txt`.

The font files are checked in, so normal builds need no Python tooling. To add
icons or update the pinned version, edit `src/build-icons.py` and the matching
CSS definitions, then regenerate the subsets in a container:

```sh
docker run --rm --user "$(id -u):$(id -g)" -e HOME=/tmp -v "$PWD:/app" -w /app python:3.14-slim \
  sh -c 'python -m venv /tmp/icon-tools && /tmp/icon-tools/bin/pip install "fonttools[woff]==4.60.1" && /tmp/icon-tools/bin/python src/build-icons.py'
docker build -t personal-website .
```

The script downloads the pinned official fonts, keeps the selected glyphs and
renames the modified font families to respect the upstream reserved font name.
