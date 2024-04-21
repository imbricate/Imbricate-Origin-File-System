/**
 * @author WMXPY
 * @namespace Features
 * @description Search Page
 */

import { IImbricateOrigin, IImbricateOriginCollection, ImbricatePageSearchResult, SandboxFeature, SandboxFeatureBuilder } from "@imbricate/core";

type SearchPagesInput = {

    readonly collection: string;
    readonly keyword: string;

    readonly exact?: boolean;
    readonly limit?: number;
};

type SearchPagesOutput = {

    readonly results: ImbricatePageSearchResult[];
};

const createImplementation = (
    origin: IImbricateOrigin,
) => {

    return async (
        input: SearchPagesInput,
    ): Promise<SearchPagesOutput> => {

        if (typeof input.collection !== "string") {
            throw new Error("Collection is required");
        }

        if (typeof input.keyword !== "string") {
            throw new Error("Keyword is required");
        }

        const collection: IImbricateOriginCollection | null =
            await origin.getCollection(input.collection);

        if (!collection) {
            throw new Error(`Collection [${input.collection}] not found`);
        }

        const searchResults: ImbricatePageSearchResult[] =
            await collection.searchPages(input.keyword, {
                exact: Boolean(input.exact),
                limit: input.limit,
            });

        return {
            results: searchResults,
        };
    };
};

export const createSearchPagesFeature = (
    origin: IImbricateOrigin,
): SandboxFeature => {

    return SandboxFeatureBuilder.providedByOrigin()
        .withPackageName("page")
        .withMethodName("searchPages")
        .withImplementation(createImplementation(origin))
        .build();
};
