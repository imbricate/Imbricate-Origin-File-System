/**
 * @author WMXPY
 * @namespace Page
 * @description List Pages
 */

import { ImbricatePageSnapshot, ImbricatePageVariant, isValidImbricatePageVariantLanguage } from "@imbricate/core";
import { directoryFiles } from "@sudoo/io";
import { ensureCollectionFolder } from "../collection/ensure-collection-folder";
import { decodeFileSystemComponent, decodeFileSystemObject } from "../util/encode";
import { joinCollectionFolderPath } from "../util/path-joiner";
import { PAGE_META_FILE_EXTENSION } from "./common";
import { pageMetadataFolderName } from "./definition";

export const fileSystemListDirectoriesPages = async (
    basePath: string,
    collectionUniqueIdentifier: string,
    directories: string[],
    recursive: boolean,
): Promise<ImbricatePageSnapshot[]> => {

    const pages: ImbricatePageSnapshot[] = await fileSystemListAllPages(
        basePath,
        collectionUniqueIdentifier,
    );

    return pages.filter((page: ImbricatePageSnapshot) => {

        if (page.directories.length !== directories.length && !recursive) {
            return false;
        }

        for (let i: number = 0; i < directories.length; i++) {
            if (directories[i] !== page.directories[i]) {
                return false;
            }
        }

        return true;
    });
};

export const fileSystemListAllPages = async (
    basePath: string,
    collectionUniqueIdentifier: string,
): Promise<ImbricatePageSnapshot[]> => {

    await ensureCollectionFolder(basePath, collectionUniqueIdentifier);

    const collectionFolderPath = joinCollectionFolderPath(
        basePath,
        collectionUniqueIdentifier,
        pageMetadataFolderName,
    );

    const files: string[] = await directoryFiles(collectionFolderPath);

    return files
        .filter((file: string) => file.endsWith(PAGE_META_FILE_EXTENSION))
        .filter((file: string) => !file.startsWith("."))
        .map((file: string) => {
            return file.slice(0, file.length - PAGE_META_FILE_EXTENSION.length);
        })
        .map((file: string) => {

            const splited: [string, string, string] = file.split(".") as [string, string, string];

            if (splited.length !== 3) {
                throw new Error(`Invalid file name: ${file}`);
            }

            const encoded: string = splited[0];
            const uuid: string = splited[1];
            const encodedVariant: string = splited[2];

            const variant: ImbricatePageVariant = decodeFileSystemObject(encodedVariant) as ImbricatePageVariant;

            if (!isValidImbricatePageVariantLanguage(variant.language)) {
                throw new Error(`Invalid variant language: ${variant.language}`);
            }

            const decoded: string[] =
                decodeFileSystemComponent(encoded)
                    .split("/");

            const title: string = decoded.pop() as string;

            return {
                identifier: uuid,
                directories: decoded,
                title,
                variant,
            };
        });
};
