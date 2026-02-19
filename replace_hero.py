
import os

target_file = "src/results/TeaserPageNew.tsx"
replacement_file = "temp_hero.tsx"
start_line = 38  # 1-based, inclusive
end_line = 126   # 1-based, inclusive

try:
    with open(target_file, "r") as f:
        lines = f.readlines()

    with open(replacement_file, "r") as f:
        new_content = f.read()

    # Verify context (optional but good)
    print(f"Replacing lines {start_line} to {end_line}")
    print(f"Original start: {lines[start_line-1].strip()}")
    print(f"Original end: {lines[end_line-1].strip()}")

    # Slice and splice
    # lines[0 : start_line-1] keeps lines 1 to 37
    # new_content
    # lines[end_line : ] keeps lines 127 to end
    
    new_lines = lines[:start_line-1] + [new_content + "\n"] + lines[end_line:]
    
    with open(target_file, "w") as f:
        f.writelines(new_lines)
        
    print("Replacement successful.")
    
except Exception as e:
    print(f"Error: {e}")
