#!/bin/bash
# AI Commit Metadata Checker
# Validates that AI-generated commits include proper traceability metadata
#
# Usage: bash scripts/ai-commit-check.sh
# Used in CI pipeline to enforce AI traceability standards

echo "========================================"
echo "  AI Commit Traceability Check"
echo "========================================"

ERRORS=0

# Check source files for AI generation headers
echo ""
echo "Checking source files for AI metadata headers..."
for file in src/*.js; do
  if [ -f "$file" ]; then
    if grep -q "Generated with:" "$file"; then
      echo "  ✓ $file — AI metadata found"
    else
      echo "  ⚠ $file — No AI metadata header (add if AI-generated)"
    fi
  fi
done

# Check test files for AI generation headers
echo ""
echo "Checking test files for AI metadata headers..."
for file in tests/*.test.js; do
  if [ -f "$file" ]; then
    if grep -q "Generated with:" "$file"; then
      echo "  ✓ $file — AI metadata found"
    else
      echo "  ⚠ $file — No AI metadata header (add if AI-generated)"
    fi
  fi
done

# Check for hardcoded secrets
echo ""
echo "Scanning for hardcoded secrets..."
if grep -rn 'password\s*=\s*["\x27]' src/ tests/ 2>/dev/null; then
  echo "  ✗ FAIL: Hardcoded password detected!"
  ERRORS=$((ERRORS + 1))
else
  echo "  ✓ No hardcoded passwords"
fi

if grep -rn 'api_key\s*=\s*["\x27]' src/ tests/ 2>/dev/null; then
  echo "  ✗ FAIL: Hardcoded API key detected!"
  ERRORS=$((ERRORS + 1))
else
  echo "  ✓ No hardcoded API keys"
fi

if grep -rn 'AWS_SECRET\|AZURE_KEY\|GCP_KEY' src/ tests/ 2>/dev/null; then
  echo "  ✗ FAIL: Cloud credentials detected!"
  ERRORS=$((ERRORS + 1))
else
  echo "  ✓ No cloud credentials"
fi

# Check for eval usage
echo ""
echo "Scanning for unsafe code patterns..."
if grep -rn 'eval(' src/ 2>/dev/null; then
  echo "  ✗ FAIL: eval() usage detected!"
  ERRORS=$((ERRORS + 1))
else
  echo "  ✓ No eval() usage"
fi

if grep -rn 'new Function(' src/ 2>/dev/null; then
  echo "  ✗ FAIL: new Function() usage detected!"
  ERRORS=$((ERRORS + 1))
else
  echo "  ✓ No new Function() usage"
fi

# Summary
echo ""
echo "========================================"
if [ $ERRORS -eq 0 ]; then
  echo "  All checks passed ✓"
  echo "========================================"
  exit 0
else
  echo "  $ERRORS check(s) FAILED ✗"
  echo "========================================"
  exit 1
fi
