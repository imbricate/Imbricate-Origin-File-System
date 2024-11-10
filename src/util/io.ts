/**
 * @author WMXPY
 * @namespace FileSystem_Util
 * @description IO
 */

import { attemptMarkDir, directoryFiles, isFile, pathExists, readTextFile, writeTextFile } from "@sudoo/io";
import * as Path from "path";

export const createOrGetFile = async (
    path: string,
    defaultValue: string,
): Promise<string> => {

    const fileExist: boolean = await pathExists(path);

    if (fileExist) {

        const pathIsFile: boolean = await isFile(path);

        if (!pathIsFile) {
            throw new Error(`Path "${path}" is not a file`);
        }

        return await readTextFile(path);
    }

    const folderPath = Path.dirname(path);

    await attemptMarkDir(folderPath);
    await writeTextFile(path, defaultValue);

    return defaultValue;
};

export const listFileFromDirectory = async (
    basePath: string,
    pathRoute: string[],
): Promise<string[]> => {

    const directory: string = Path.join(basePath, ...pathRoute);
    const files: string[] = await directoryFiles(
        directory,
    );

    return files;
};

export const putFile = async (
    basePath: string,
    pathRoute: string[],
    content: string,
): Promise<void> => {

    await attemptMarkDir(basePath);
    for (let i = 0; i < pathRoute.length - 1; i++) {

        const currentPath: string = Path.join(basePath, ...pathRoute.slice(0, i + 1));

        await attemptMarkDir(currentPath);
    }

    await writeTextFile(
        Path.join(basePath, ...pathRoute),
        content,
    );
};

export const readFile = async (
    basePath: string,
    pathRoute: string[],
): Promise<string> => {

    const content: string = await readTextFile(
        Path.join(basePath, ...pathRoute),
    );
    return content;
};
