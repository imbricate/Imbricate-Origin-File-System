/**
 * @author WMXPY
 * @namespace Page
 * @description Common
 */

import { readTextFile, writeTextFile } from "@sudoo/io";
import { encodeFileSystemComponent } from "../util/encode";
import { joinCollectionFolderPath } from "../util/path-joiner";
import { pageMetadataFolderName } from "./definition";

export const fixPageMetadataFileName = (
    directories: string[],
    fileName: string,
    identifier: string,
): string => {

    let fixedFileName: string = fileName.trim();

    const metaJSONExtension: string = ".meta.json";

    const directoriesIncludedFileName: string = `${directories.join("/")}/${fixedFileName}`;
    const encodedFilename: string = encodeFileSystemComponent(directoriesIncludedFileName);

    if (!fixedFileName.endsWith(metaJSONExtension)) {
        fixedFileName = `${encodedFilename}.${identifier}${metaJSONExtension}`;
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
