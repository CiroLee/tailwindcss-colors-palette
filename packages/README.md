# tailwindcss-colors-palette

It is a color palette plugin for tailwindcss 4, let you easy to use all kinds of color palette.

## Installation
```bash
npm install tailwindcss-colors-palette
```

## Usage
import plugin at your entry css file(e.g `src/index.css`).   

on-demand import(Recommend)    
```diff
// index.css
@import "tailwindcss";
# import universal color palette
+ @import "tailwindcss-colors-palette/colors/universal.css";
```
full import     
```diff
// index.css
@import "tailwindcss";
+ @import "tailwindcss-colors-palette";
```

## Development     
at root directory:
```bash
# start dev server
npm run dev:lib
# start app to preview
npm run dev:app
```

## Build
```bash
# build lib
npm run build:lib
# build app
npm run build:app
```