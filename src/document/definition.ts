/**
 * @author WMXPY
 * @namespace Document
 * @description Definition
 */

import { DocumentEditRecord, DocumentProperties } from "@imbricate/core";

export type ImbricateFileSystemDocumentInstance = {

    readonly uniqueIdentifier: string;
    readonly properties: DocumentProperties;
    readonly editRecords: DocumentEditRecord[];
};

export const createImbricateFileSystemDocumentInstance = (
    uniqueIdentifier: string,
    properties: DocumentProperties,
): ImbricateFileSystemDocumentInstance => {

    return {

        uniqueIdentifier,
        properties,
        editRecords: [],
    };
};
