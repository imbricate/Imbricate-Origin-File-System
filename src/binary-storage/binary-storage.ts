/**
 * @author WMXPY
 * @namespace BinaryStorage
 * @description Binary Storage
 */

import { IImbricateBinaryStorage } from "@imbricate/core";
import { putBinaryStorageFile } from "./put-file";

export class FileSystemBinaryStorage implements IImbricateBinaryStorage {

    public static create(
        basePath: string,
    ): FileSystemBinaryStorage {
        return new FileSystemBinaryStorage(basePath);
    }

    private readonly _basePath: string;

    private constructor(
        basePath: string,
    ) {

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
}
