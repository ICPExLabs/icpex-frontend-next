#!/bin/bash

pnpm i

pnpm run test

pnpm run lint

pnpm run build

wrangler pages deploy ./dist
