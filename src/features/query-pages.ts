/**
 * @author WMXPY
 * @namespace Features
 * @description Query Pages
 */

import { IImbricateOrigin, IImbricateCollection, IImbricatePage, ImbricatePageAttributes, SandboxFeature, SandboxFeatureBuilder } from "@imbricate/core";
import { FileSystemPageMetadata } from "../page/definition";

type QueryPagesInput = {

    readonly collection: string;

    readonly limit?: number;
};

type QueryPagesOutput = {

    readonly pages: FileSystemPageMetadata[];
};

const createImplementation = (
    origin: IImbricateOrigin,
) => {

    return async (
        input: QueryPagesInput,
    ): Promise<QueryPagesOutput> => {

        if (typeof input.collection !== "string") {
            throw new Error("Collection is required");
        }

        const collection: IImbricateCollection | null =
            await origin.getCollection(input.collection);

        if (!collection) {
            throw new Error(`Collection [${input.collection}] not found`);
        }

        const pages: IImbricatePage[] = await collection.queryPages({
        }, {
            limit: input.limit,
        });

        const results: FileSystemPageMetadata[] = [];

        for (const page of pages) {

            const attributes: ImbricatePageAttributes = await page.readAttributes();

            results.push({

                title: page.title,
                directories: page.directories,
                identifier: page.identifier,

                description: page.description,

                digest: page.digest,
                historyRecords: page.historyRecords,

                createdAt: page.createdAt,
                updatedAt: page.updatedAt,

                attributes,
            });
        }

        return {
            pages: results,
        };
    };
};

export const createQueryPagesFeature = (
    origin: IImbricateOrigin,
): SandboxFeature => {

    return SandboxFeatureBuilder.providedByOrigin()
        .withPackageName("page")
        .withMethodName("queryPages")
        .withImplementation(createImplementation(origin))
        .build();
};
