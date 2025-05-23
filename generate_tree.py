import os

def generate_tree_string(file_paths, excluded_dirs):
    # Filter out excluded directories
    filtered_paths = []
    for path in file_paths:
        is_excluded = False
        for excluded_dir in excluded_dirs:
            if path.startswith(excluded_dir):
                is_excluded = True
                break
        if not is_excluded:
            filtered_paths.append(path)

    tree = {}
    filtered_paths.sort()

    for path in filtered_paths:
        is_explicit_dir = path.endswith('/')
        # remove leading/trailing slashes for splitting, filter empty parts from "dir/" -> ["dir", ""]
        parts = [part for part in path.strip('/').split('/') if part] 

        current_level = tree
        for i, part_name in enumerate(parts):
            is_last_part_in_path_str = (i == len(parts) - 1)
            
            # A part represents a directory in the tree if:
            # 1. The original path string for this item ended with a '/' (it's an explicit dir entry)
            # OR 2. It's not the last segment of the path string (e.g., 'api' in 'api/routes/file.js')
            represents_dir_in_tree = is_explicit_dir if is_last_part_in_path_str else True
            
            key = part_name + "/" if represents_dir_in_tree else part_name

            if key not in current_level:
                current_level[key] = {}
            current_level = current_level[key]

    output_lines = ["."]

    def build_string(subtree, prefix=""):
        # Sort entries: directories (ending with /) first, then files, all alphabetically
        entries = sorted(list(subtree.keys()), key=lambda x: (not x.endswith('/'), x.lower()))
        
        for i, entry_name in enumerate(entries):
            connector = "├── " if i < len(entries) - 1 else "└── "
            output_lines.append(prefix + connector + entry_name)
            
            # If it's a directory (key ends with /) and it has children (subtree[entry_name] is not empty), recurse
            if entry_name.endswith('/') and subtree[entry_name]: 
                extension = "│   " if i < len(entries) - 1 else "    "
                build_string(subtree[entry_name], prefix + extension)

    build_string(tree)
    return "\n".join(output_lines)

# List of files and directories obtained from ls() output.
# This list is based on the example output provided earlier.
# The ls() tool should provide paths like "api/" for directories and "app.js" for files.
all_file_paths = [
    ".env",
    "api/", 
    "api/middleware/", 
    "api/middleware/check-auth.js",
    "api/models/", 
    "api/models/order.js",
    "api/models/product.js",
    "api/models/user.js",
    "api/routes/", 
    "api/routes/orders.js",
    "api/routes/products.js",
    "api/routes/user.js",
    "app.js",
    "indexjs.text",
    "nodemon.json",
    "package-lock.json",
    "package.json",
    "server.js",
    "uploads/", 
    "uploads/0ca16f56daa27d64e2f2e702b055c5ec",
    "uploads/1589025368790i2.jpg",
    "uploads/1589025505664_i2.jpg",
    "uploads/2d08563d2f79dbd9452d4553a2a92265",
    "uploads/74b1852f91a7d145567534da20164e42",
    "uploads/e2b7edd79fd7127206f2aae1bea08d7c",
    "uploads/image_1589038505427_se.jpg",
    "uploads/image_1589038579014_se.jpg",
    "uploads/image_1589038746071_se.jpg",
    "uploads/image_1589038806139_se.jpg",
    "uploads/image_1589113848301_sh.jpg",
    "uploads/image_1589114008114_sh.jpg",
    "uploads/image_1589114022174_sh.jpg",
    "uploads/image_1589114116645_i5.jpg",
    "uploads/image_1589114925070_a.jpg",
    "uploads/image_1589115099094_a.jpg",
    "uploads/image_1589115586016_a.jpg",
    "uploads/image_1589115764375_a.jpg",
    "uploads/image_1589115896533_a.jpg",
    "uploads/image_1589115915151_a.jpg",
    "uploads/image_1589116119709_a.jpg",
    "uploads/image_1589116363719_a.jpg",
    "uploads/img_1589025671786_i2.jpg",
    "uploads/img_1589036640474_i2.jpg",
    "uploads/img_1589036775789_i2.jpg",
    "uploads/img_1589037786413_i1.jpg",
    "uploads/img_1589037860035_i7.jpg",
    "uploads/img_1589037884625_a.jpg",
    "uploads/img_1589037901848_rt.jpg",
    "uploads/img_1589037941481_rt.jpg",
    "uploads/img_1589037989297_rt.jpg",
    "uploads/img_1589038239619_rt.jpg",
    "uploads/img_1589038395639_rt.jpg",
]

# Ensure excluded directories end with a slash for correct prefix matching
excluded_directories = ["node_modules/", ".idea/", ".git/"] 

tree_output = generate_tree_string(all_file_paths, excluded_directories)

with open("project_tree.txt", "w") as f:
    f.write(tree_output)

print("Project tree generated in project_tree.txt")
