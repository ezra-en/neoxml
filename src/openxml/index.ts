import { parseXml, XmlDocument, type JsonValue } from "@rgrove/parse-xml";
import { BlobReader, TextWriter, ZipReader } from "@zip.js/zip.js";

export namespace OpenXML {
  export class Package {
    pkg: ZipReader<BlobReader>;
    ContentTypes: ContentTypes;

    constructor(zip?: Blob) {
      if (!zip) {
        this.ContentTypes = new ContentTypes();
      } else {
        this.pkg = new ZipReader(new BlobReader(zip));
        this.ContentTypes = new ContentTypes(this.pkg);
      }
    }
  }

  async function XMLFromPackage(
    pkg: ZipReader<BlobReader>,
    filename: string
  ): Promise<XmlDocument> {
    const entries = await pkg.getEntries();
    for (const entry of entries) {
      if (entry.filename === filename) {
        if (entry.getData) {
          const data = await entry.getData(new TextWriter());
          return parseXml(data);
        }
      }
    }
    throw new Error(`Root ${filename} not found.`);
  }

  // export class ContentTypes {
  //   private _pkg: ZipReader<BlobReader>;
  //   private _document: XmlDocument | undefined;
  //   private _contentTypes: JsonValue[];

  //   constructor(pkg: ZipReader<BlobReader>) {
  //     this._pkg = pkg;
  //     this.init(this._pkg);
  //   }

  //   private async init(pkg: ZipReader<BlobReader>) {
  //     this._document = await XMLfromPackage(pkg, "[Content_Types].xml");
  //     const docJSON = this._document.toJSON();
  //     this._contentTypes = docJSON.children[0].children;
  //   }

  //   async get(): Promise<JsonValue[]> {
  //     return new Promise((resolve) => {
  //       if (this._contentTypes !== undefined) {
  //         resolve(this._contentTypes);
  //       } else {
  //         this.init(this._pkg).then(() => {
  //           resolve(this._contentTypes);
  //         });
  //       }
  //     });
  //   }
  // }

  export type ContentTypeAttr = {
    Extension?: string;
    ContentType: string;
    PartName?: string;
  };
  export type ContentTypeElement = {
    type: string;
    name: string;
    attributes: ContentTypeAttr;
    children: JsonValue[];
  };

  export class ContentTypes {
    _document: AsyncResource<XmlDocument>
    _contentTypes: AsyncResource<ContentTypeElement[]>;

    constructor(pkg?: ZipReader<BlobReader>) {
      if (!pkg) {
        this._contentTypes = new AsyncResource<ContentTypeElement[]>(

        )
      } else {
        this._document = new AsyncResource<XmlDocument>(
          async () => {
            return await XMLFromPackage(pkg, "[Content_Types].xml")
          }
        )
        this._contentTypes = new AsyncResource<ContentTypeElement[]>(
          async () => {
            return (await this._document.get()).toJSON()
              .children[0].children;
          }
        );
      }
    }

    get() {
      return this._contentTypes.get();
    }

    set(res: ContentTypeElement[]) {
      return this._contentTypes.set(res);
    }
  }

  export class AsyncResource<T> {
    private _resource: T | undefined;

    constructor(private readonly initializer: () => Promise<T>) {}

    async get(): Promise<T> {
      if (this._resource !== undefined) {
        return this._resource;
      }
      this._resource = await this.initializer();
      return this._resource;
    }

    async set(res: T) {
      this._resource = res;
    }
  }



}
