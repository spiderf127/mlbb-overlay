import re

def main():
    # Read test.js (which has the correct defRoster and loadRoster)
    with open('test.js', 'r', encoding='utf-8') as f:
        test_js = f.read()

    # Extract defRoster from test.js
    def_roster_match = re.search(r'function defRoster\(\)\{return\[.*?\]\.map\(h => \(\{\.\.\.h, portrait: h\.img, icon: h\.img\}\)\);\}', test_js, re.DOTALL)
    if not def_roster_match:
        print("Could not extract defRoster from test.js")
        return
    def_roster_str = def_roster_match.group(0)

    # Extract loadRoster from test.js
    load_roster_match = re.search(r'function loadRoster\(\) \{.*?return defRoster\(\);\n\}', test_js, re.DOTALL)
    if not load_roster_match:
        print("Could not extract loadRoster from test.js")
        return
    load_roster_str = load_roster_match.group(0)

    # Read operator.html
    with open('operator.html', 'r', encoding='utf-8') as f:
        operator_html = f.read()

    # Replace defRoster in operator.html
    operator_html = re.sub(r'function defRoster\(\)\{return\[.*?\].map\(h => \(\{\.\.\.h, portrait: h\.img, icon: h\.img\}\)\);\}', def_roster_str, operator_html, flags=re.DOTALL)

    # Replace loadRoster in operator.html
    # It might be using the old loop logic
    operator_html = re.sub(r'function loadRoster\(\) \{.*?return defRoster\(\);\n\}', load_roster_str, operator_html, flags=re.DOTALL)

    with open('operator.html', 'w', encoding='utf-8') as f:
        f.write(operator_html)

    print("Successfully synchronized operator.html with the new test.js rosters!")

if __name__ == "__main__":
    main()
