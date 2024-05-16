/**
 * @author WMXPY
 * @namespace OriginTest
 * @description Origin Test
 * @override E2E
 */

import { ImbricateOriginTestingTarget, startImbricateOriginTest } from "@imbricate/test-origin-jest";
import * as Path from "path";
import { FileSystemImbricateOrigin } from "../../src";

const testingTarget = ImbricateOriginTestingTarget.fromConstructor(
    async () => {

        const origin: FileSystemImbricateOrigin = FileSystemImbricateOrigin.withPayloads({
            basePath: Path.resolve("origin-test"),
            asynchronousPoolLimit: 10,
        });
        return origin;
    },
);

startImbricateOriginTest(testingTarget);
