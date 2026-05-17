# Default deploy target for this static site.
SMB_DEPLOY_TARGET ?= /Volumes/data/websites/ssatcy.com
export SMB_DEPLOY_TARGET

.PHONY: dev build deploy deploy-smb smoke

dev:
	npm run dev

build:
	npm run build

deploy: deploy-smb

deploy-smb:
	npm run deploy:smb

smoke:
	npm run smoke:deeplinks
