/**
 * @author WMXPY
 * @namespace Script
 * @description Definition
 */

import { ImbricateScriptAttributes, ImbricateScriptMetadata } from "@imbricate/core";

export type FileSystemScriptMetadata = {

    readonly attributes: ImbricateScriptAttributes;
} & ImbricateScriptMetadata;

export const pageMetadataFolderName: string = ".metadata";
