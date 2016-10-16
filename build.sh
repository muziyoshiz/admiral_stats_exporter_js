#!/bin/bash

cat admiral_stats_exporter.js | ruby js-compile.rb -l2 > exporter.js
cat admiral_stats_exporter.js | sed -e 's/var dataTypes/\/\/ var dataTypes/g' | sed -e 's/\/\/ \/\/ var dataTypes/var dataTypes/g' | ruby js-compile.rb -l2 > exporter_all.js

