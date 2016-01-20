.SILENT:

bin = ./node_modules/.bin

build: clean test readme

clean:
	rm -rf dst .nyc_output;

babel:
	$(bin)/babel --out-dir dst src;

lint:
	$(bin)/eslint src/lib/index.js;

test: lint babel
	$(bin)/tap --cov -R spec dst/tst/index.js;

readme:
	mv .babelrc babelrc;
	$(bin)/documentation readme ./src/lib/index.js --readme-file Readme.md -s "...";
	mv babelrc .babelrc;

publish: build
	npm publish;

.PHONY: build clean babel lint test readme publish
