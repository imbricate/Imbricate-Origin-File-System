/**
 * @author WMXPY
 * @namespace Text
 * @description Manager
 */

import { IImbricateText, IImbricateTextManager } from "@imbricate/core";
import { digestString } from "../util/digest";
import { getTextByUniqueIdentifier } from "./action";
import { ImbricateFileSystemText } from "./text";

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
        uniqueIdentifier: string,
    ): Promise<IImbricateText | null> {

        const textContent: string | null = await getTextByUniqueIdentifier(
            this._basePath,
            uniqueIdentifier,
        );

        if (!textContent) {
            return null;
        }

        const text: IImbricateText = ImbricateFileSystemText.createFromContent(
            uniqueIdentifier,
            textContent,
        );

        return text;
    }

    public async createText(
        content: string,
        uniqueIdentifier?: string,
    ): Promise<IImbricateText> {

        const textUniqueIdentifier: string =
            uniqueIdentifier ?? digestString(content);

        const text: IImbricateText = await ImbricateFileSystemText.createAndSave(
            this._basePath,
            textUniqueIdentifier,
            content,
        );

        return text;
    }
}
