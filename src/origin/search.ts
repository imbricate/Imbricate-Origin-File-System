/**
 * @author WMXPY
 * @namespace Origin
 * @description Search
 */

import { IImbricateDatabase, IImbricateDatabaseManager, IImbricateTextManager, IMBRICATE_PROPERTY_TYPE, IMBRICATE_SEARCH_TARGET_TYPE, ImbricateSearchItem, ImbricateSearchResult, findPrimaryProperty } from "@imbricate/core";

export const performSearch = async (
    keyword: string,
    originUniqueIdentifier: string,
    databaseManager: IImbricateDatabaseManager,
    textManager: IImbricateTextManager,
): Promise<ImbricateSearchResult> => {

    const keywordRegex: RegExp = new RegExp(keyword, "i");

    const databases: IImbricateDatabase[] = await databaseManager.listDatabases();
    const items: ImbricateSearchItem[] = [];

    for (const database of databases) {

        const documents = await database.queryDocuments({});
        for (const document of documents) {

            const propertyKeys: string[] = Object.keys(document.properties);
            properties: for (const propertyKey of propertyKeys) {

                const property = document.properties[propertyKey];

                if (property.type === IMBRICATE_PROPERTY_TYPE.MARKDOWN) {

                    if (typeof property.value === "string") {

                        const text = await textManager.getText(property.value);

                        if (!text) {
                            continue properties;
                        }

                        const textContent = await text.getContent();

                        if (!textContent) {
                            continue properties;
                        }

                        const lines = textContent.split("\n");

                        for (let i = 0; i < lines.length; i++) {

                            const line = lines[i];

                            if (keywordRegex.test(line)) {

                                const documentPrimaryKey = findPrimaryProperty(
                                    database.schema,
                                    document.properties,
                                );

                                items.push({
                                    target: {
                                        type: IMBRICATE_SEARCH_TARGET_TYPE.MARKDOWN,
                                        target: {
                                            originUniqueIdentifier,
                                            databaseUniqueIdentifier: database.uniqueIdentifier,
                                            documentUniqueIdentifier: document.uniqueIdentifier,
                                            propertyUniqueIdentifier: propertyKey,
                                            lineNumber: i + 1,
                                        },
                                    },
                                    primary: documentPrimaryKey ? String(documentPrimaryKey.value) : line,
                                    sourceDatabaseName: database.databaseName,
                                    sourceDocumentPrimaryKey: documentPrimaryKey ? String(documentPrimaryKey.value) : undefined,
                                    secondaryPrevious: lines[i - 1] ? [lines[i - 1]] : [],
                                    secondary: line,
                                    secondaryNext: lines[i + 1] ? [lines[i + 1]] : [],
                                });

                                continue properties;
                            }
                        }
                    }

                    continue properties;
                }

                if (property.type === IMBRICATE_PROPERTY_TYPE.STRING) {

                    if (typeof property.value === "string") {

                        if (keywordRegex.test(property.value)) {

                            items.push({
                                target: {
                                    type: IMBRICATE_SEARCH_TARGET_TYPE.DOCUMENT,
                                    target: {
                                        originUniqueIdentifier,
                                        databaseUniqueIdentifier: database.uniqueIdentifier,
                                        documentUniqueIdentifier: document.uniqueIdentifier,
                                    },
                                },
                                primary: property.value,
                                secondary: property.value,
                            });
                        }
                    }

                    continue properties;
                }
            }
        }
    }

    return {
        items,
    };
};
