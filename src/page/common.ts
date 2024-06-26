/**
 * @author WMXPY
 * @namespace Page
 * @description Common
 */

import { IMBRICATE_PAGE_VARIANT } from "@imbricate/core";
import { readTextFile, writeTextFile } from "@sudoo/io";
import { encodeFileSystemComponent } from "../util/encode";
import { joinCollectionFolderPath } from "../util/path-joiner";
import { pageMetadataFolderName } from "./definition";

export const PAGE_META_FILE_EXTENSION: string = ".meta.json";

export const fixPageMetadataFileName = (
    directories: string[],
    fileName: string,
    identifier: string,
    variant: IMBRICATE_PAGE_VARIANT,
): string => {

    let fixedFileName: string = fileName.trim();

    const metaJSONExtension: string = PAGE_META_FILE_EXTENSION;

    const directoriesIncludedFileName: string = [
        ...directories,
        fixedFileName,
    ].join("/");

    const encodedFilename: string = encodeFileSystemComponent(directoriesIncludedFileName);

    if (!fixedFileName.endsWith(metaJSONExtension)) {
        fixedFileName = `${encodedFilename}.${identifier}.${variant}${metaJSONExtension}`;
    }

    return fixedFileName;
};

export const getPageContent = async (
    basePath: string,
    collectionUniqueIdentifier: string,
    identifier: string,
    variant: IMBRICATE_PAGE_VARIANT,
): Promise<string> => {

    const targetFilePath = joinCollectionFolderPath(
        basePath,
        collectionUniqueIdentifier,
        fixFileNameFromIdentifier(identifier, variant),
    );

    return await readTextFile(targetFilePath);
};

export const putFileToCollectionFolder = async (
    basePath: string,
    collectionUniqueIdentifier: string,
    identifier: string,
    content: string,
): Promise<void> => {

    const targetFilePath = joinCollectionFolderPath(
        basePath,
        collectionUniqueIdentifier,
        identifier,
    );

    await writeTextFile(targetFilePath, content);
};

export const putFileToCollectionMetaFolder = async (
    basePath: string,
    collectionUniqueIdentifier: string,
    fileName: string,
    content: string,
): Promise<void> => {

    const targetFilePath = joinCollectionFolderPath(
        basePath,
        collectionUniqueIdentifier,
        pageMetadataFolderName,
        fileName,
    );

    await writeTextFile(targetFilePath, content);
};

export const fixFileNameFromIdentifier = (
    identifier: string,
    variant: IMBRICATE_PAGE_VARIANT,
): string => {

    return `${identifier}.${variant}`;
};
