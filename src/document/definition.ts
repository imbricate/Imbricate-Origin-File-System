/**
 * @author WMXPY
 * @namespace Document
 * @description Definition
 */

import { DocumentProperties } from "@imbricate/core";

export type ImbricateFileSystemDocument = {

    readonly uniqueIdentifier: string;
    readonly properties: DocumentProperties;
};
