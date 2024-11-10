/**
 * @author WMXPY
 * @namespace FileSystem_Util
 * @description Path Joiner
 */

import * as Path from "path";

export const joinDatabaseMetaFilePath = (
    basePath: string,
    uniqueIdentifier: string,
): string => {

    const resolved: string = Path.resolve(basePath);
    return Path.join(resolved, "database", uniqueIdentifier);
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
