/**
 * @author WMXPY
 * @namespace Page
 * @description List Pages
 */

import { ImbricatePageSnapshot } from "@imbricate/core";
import { directoryFiles } from "@sudoo/io";
import { ensureCollectionFolder } from "../collection/ensure-collection-folder";
import { decodeFileSystemComponent } from "../util/encode";
import { joinCollectionFolderPath } from "../util/path-joiner";
import { pageMetadataFolderName } from "./definition";

export const fileSystemListDirectoriesPages = async (
    basePath: string,
    collectionName: string,
    directories: string[],
): Promise<ImbricatePageSnapshot[]> => {

    const pages: ImbricatePageSnapshot[] = await fileSystemListAllPages(basePath, collectionName);

    return pages.filter((page: ImbricatePageSnapshot) => {

        if (page.directories.length !== directories.length) {
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
    collectionName: string,
): Promise<ImbricatePageSnapshot[]> => {

    await ensureCollectionFolder(basePath, collectionName);

    const collectionFolderPath = joinCollectionFolderPath(
        basePath,
        collectionName,
        pageMetadataFolderName,
    );

    const files: string[] = await directoryFiles(collectionFolderPath);

    return files
        .filter((file: string) => file.endsWith(".meta.json"))
        .filter((file: string) => !file.startsWith("."))
        .map((file: string) => {
            return file.slice(0, file.length - ".meta.json".length);
        })
        .map((file: string) => {

            const uuid: string = file.split(".").pop() as string;
            const encoded: string = file.slice(0, file.length - uuid.length - 1);

            const decoded: string[] =
                decodeFileSystemComponent(encoded)
                    .split("/");

            const title: string = decoded.pop() as string;

            return {
                identifier: uuid,
                directories: decoded,
                title,
            };
        });
};
