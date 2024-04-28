/**
 * @author WMXPY
 * @namespace Page
 * @description Common
 */

import { attemptMarkDir, readTextFile, writeTextFile } from "@sudoo/io";
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

export const getPageContent = async (
    basePath: string,
    collectionName: string,
    identifier: string,
): Promise<string> => {

    const targetFilePath = joinCollectionFolderPath(
        basePath,
        collectionName,
        fixFileNameFromIdentifier(identifier),
    );

    return await readTextFile(targetFilePath);
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
    directories: string[],
    fileName: string,
    _content: string,
): Promise<void> => {

    for (let i = 0; i < directories.length; i++) {

        const targetFolderPath = joinCollectionFolderPath(
            basePath,
            collectionName,
            pageMetadataFolderName,
            ...directories.slice(0, i + 1),
        );

        await attemptMarkDir(targetFolderPath);
    }

    const targetFilePath = joinCollectionFolderPath(
        basePath,
        collectionName,
        pageMetadataFolderName,
        ...directories,
        fileName,
    );

    console.log(targetFilePath);

    // await writeTextFile(targetFilePath, content);
};

export const fixFileNameFromIdentifier = (identifier: string): string => {

    const markDownExtension: string = ".md";

    return `${identifier}${markDownExtension}`;
};
