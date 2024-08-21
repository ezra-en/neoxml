import { parseXml, XmlDocument } from "@rgrove/parse-xml";
import { BlobReader, TextWriter, ZipReader, type Entry } from "@zip.js/zip.js";
import { parseArgs } from "node:util";
import { OpenXML } from "../openxml/index.js";

const { values, positionals } = parseArgs({
  args: Bun.argv,
  options: {
    filePath: {
      type: "string",
      short: "f",
    },
  },
  strict: true,
  allowPositionals: true,
});

if (values.filePath === undefined) {
  console.log(`neoxml-cli: OpenXML parser+mangler+renderer library
    USAGE: neoxml -f <your-file[.pptx|.xlsx|.docx]>`);
} else {
  const fileBlob = Bun.file(values.filePath);
  const pkgReader = new ZipReader(new BlobReader(fileBlob));

  const contentTypes = new OpenXML.ContentTypes(pkgReader);

  const types = await contentTypes.get()
  // console.table(types?.map((e) => e.attributes.ContentType ))
  contentTypes.set([...types, {type:"Element", name: "Override", attributes: {ContentType:"string"}, children: []}])
  // console.table(await contentTypes.get())
  console.table((await contentTypes._document.get()).toJSON().children[0].children)
}
