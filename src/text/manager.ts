/**
 * @author WMXPY
 * @namespace Text
 * @description Manager
 */

import { IImbricateText, IImbricateTextManager, ImbricateAuthor } from "@imbricate/core";

export class ImbricateFileSystemTextManager implements IImbricateTextManager {

    public static create(
        author: ImbricateAuthor,
        basePath: string,
    ): ImbricateFileSystemTextManager {

        return new ImbricateFileSystemTextManager(
            author,
            basePath,
        );
    }

    private readonly _author: ImbricateAuthor;
    private readonly _basePath: string;

    private constructor(
        author: ImbricateAuthor,
        basePath: string,
    ) {

        this._author = author;
        this._basePath = basePath;
    }

    public async getText(
        _uniqueIdentifier: string,
    ): Promise<IImbricateText> {

        throw new Error("Method not implemented.");
    }

    public async createText(
        _content: string,
        _uniqueIdentifier?: string,
    ): Promise<IImbricateText> {

        throw new Error("Method not implemented.");
    }
}
