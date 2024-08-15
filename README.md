# bun-oxml

`bun-oxml` aims to provide a straightforward interface with OpenXML files (`.pptx`, `.docx`, `.xlsx`) for both file creation and parsing. Intended for use with Bun.js.

Though this project was originally intended as a Bun fork of `oxml.js`, I realised that a complete rewrite was necessary and decided to start fresh with a completely different API based on projects like  @gitbrent's [`PPTXGenJS`](https://github.com/gitbrent/PptxGenJS) and Eric White's `OpenXML-SDK-JS` (via the latest MIT-licensed spiritual successor I could find, the badly-named [`openxml`](https://github.com/rangatia/openxml/tree/master)), all no longer actively maintained, but all containing valuable expertise for tooling that must continue to exist.

Usecases I intend to support are:

- Programmatically generating ...
  - PPTX files
  - DOCX and XLSX by demand
- Parsing ...
  - PPTX files
  -  DOCX and XLSX by demand
- Rendering ...
  - PPTX files
  - DOCX and XLSX by demand

Starting to see a pattern? I would greatly appreciate contributions, if you'd like to help, please, hop into the Discord server:
<iframe src="https://discord.com/widget?id=1232493784818778263&theme=dark" width="350" height="500" allowtransparency="true" frameborder="0" sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"></iframe>


## Installing

...

## Contributing

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.21. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
