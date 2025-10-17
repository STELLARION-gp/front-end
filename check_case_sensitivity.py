#!/usr/bin/env python3
"""
Check for case-sensitivity mismatches between SCSS imports and actual files.
This is important for Docker builds on Linux which is case-sensitive.
"""

import os
import re
from pathlib import Path

def find_scss_imports(root_dir):
    """Find all SCSS imports in TypeScript files."""
    imports = []
    
    for ts_file in Path(root_dir).rglob('*.tsx'):
        try:
            with open(ts_file, 'r', encoding='utf-8') as f:
                content = f.read()
                # Find all imports ending with .scss
                matches = re.findall(r'import\s+.*?[\'"]([^\'"]*\.scss)[\'"]', content)
                for match in matches:
                    imports.append((str(ts_file), match))
        except Exception as e:
            print(f"Error reading {ts_file}: {e}")
    
    for ts_file in Path(root_dir).rglob('*.ts'):
        if 'node_modules' in str(ts_file):
            continue
        try:
            with open(ts_file, 'r', encoding='utf-8') as f:
                content = f.read()
                matches = re.findall(r'import\s+.*?[\'"]([^\'"]*\.scss)[\'"]', content)
                for match in matches:
                    imports.append((str(ts_file), match))
        except Exception as e:
            print(f"Error reading {ts_file}: {e}")
    
    return imports

def resolve_import_path(import_file, import_path):
    """Resolve relative import path to absolute path."""
    import_dir = os.path.dirname(import_file)
    resolved = os.path.normpath(os.path.join(import_dir, import_path))
    return resolved

def main():
    root_dir = '/Users/nimnapathum/Documents/GitHub/STELLARION/front-end/frontend/src'
    
    print("🔍 Checking for case-sensitivity issues in SCSS imports...\n")
    
    imports = find_scss_imports(root_dir)
    issues = []
    
    for import_file, import_path in imports:
        resolved_path = resolve_import_path(import_file, import_path)
        
        if not os.path.exists(resolved_path):
            # Try to find file with different case
            dir_path = os.path.dirname(resolved_path)
            filename = os.path.basename(resolved_path)
            
            if os.path.exists(dir_path):
                for actual_file in os.listdir(dir_path):
                    if actual_file.lower() == filename.lower() and actual_file != filename:
                        issues.append({
                            'file': import_file.replace(root_dir + '/', 'src/'),
                            'import': import_path,
                            'expected': filename,
                            'actual': actual_file
                        })
                        break
    
    if not issues:
        print("✅ No case-sensitivity issues found!")
    else:
        print(f"⚠️  Found {len(issues)} case-sensitivity issue(s):\n")
        for issue in issues:
            print(f"❌ File: {issue['file']}")
            print(f"   Import: {issue['import']}")
            print(f"   Expected: {issue['expected']}")
            print(f"   Actual: {issue['actual']}")
            print()
    
    return len(issues)

if __name__ == '__main__':
    exit(main())
