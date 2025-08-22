# tailwindcss-colors-palette

A color palette plugin for Tailwind CSS 4, providing easy-to-use color palettes for your projects.

## Installation
```bash
npm install tailwindcss-colors-palette
```

## Usage
import plugin at your entry css file(e.g `src/index.css`).   

on-demand import(Recommend)    
```bash
# index.css
@import "tailwindcss";
# import universal color palette
@import "tailwindcss-colors-palette/colors/universal.css";
```
full import     
```bash
# index.css
@import "tailwindcss";
@import "tailwindcss-colors-palette";
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

## Support Colors
| Name           | Link                                                                   | Status      |
| -------------- | ---------------------------------------------------------------------- | ----------- |
| universal      | [colar](https://github.com/fchristant/colar)                           | ✅ Completed |
| ant design(v5) | [ant design](https://ant-design.antgroup.com/docs/spec/colors)         | ✅ Completed |
| Chakra         | [chakra](https://chakra-ui.com/docs/theming/colors)                    | ✅ Completed |
| Material UI    | [material ui](https://www.figma.com/community/file/912837788133317724) | ✅ Completed |
| Radix Colors   | [radix colors](https://www.radix-ui.com/colors)                        | ✅ Completed |