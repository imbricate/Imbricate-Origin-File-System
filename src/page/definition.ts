/**
 * @author WMXPY
 * @namespace FileSystem_Page
 * @description Definition
 */

import { ImbricatePageAttributes, ImbricatePageMetadata } from "@imbricate/core";

export type FileSystemPageMetadata = {

    readonly attributes: ImbricatePageAttributes;
} & ImbricatePageMetadata;

export const pageMetadataFolderName: string = ".metadata";
