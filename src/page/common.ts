/**
 * @author WMXPY
 * @namespace Page
 * @description Common
 */

export const fixPageMetadataFileName = (fileName: string, identifier: string): string => {

    let fixedFileName: string = fileName.trim();

    const metaJSONExtension: string = ".meta.json";

    if (!fixedFileName.endsWith(metaJSONExtension)) {
        fixedFileName = `${fixedFileName}.${identifier}${metaJSONExtension}`;
    }

    return fixedFileName;
};
