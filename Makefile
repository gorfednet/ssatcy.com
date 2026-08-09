# Default deploy target for this static site.
SMB_DEPLOY_TARGET ?= /Volumes/data/websites/ssatcy.com
export SMB_DEPLOY_TARGET

.PHONY: dev build deploy deploy-smb smoke verify-production test-deploy

dev:
	npm run dev

build:
	npm run build

deploy: deploy-smb

deploy-smb:
	npm run deploy:smb

smoke:
	npm run smoke:deeplinks

verify-production:
	npm run verify:production

test-deploy:
	npm run test:deploy
