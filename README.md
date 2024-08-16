# neoxml

> `neoxml` aims to provide a straightforward interface with OpenXML files (`.pptx`, `.docx`, `.xlsx`) for parsing, programmatic construction, preview rendering and file generation. Intended for use with Bun.js.

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

Starting to see a pattern? As my primary usecase is PresentationML, I would greatly appreciate contributions for WordprocessingML and SpreadsheetML. If you'd like to help, please, hop into the Discord server:

[![Join our Discord server!](https://invidget.switchblade.xyz/tg9ph67zTh)](http://discord.gg/tg9ph67zTh)


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
