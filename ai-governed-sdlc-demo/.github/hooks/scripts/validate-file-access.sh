#!/bin/bash
# Pre-tool hook: Validate agent file access
# Ensures the coding agent only modifies allowed directories
# Reads tool input from stdin (JSON with file path)

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | grep -oP '"path"\s*:\s*"\K[^"]+' || echo "")

# Allowed directories for agent writes
ALLOWED_DIRS=("src/" "tests/" "docs/")

if [ -z "$FILE_PATH" ]; then
  echo "Hook PASSED: No file path to validate."
  exit 0
fi

ALLOWED=false
for dir in "${ALLOWED_DIRS[@]}"; do
  if [[ "$FILE_PATH" == "$dir"* ]]; then
    ALLOWED=true
    break
  fi
done

if [ "$ALLOWED" = false ]; then
  echo "BLOCKED: Agent attempted to write to restricted path: $FILE_PATH"
  echo "Allowed directories: ${ALLOWED_DIRS[*]}"
  exit 1
fi

echo "Hook PASSED: File path $FILE_PATH is in an allowed directory."
exit 0
