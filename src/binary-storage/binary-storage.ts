/**
 * @author WMXPY
 * @namespace BinaryStorage
 * @description Binary Storage
 */

import { IImbricateBinaryStorage, ImbricateBinaryStorageBase, ImbricateBinaryStorageCapability } from "@imbricate/core";
import { putBinaryStorageFile } from "./put-file";

export class FileSystemBinaryStorage extends ImbricateBinaryStorageBase implements IImbricateBinaryStorage {

    public static create(
        basePath: string,
    ): FileSystemBinaryStorage {
        return new FileSystemBinaryStorage(basePath);
    }

    private readonly _basePath: string;

    public readonly capabilities: ImbricateBinaryStorageCapability =
        ImbricateBinaryStorageBase.allAllowCapability();

    private constructor(
        basePath: string,
    ) {

        super();

        this._basePath = basePath;
    }

    public async putBinaryBase64(
        binary: string,
        fileName: string,
    ): Promise<string> {

        const buffer: Buffer = Buffer.from(binary, "base64");
        const filePath: string = await putBinaryStorageFile(
            this._basePath,
            fileName,
            buffer,
        );

        return filePath;
    }

    public async validateBinaryBase64(binary: string): Promise<boolean> {

        try {
            Buffer.from(binary, "base64");
            return true;
        } catch (_error) {
            return false;
        }
    }
}
