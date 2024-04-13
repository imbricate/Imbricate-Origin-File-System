/**
 * @author WMXPY
 * @namespace FileSystem_Page
 * @description Definition
 */

import { ImbricatePageAttributes } from "@imbricate/core";

export type FileSystemPageMetadata = {

    readonly title: string;
    readonly identifier: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;

    readonly attributes: ImbricatePageAttributes;
};

export const pageMetadataFolderName: string = ".metadata";
