/**
 * @author WMXPY
 * @namespace BinaryStorage
 * @description Put File
 */

import { joinPath, pathExists, writeBufferFile } from "@sudoo/io";
import { digestBuffer } from "../util/digest";
import { buildUrlWithScheme } from "../util/path-joiner";
import { ensureBinaryStorageFolder } from "./ensure-binary-storage-folder";

export const putBinaryStorageFile = async (
    basePath: string,
    fileName: string,
    content: Buffer,
): Promise<string> => {

    const fileDigest: string = digestBuffer(content);

    const targetFolder = await ensureBinaryStorageFolder(
        basePath,
        fileDigest,
    );

    const targetFilePath = joinPath(targetFolder, fileName);
    const targetPathWithScheme: string = buildUrlWithScheme(targetFilePath);

    const pathExistsResult: boolean = await pathExists(targetFilePath);
    if (pathExistsResult) {
        return targetPathWithScheme;
    }

    await writeBufferFile(targetFilePath, content);
    return targetPathWithScheme;
};
