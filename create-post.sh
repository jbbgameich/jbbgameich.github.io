#!/usr/bin/env bash

export TITLE="$1"
export DATE=$(date -I)
export DATETIME="$(date --rfc-3339 seconds)"

if [ -z "${TITLE}" ]; then
	echo "Usage: ./create-post.sh title"
	exit 1
fi

cat << EOF > "_posts/${DATE}-$(echo ${TITLE} | sed 's/ /-/g').md"
---
layout: post
title:  "${TITLE}"
date:   ${DATETIME}
categories: kde
---

EOF
