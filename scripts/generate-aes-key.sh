#!/bin/bash

name="aes"
path="./tmp"
size=256

mkdir -p $path

# Generate a random key using openssl.
value=$(openssl rand -hex $((size / 8)))

# Save the formatted private key to a file.
echo "$value" > "$path/$name.txt"
