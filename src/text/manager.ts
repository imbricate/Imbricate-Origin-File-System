/**
 * @author WMXPY
 * @namespace Text
 * @description Manager
 */

import { IImbricateText, IImbricateTextManager } from "@imbricate/core";

export class ImbricateFileSystemTextManager implements IImbricateTextManager {

    public static create(
        basePath: string,
    ): ImbricateFileSystemTextManager {

        return new ImbricateFileSystemTextManager(
            basePath,
        );
    }

    private readonly _basePath: string;

    private constructor(
        basePath: string,
    ) {

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
