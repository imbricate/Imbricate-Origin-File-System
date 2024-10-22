/**
 * @author WMXPY
 * @namespace FileSystem_Util
 * @description Path Joiner
 */

import * as Path from "path";

export const joinCollectionMetaFilePath = (
    basePath: string,
): string => {

    const resolved: string = Path.resolve(basePath);
    return Path.join(resolved, "collection.meta.json");
};

export const getBinaryStorageFolderPath = (
    basePath: string,
    ...paths: string[]
): string => {

    const resolved: string = Path.resolve(basePath);
    return Path.join(resolved, "binary-storage", ...paths);
};

export const getCollectionFolderPath = (
    basePath: string,
): string => {

    const resolved: string = Path.resolve(basePath);
    return Path.join(resolved, "collections");
};

export const getScriptsFolderPath = (
    basePath: string,
    ...paths: string[]
): string => {

    const resolved: string = Path.resolve(basePath);
    return Path.join(resolved, "scripts", ...paths);
};

export const getScriptsMetadataFolderPath = (
    basePath: string,
    ...paths: string[]
): string => {

    const resolved: string = Path.resolve(basePath);
    return Path.join(resolved, "scripts", ".metadata", ...paths);
};

export const joinCollectionFolderPath = (
    basePath: string,
    uniqueIdentifier: string,
    ...paths: string[]
): string => {

    return Path.join(basePath, "collections", uniqueIdentifier, ...paths);
};

export const buildUrlWithScheme = (url: string): string => {

    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    if (url.startsWith("file://")) {
        return url;
    }

    return `file://${url}`;
};
