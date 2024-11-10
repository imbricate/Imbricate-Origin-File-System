/**
 * @author WMXPY
 * @namespace Database
 * @description Action
 */

import { putFile } from "../util/io";
import { joinDatabaseMetaFilePath } from "../util/path-joiner";
import { ImbricateFileSystemDatabaseMeta } from "./definition";

export const putDatabaseMetaFile = async (
    basePath: string,
    metadata: ImbricateFileSystemDatabaseMeta,
): Promise<void> => {

    const filePath: string = joinDatabaseMetaFilePath(
        basePath,
        metadata.uniqueIdentifier,
    );

    await putFile(filePath, JSON.stringify(metadata));
};
