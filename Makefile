# Default deploy target for this static site (NAS over SSH).
-include .deploy-env

.PHONY: dev build deploy smoke verify-production test-deploy

dev:
	npm run dev

build:
	npm run build

deploy:
	npm run deploy

smoke:
	npm run smoke:deeplinks

verify-production:
	npm run verify:production

test-deploy:
	npm run test:deploy
