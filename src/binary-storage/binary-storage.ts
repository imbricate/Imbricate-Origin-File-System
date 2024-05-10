/**
 * @author WMXPY
 * @namespace BinaryStorage
 * @description Binary Storage
 */

import { IImbricateBinaryStorage } from "@imbricate/core";

export class FileSystemBinaryStorage implements IImbricateBinaryStorage {

    public static create(): FileSystemBinaryStorage {
        return new FileSystemBinaryStorage();
    }

    private constructor() {

    }

    public async uploadBase64(binary: string): Promise<string> {

        console.log(binary);
        return "";
    }
}
