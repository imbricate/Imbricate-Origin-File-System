/**
 * @author WMXPY
 * @namespace Util
 * @description Path Joiner
 * @override Unit Test
 */

import * as Path from "path";
import { joinDatabaseMetaFilePath } from "../../../src/util/path-joiner";

describe("Given [Path Joiner] Helper Methods", (): void => {

    test("should be able to join collection meta file path", (): void => {

        const basePath: string = "/base/path";
        const joined: string = joinDatabaseMetaFilePath(basePath);

        expect(joined).toEqual(Path.resolve("/base/path/database"));
    });
});
