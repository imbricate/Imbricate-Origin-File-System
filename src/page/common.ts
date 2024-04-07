/**
 * @author WMXPY
 * @namespace Page
 * @description Common
 */

import { writeTextFile } from "@sudoo/io";
import { joinCollectionFolderPath } from "../util/path-joiner";
import { pageMetadataFolderName } from "./definition";

export const fixPageMetadataFileName = (fileName: string, identifier: string): string => {

    let fixedFileName: string = fileName.trim();

    const metaJSONExtension: string = ".meta.json";

    if (!fixedFileName.endsWith(metaJSONExtension)) {
        fixedFileName = `${fixedFileName}.${identifier}${metaJSONExtension}`;
    }

    return fixedFileName;
};

export const putFileToCollectionFolder = async (
    basePath: string,
    collectionName: string,
    identifier: string,
    content: string,
): Promise<void> => {


    const targetFilePath = joinCollectionFolderPath(
        basePath,
        collectionName,
        identifier,
    );

    await writeTextFile(targetFilePath, content);
};

export const putFileToCollectionMetaFolder = async (
    basePath: string,
    collectionName: string,
    fileName: string,
    content: string,
): Promise<void> => {

    const targetFilePath = joinCollectionFolderPath(
        basePath,
        collectionName,
        pageMetadataFolderName,
        fileName,
    );

    await writeTextFile(targetFilePath, content);
};

export const fixFileNameFromIdentifier = (identifier: string): string => {

    const markDownExtension: string = ".md";

    return `${identifier}${markDownExtension}`;
};
