Copyright 2026 Kirk Rader

# automation-frontend

[Vue]-based user interface for a home-grown home automation system

## Dependencies / Attributions

- [@mdi/js]
- [Noto Sans]
- [Mermaid]
- [Vue]

## Installation

```bash
npm i
```

## Configuration

```
VITE_SERVER_WS=ws://myserver.local:8081
VITE_LATITUDE=34.052238
VITE_LONGITUDE=-118.243340
VITE_ELEVATION=0
```

## Build

```bash
npm run clean; npm run build
# output in ./dist/
```

## Test

```bash
npm run clean; npm run dev
```

[@mdi/js]: https://www.npmjs.com/package/@mdi/js
[Noto Sans]: https://fonts.google.com/noto/specimen/Noto+Sans
[Mermaid]: https://www.npmjs.com/package/mermaid
[Vue]: https://www.npmjs.com/package/vue