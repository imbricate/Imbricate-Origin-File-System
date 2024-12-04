/**
 * @author WMXPY
 * @namespace Database
 * @description Query
 */

import { IImbricateDocument, IMBRICATE_QUERY_COMPARE_CONDITION, IMBRICATE_QUERY_PROPERTY_CONDITION_TARGET, ImbricateDatabaseSchema, ImbricateDocumentQuery } from "@imbricate/core";
import { getDocumentList } from "../document/action";
import { ImbricateFileSystemDocumentInstance } from "../document/definition";
import { ImbricateFileSystemDocument } from "../document/document";

export const queryDocuments = async (
    basePath: string,
    databaseUniqueIdentifier: string,
    schema: ImbricateDatabaseSchema,
    query: ImbricateDocumentQuery,
): Promise<IImbricateDocument[]> => {

    const documents: ImbricateFileSystemDocumentInstance[] = await getDocumentList(
        basePath,
        databaseUniqueIdentifier,
    );

    const results: IImbricateDocument[] = [];

    let restSkips: number = query.skip ?? 0;
    documents: for (let i = 0; i < documents.length; i++) {

        if (typeof query.limit === "number" && results.length >= query.limit) {
            break documents;
        }

        const documentInstance: ImbricateFileSystemDocumentInstance = documents[i];
        const document = ImbricateFileSystemDocument.fromInstance(
            schema,
            basePath,
            databaseUniqueIdentifier,
            documentInstance,
        );

        if (Array.isArray(query.propertyFilters)) {

            for (const filter of query.propertyFilters) {

                const property = document.properties[filter.propertyIdentifier];
                if (!property) {
                    continue documents;
                }

                if (filter.target === IMBRICATE_QUERY_PROPERTY_CONDITION_TARGET.PROPERTY_TYPE) {

                    if (filter.condition === IMBRICATE_QUERY_COMPARE_CONDITION.EQUAL) {

                        if (!property) {
                            continue documents;
                        }

                        if (property.type !== filter.value) {
                            continue documents;
                        }
                    }
                }

                if (filter.target === IMBRICATE_QUERY_PROPERTY_CONDITION_TARGET.PROPERTY_VALUE) {

                    if (filter.condition === IMBRICATE_QUERY_COMPARE_CONDITION.EQUAL) {

                        if (!property) {
                            continue documents;
                        }

                        if (Array.isArray(property.value) && Array.isArray(filter.value)) {

                            if (property.value.length !== filter.value.length) {
                                continue documents;
                            }

                            for (const value of filter.value) {

                                if (!property.value.includes(value)) {
                                    continue documents;
                                }
                            }
                        } else if (property.value !== filter.value) {
                            continue documents;
                        }
                    }

                    if (filter.condition === IMBRICATE_QUERY_COMPARE_CONDITION.EXIST) {

                        if (filter.value && typeof property === "undefined") {
                            continue documents;
                        }

                        if (!filter.value && typeof property !== "undefined") {
                            continue documents;
                        }
                    }
                }
            }
        }

        if (restSkips > 0) {
            restSkips--;
            continue documents;
        }

        results.push(document);
    }

    return results;
};
