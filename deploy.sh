#!/bin/bash

if [ "$TRAVIS_PULL_REQUEST" == "false" ]; then
  'firebase deploy --only hosting --token $FIREBASE_TOKEN';
else
  echo "Deploy skipped";
fi