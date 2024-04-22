#!/bin/zsh -e
yarn build

OUT_DIR=dist
BUCKET=coredin-frontend
DISTRIBUTION_ID=EG97V09HP3548

aws s3 sync $OUT_DIR s3://$BUCKET/ \
  --delete \
  --metadata-directive REPLACE \
  --cache-control max-age=31536000,public \
  --acl public-read

aws configure set preview.cloudfront true
aws cloudfront create-invalidation --distribution-id $DISTRIBUTION_ID --paths "/*"