/**
 * @author WMXPY
 * @namespace Page
 * @description Query Pages
 */

import { IImbricatePage, ImbricatePageQuery, ImbricatePageSnapshot } from "@imbricate/core";
import { FileSystemPageMetadata } from "./definition";
import { fileSystemListAllPages } from "./list-pages";
import { FileSystemImbricatePage } from "./page";
import { fileSystemReadPageMetadata } from "./read-metadata";

export const fileSystemQueryPages = async (
    basePath: string,
    collectionUniqueIdentifier: string,
    _query: ImbricatePageQuery,
): Promise<IImbricatePage[]> => {

    const pages: ImbricatePageSnapshot[] = await fileSystemListAllPages(
        basePath,
        collectionUniqueIdentifier,
    );

    const results: IImbricatePage[] = [];

    for (const page of pages) {


        const metadata: FileSystemPageMetadata | null = await fileSystemReadPageMetadata(
            basePath,
            collectionUniqueIdentifier,
            page.identifier,
        );

        if (!metadata) {
            continue;
        }

        results.push(FileSystemImbricatePage.create(
            basePath,
            collectionUniqueIdentifier,
            metadata,
        ));
    }

    return results;
};
