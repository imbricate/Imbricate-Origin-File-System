/**
 * @author WMXPY
 * @namespace BinaryStorage
 * @description Ensure Binary Storage Folder
 */

import { attemptMarkDir } from "@sudoo/io";
import { getBinaryStorageFolderPath } from "../util/path-joiner";

export const ensureBinaryStorageFolder = async (
    basePath: string,
    digest: string,
): Promise<string> => {

    const firstThreeDigest: string = digest.slice(0, 3);
    const secondThreeDigest: string = digest.slice(3, 6);

    await attemptMarkDir(basePath);

    const binaryStorageRootFolder: string = getBinaryStorageFolderPath(
        basePath,
    );
    await attemptMarkDir(binaryStorageRootFolder);

    const firstThreeFolder: string = getBinaryStorageFolderPath(
        basePath,
        firstThreeDigest,
    );
    await attemptMarkDir(firstThreeFolder);

    const secondThreeFolder: string = getBinaryStorageFolderPath(
        basePath,
        firstThreeDigest,
        secondThreeDigest,
    );
    await attemptMarkDir(secondThreeFolder);

    const targetFolder: string = getBinaryStorageFolderPath(
        basePath,
        firstThreeDigest,
        secondThreeDigest,
        digest,
    );
    await attemptMarkDir(targetFolder);

    return targetFolder;
};
