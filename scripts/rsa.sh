#!/bin/bash

path="./tmp"
file="$path/pandora.pem"

mkdir -p $path

# Generate a private RSA key.
openssl genpkey -algorithm RSA -out $file

# Read the private key, remove newlines, and format as a single line.
value=$(awk 'NF {printf "%s\\n", $0}' "$file")

# Save the formatted private key to a file.
echo "$value" > "$file.txt"
