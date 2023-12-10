#!/bin/bash

name="jwt"
path="./tmp"

mkdir -p $path

# Generate a private RSA key.
openssl genpkey -algorithm RSA -out "$path/$name.pem"

# Read the private key, remove newlines, and format as a single line.
value=$(awk 'NF {printf "%s\\n", $0}' "$path/$name.pem")

# Save the formatted private key to a file.
echo "$value" > "$path/$name.txt"
