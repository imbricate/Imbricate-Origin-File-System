/**
 * @author WMXPY
 * @namespace Page
 * @description List Pages
 */

import { ImbricatePageSnapshot } from "@imbricate/core";
import { directoryFiles } from "@sudoo/io";
import { ensureCollectionFolder } from "../collection/ensure-collection-folder";
import { joinCollectionFolderPath } from "../util/path-joiner";
import { pageMetadataFolderName } from "./definition";

export const fileSystemListPages = async (
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
            const title: string = file.slice(0, file.length - uuid.length - 1);

            return {
                identifier: uuid,
                title,
            };
        });
};
