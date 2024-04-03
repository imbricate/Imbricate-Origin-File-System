/**
 * @author WMXPY
 * @namespace FileSystem_Page
 * @description Definition
 */

export type FileSystemPageMetadata = {

    readonly title: string;
    readonly identifier: string;
    readonly createdAt: Date;
    readonly updatedAt: Date;
};

export const pageMetadataFolderName: string = ".metadata";
