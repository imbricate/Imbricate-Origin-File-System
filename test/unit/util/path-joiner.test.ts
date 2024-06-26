/**
 * @author WMXPY
 * @namespace Util
 * @description Path Joiner
 * @override Unit Test
 */

import * as Path from "path";
import { joinCollectionMetaFilePath } from "../../../src/util/path-joiner";

describe("Given [Path Joiner] Helper Methods", (): void => {

    test("should be able to join collection meta file path", (): void => {

        const basePath: string = "/base/path";
        const joined: string = joinCollectionMetaFilePath(basePath);

        expect(joined).toEqual(Path.resolve("/base/path/collection.meta.json"));
    });
});
