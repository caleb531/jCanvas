import commonjs from "@rollup/plugin-commonjs";
import { globSync } from "glob";
import path from "node:path";
import copy from "rollup-plugin-copy";
import esbuild from "rollup-plugin-esbuild";

const inputPaths = globSync(["src/jcanvas.ts", "src/jcanvas-*.ts", ""], {
  ignore: "src/*.d.ts",
});

export default inputPaths.map((inputPath) => {
  const inputFilenameWithoutExtension = path.basename(inputPath, ".ts");
  return {
    input: [inputPath],
    external: ["jquery"],
    output: [
      {
        file: `dist/umd/${inputFilenameWithoutExtension}.min.js`,
        format: "umd",
        name: `jCanvas_${inputFilenameWithoutExtension}`,
        sourcemap: true,
        globals: {
          jquery: "$",
        },
      },
      {
        file: `dist/esm/${inputFilenameWithoutExtension}.min.js`,
        format: "esm",
        sourcemap: true,
        globals: {
          jquery: "$",
        },
      },
    ],
    plugins: [
      commonjs(),
      esbuild({ minify: true, target: "es2020" }),
      copy({
        targets: [
          {
            src: `src/${inputFilenameWithoutExtension}.d.ts`,
            dest: "dist/umd",
            rename: `${inputFilenameWithoutExtension}.min.d.ts`,
          },
          {
            src: `src/${inputFilenameWithoutExtension}.d.ts`,
            dest: "dist/esm",
            rename: `${inputFilenameWithoutExtension}.min.d.ts`,
          },
        ],
      }),
    ],
  };
});
