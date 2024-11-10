/**
 * @author WMXPY
 * @namespace FileSystem_Util
 * @description Path Joiner
 */

export const joinDatabaseMetaFileRoute = (
    uniqueIdentifier?: string,
): string[] => {

    if (typeof uniqueIdentifier === "undefined") {
        return ["database"];
    }

    if (uniqueIdentifier.endsWith(".json")) {
        return ["database", uniqueIdentifier];
    }

    return ["database", `${uniqueIdentifier}.json`];
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
