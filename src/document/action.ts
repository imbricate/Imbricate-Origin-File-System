/**
 * @author WMXPY
 * @namespace Document
 * @description Action
 */

import { ImbricateFileSystemDatabaseMeta } from "../database/definition";
import { listFileFromDirectory, putFile, readFile } from "../util/io";
import { joinDatabaseMetaFileRoute, joinDocumentFileRoute } from "../util/path-joiner";
import { ImbricateFileSystemDocument } from "./document";

export const putDocument = async (
    basePath: string,
    databaseUniqueIdentifier: string,
    document: ImbricateFileSystemDocument,
): Promise<void> => {

    const pathRoute: string[] = joinDocumentFileRoute(
        databaseUniqueIdentifier,
        document.uniqueIdentifier,
    );

    await putFile(basePath, pathRoute, JSON.stringify(document, null, 2));
};

export const getDatabaseMetaList = async (
    basePath: string,
): Promise<ImbricateFileSystemDatabaseMeta[]> => {

    const pathRoute: string[] = joinDatabaseMetaFileRoute();

    const files: string[] = await listFileFromDirectory(basePath, pathRoute);

    const result: ImbricateFileSystemDatabaseMeta[] = [];
    for (const file of files) {

        const metaFileRoutes: string[] = joinDatabaseMetaFileRoute(file);

        const content: string = await readFile(basePath, metaFileRoutes);
        const parsed: ImbricateFileSystemDatabaseMeta = JSON.parse(content);

        result.push(parsed);
    }

    return result;
};
