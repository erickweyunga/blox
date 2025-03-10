import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';
import pkg from './package.json';

// Bundle dependencies
const external = [
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {}),
  '@bloxi/core'
];

export default [
  // Main bundle
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
      {
        file: 'dist/index.min.js',
        format: 'umd',
        name: 'BloxiComponents',
        globals: {
          '@bloxi/core': 'Bloxi'
        },
        plugins: [terser()],
        sourcemap: true,
      },
    ],
    external,
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: false,
        sourceMap: true
      }),
      resolve(),
      commonjs(),
    ],
  },
  
  // Type definitions
  {
    input: 'src/index.ts',
    output: {
      file: pkg.types,
      format: 'es',
    },
    external,
    plugins: [
      typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationMap: true,
        emitDeclarationOnly: true,
      }),
      dts(),
    ],
  },
];