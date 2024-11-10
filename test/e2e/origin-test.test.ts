/**
 * @author WMXPY
 * @namespace OriginTest
 * @description Origin Test
 * @override E2E
 */

import { ImbricateOriginTestingTarget, startImbricateOriginTest } from "@imbricate/test-origin-jest";
import { RMRFFolder } from "@sudoo/io";
import * as Path from "path";
import { ImbricateFileSystemOrigin } from "../../src";

const testingTarget = ImbricateOriginTestingTarget.fromConstructor(
    async () => {

        const origin: ImbricateFileSystemOrigin = ImbricateFileSystemOrigin.create({
            basePath: Path.resolve("origin-test"),
            asynchronousPoolLimit: 10,
        });
        return origin;
    },
    async () => {

        await RMRFFolder(Path.resolve("origin-test"));
    },
);

startImbricateOriginTest(testingTarget);
