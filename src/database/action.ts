/**
 * @author WMXPY
 * @namespace Database
 * @description Action
 */

import { readTextFile } from "@sudoo/io";
import { listFileFromDirectory, putFile } from "../util/io";
import { joinDatabaseMetaFileRoute } from "../util/path-joiner";
import { ImbricateFileSystemDatabaseMeta } from "./definition";

export const putDatabaseMeta = async (
    basePath: string,
    metadata: ImbricateFileSystemDatabaseMeta,
): Promise<void> => {

    const pathRoute: string[] = joinDatabaseMetaFileRoute(
        metadata.uniqueIdentifier,
    );

    await putFile(basePath, pathRoute, JSON.stringify(metadata));
};

export const getDatabaseMetaList = async (
    basePath: string,
): Promise<ImbricateFileSystemDatabaseMeta[]> => {

    const pathRoute: string[] = joinDatabaseMetaFileRoute();

    const files: string[] = await listFileFromDirectory(basePath, pathRoute);

    const result: ImbricateFileSystemDatabaseMeta[] = [];
    for (const file of files) {

        const content: string = await readTextFile(file);
        const parsed: ImbricateFileSystemDatabaseMeta = JSON.parse(content);

        result.push(parsed);
    }

    return result;
};
