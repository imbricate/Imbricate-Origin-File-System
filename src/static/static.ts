/**
 * @author WMXPY
 * @namespace Static
 * @description Static
 */

import { IImbricateStatic, ImbricateStaticContentOnlyBase, ImbricateStaticGetContentOutcome } from "@imbricate/core";
import { putStatic } from "./action";

export class ImbricateFileSystemStatic extends ImbricateStaticContentOnlyBase implements IImbricateStatic {

    public static async createAndSave(
        basePath: string,
        staticUniqueIdentifier: string,
        content: Buffer,
    ): Promise<ImbricateFileSystemStatic> {

        await putStatic(basePath, staticUniqueIdentifier, content);

        return new ImbricateFileSystemStatic(
            staticUniqueIdentifier,
            content,
        );
    }

    public static createFromContent(
        staticUniqueIdentifier: string,
        content: Buffer,
    ): ImbricateFileSystemStatic {

        return new ImbricateFileSystemStatic(staticUniqueIdentifier, content);
    }

    private readonly _staticUniqueIdentifier: string;

    private _content: Buffer;

    private constructor(
        staticUniqueIdentifier: string,
        content: Buffer,
    ) {

        super();

        this._staticUniqueIdentifier = staticUniqueIdentifier;

        this._content = content;
    }

    public get uniqueIdentifier(): string {
        return this._staticUniqueIdentifier;
    }

    public async getContentInBase64(): Promise<ImbricateStaticGetContentOutcome<string>> {

        return {
            content: this._content.toString("base64"),
        };
    }
}
