#!/bin/bash

# Script to find case-sensitivity mismatches between imports and actual files

cd /Users/nimnapathum/Documents/GitHub/STELLARION/front-end/frontend

echo "🔍 Checking for case-sensitivity issues..."
echo ""

# Get all SCSS imports
grep -r "import.*\.scss" src --include="*.tsx" --include="*.ts" | grep -v node_modules > /tmp/imports.txt

issues_found=0

while IFS= read -r line; do
    # Extract the file path and import path
    file=$(echo "$line" | cut -d: -f1)
    import=$(echo "$line" | sed -n "s/.*['\"]\\(.*\\.scss\\)['\"].*/\\1/p")
    
    if [ -n "$import" ]; then
        # Get directory of the importing file
        import_dir=$(dirname "$file")
        
        # Resolve the relative import path
        resolved_path="$import_dir/$import"
        
        # Normalize the path
        normalized_path=$(cd "$import_dir" 2>/dev/null && realpath --relative-to=. "$import" 2>/dev/null || echo "$import")
        
        # Check if file exists with exact case
        if [ ! -f "$resolved_path" ]; then
            # Try to find the file with different case
            dir_path=$(dirname "$resolved_path")
            filename=$(basename "$resolved_path")
            
            if [ -d "$dir_path" ]; then
                actual_file=$(find "$dir_path" -maxdepth 1 -iname "$filename" -type f 2>/dev/null | head -1)
                
                if [ -n "$actual_file" ] && [ "$actual_file" != "$resolved_path" ]; then
                    echo "❌ Case mismatch in: $file"
                    echo "   Import: $import"
                    echo "   Actual: ${actual_file#$import_dir/}"
                    echo ""
                    issues_found=$((issues_found + 1))
                fi
            fi
        fi
    fi
done < /tmp/imports.txt

rm /tmp/imports.txt

if [ $issues_found -eq 0 ]; then
    echo "✅ No case-sensitivity issues found!"
else
    echo "⚠️  Found $issues_found case-sensitivity issue(s)"
fi
