#!/bin/bash
# Post-tool hook: Scan for hardcoded secrets after file writes
# This hook runs automatically when the coding agent writes files

ERRORS=0

# Check for common secret patterns in src/ and tests/
for pattern in 'password\s*=' 'api_key\s*=' 'secret\s*=' 'AWS_SECRET' 'AZURE_KEY' 'token\s*=\s*["\x27]'; do
  if grep -rn "$pattern" src/ tests/ 2>/dev/null; then
    echo "BLOCKED: Secret pattern detected: $pattern"
    ERRORS=$((ERRORS + 1))
  fi
done

if [ $ERRORS -gt 0 ]; then
  echo "Hook FAILED: $ERRORS secret pattern(s) found. Agent must remove them."
  exit 1
fi

echo "Hook PASSED: No secrets detected."
exit 0
