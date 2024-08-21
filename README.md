# neoxml

> `neoxml` is a reactive interface that allows you to parse, modify, generate and render Office Open XML files (`.pptx`, `.docx`, `.xlsx`)

Though this project was originally intended as a Bun fork of [`oxml.js`](https://github.com/jiteshkumawat/oxml.js), I realised that the library was primarily focused on `.xlsx` and because it didn't support ESM, that a complete rewrite was necessary. I decided to start fresh with a completely different API based on projects like  @gitbrent's [`PPTXGenJS`](https://github.com/gitbrent/PptxGenJS) and Eric White's `OpenXML-SDK-JS` (via the latest MIT-licensed spiritual successor I could find, the badly-named [`openxml`](https://github.com/rangatia/openxml/tree/master)), all no longer actively maintained, but all containing valuable expertise for tooling that must continue to be maintained.

Usecases I intend to support with `neoxml` are:

- PPTX File Parsing
- PPTX File Generation/Modification
- PPTX File DOM Rendering

Starting to see a pattern? As my primary usecase is PresentationML, I would greatly appreciate contributions for WordprocessingML and SpreadsheetML. If you'd like to help, please, hop into the Discord server:

[![Join our Discord server!](https://invidget.switchblade.xyz/tg9ph67zTh)](http://discord.gg/tg9ph67zTh)


## Installing

... the library is in v0 and is not ready for production usage. Do not use.

## Contributing

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run ./cli/index.ts -f <your-file-here>
```

This project was created using `bun init` in bun v1.1.21. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
