/**
 * @author WMXPY
 * @namespace Page
 * @description List Directories
 */

import { directoryFiles } from "@sudoo/io";
import { ensureCollectionFolder } from "../collection/ensure-collection-folder";
import { decodeFileSystemComponent } from "../util/encode";
import { joinCollectionFolderPath } from "../util/path-joiner";
import { pageMetadataFolderName } from "./definition";

export const fileSystemListDirectories = async (
    basePath: string,
    collectionName: string,
    collectionUniqueIdentifier: string,
    directories: string[],
): Promise<string[]> => {

    await ensureCollectionFolder(basePath, collectionUniqueIdentifier);

    const collectionFolderPath = joinCollectionFolderPath(
        basePath,
        collectionUniqueIdentifier,
        pageMetadataFolderName,
    );

    const files: string[] = await directoryFiles(collectionFolderPath);

    const foundDirectories: string[] = files
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

            return decoded;
        })
        .map((decoded: string[]) => {

            const currentDirectories: string[] = [...decoded];
            currentDirectories.pop();

            for (let i = 0; i < directories.length; i++) {
                if (directories[i] !== currentDirectories[i]) {
                    return null;
                }
            }

            const nextDirectory: string | null = currentDirectories[directories.length];
            return nextDirectory;
        })
        .filter((element: string | null): element is string => {
            return typeof element === "string";
        });

    return Array.from(new Set(foundDirectories));
};
