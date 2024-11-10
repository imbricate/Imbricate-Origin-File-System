/**
 * @author WMXPY
 * @namespace Database
 * @description Action
 */

import { readTextFile } from "@sudoo/io";
import { listFileFromDirectory, putFile } from "../util/io";
import { joinDatabaseMetaFilePath } from "../util/path-joiner";
import { ImbricateFileSystemDatabaseMeta } from "./definition";

export const putDatabaseMeta = async (
    basePath: string,
    metadata: ImbricateFileSystemDatabaseMeta,
): Promise<void> => {

    const filePath: string = joinDatabaseMetaFilePath(
        basePath,
        metadata.uniqueIdentifier,
    );

    await putFile(filePath, JSON.stringify(metadata));
};

export const getDatabaseMetaList = async (
    basePath: string,
): Promise<ImbricateFileSystemDatabaseMeta[]> => {

    const directoryPath: string = joinDatabaseMetaFilePath(
        basePath,
    );

    const files: string[] = await listFileFromDirectory(directoryPath);

    const result: ImbricateFileSystemDatabaseMeta[] = [];
    for (const file of files) {

        const content: string = await readTextFile(file);
        const parsed: ImbricateFileSystemDatabaseMeta = JSON.parse(content);

        result.push(parsed);
    }

    return result;
};
