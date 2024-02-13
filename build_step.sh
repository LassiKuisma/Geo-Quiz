#!/bin/bash

cd frontend
npm install

cd ../backend
npm install
npm run build:common
npm run build:front
npm run tsc
