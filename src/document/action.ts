/**
 * @author WMXPY
 * @namespace Document
 * @description Action
 */

import { ImbricateDocumentQuery } from "@imbricate/core";
import { listFileFromDirectory, putFile, readFile } from "../util/io";
import { joinDocumentFileRoute } from "../util/path-joiner";
import { ImbricateFileSystemDocumentInstance } from "./definition";

export const putDocument = async (
    basePath: string,
    databaseUniqueIdentifier: string,
    document: ImbricateFileSystemDocumentInstance,
): Promise<void> => {

    const pathRoute: string[] = joinDocumentFileRoute(
        databaseUniqueIdentifier,
        document.uniqueIdentifier,
    );

    await putFile(basePath, pathRoute, JSON.stringify(document, null, 2));
};

export const getDocumentList = async (
    basePath: string,
    databaseUniqueIdentifier: string,
    query: ImbricateDocumentQuery,
): Promise<ImbricateFileSystemDocumentInstance[]> => {

    const pathRoute: string[] = joinDocumentFileRoute(
        databaseUniqueIdentifier,
    );

    const files: string[] = await listFileFromDirectory(basePath, pathRoute);

    const result: ImbricateFileSystemDocumentInstance[] = [];
    const startPoint: number = query.skip || 0;
    const endPoint: number = query.limit ? startPoint + query.limit : files.length;

    for (let i: number = startPoint; i < endPoint; i++) {

        const file: string = files[i];

        const fileRoute: string[] = joinDocumentFileRoute(
            databaseUniqueIdentifier,
            file,
        );

        const content: string = await readFile(basePath, fileRoute);
        const parsed: ImbricateFileSystemDocumentInstance = JSON.parse(content);

        result.push(parsed);
    }

    return result;
};
