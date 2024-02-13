#!/bin/bash

cd frontend
npm install

cd ../backend
npm install
npm run build:front
npm run import:common
npm run tsc
