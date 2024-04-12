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
    collectionName: string,
    ...paths: string[]
): string => {

    const fixedCollectionName: string = collectionName
        .replace(/\//g, "-")
        .replace(/\\/g, "-")
        .replace(/:/g, "-")
        .replace(/ /g, "-");

    return Path.join(basePath, "collections", fixedCollectionName, ...paths);
};

export const joinCollectionFolderListFilePath = (
    basePath: string,
    collectionName: string,
): string => {

    return Path.join(basePath, "collections", collectionName, "list.meta.json");
};
