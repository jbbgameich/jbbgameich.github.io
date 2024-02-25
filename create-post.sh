#!/usr/bin/env bash

export TITLE="$1"
export DATE=$(date -I)
export DATETIME="$(date --rfc-3339 seconds)"

cat << EOF > "_posts/${DATE}-$(echo ${TITLE} | sed 's/ /-/g').md"
---
layout: post
title:  "${TITLE}"
date:   ${DATETIME}
categories: kde
---

EOF
