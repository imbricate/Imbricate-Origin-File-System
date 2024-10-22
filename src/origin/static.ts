/**
 * @author WMXPY
 * @namespace Origin
 * @description Static
 */

import { IImbricateOriginStaticManager } from "@imbricate/core/origin/static-manager";

export class ImbricateFileSystemStaticManager implements IImbricateOriginStaticManager {

    public static create(): ImbricateFileSystemStaticManager {
        return new ImbricateFileSystemStaticManager();
    }

    getStaticFileAsBase64(_uniqueIdentifier: string): PromiseLike<string> {
        throw new Error("Method not implemented.");
    }

    putStaticFileAsBase64(
        _content: string,
        _uniqueIdentifier?: string,
    ): PromiseLike<string> {
        throw new Error("Method not implemented.");
    }
}
