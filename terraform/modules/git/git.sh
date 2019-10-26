#!/bin/bash

set -e

SHORT_SHA=$(git rev-parse --short HEAD)
echo "{\"short_sha\":\"$SHORT_SHA\"}"
