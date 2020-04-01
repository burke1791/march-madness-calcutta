#!/bin/bash

if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  'firebase deploy --token $FIREBASE_TOKEN --non-interactive';
else
  echo "Deploy skipped";
fi