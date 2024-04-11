/**
 * @author WMXPY
 * @namespace Features
 * @description Create Page
 */

import { IImbricateOrigin, IImbricateOriginCollection, ImbricatePageSearchResult, SandboxFeature, SandboxFeatureBuilder } from "@imbricate/core";

type SearchPageInput = {

    readonly collection: string;
    readonly keyword: string;

    readonly exact?: boolean;
};

type SearchPageOutput = {

    readonly results: ImbricatePageSearchResult[];
};

const createImplementation = (
    origin: IImbricateOrigin,
) => {

    return async (
        input: SearchPageInput,
    ): Promise<SearchPageOutput> => {

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
            });

        return {
            results: searchResults,
        };
    };
};

export const createSearchPageFeature = (
    origin: IImbricateOrigin,
): SandboxFeature => {

    return SandboxFeatureBuilder.providedByOrigin()
        .withPackageName("page")
        .withMethodName("searchPage")
        .withImplementation(createImplementation(origin))
        .build();
};
