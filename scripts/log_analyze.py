import sys
import json

def analyze_log(log_file):
    error_count = 0
    warning_count = 0

    with open(log_file, 'r') as f:
        for line in f:
            if 'Error' in line:
                error_count += 1
            elif 'Warning' in line:
                warning_count += 1
    
    return {"errors": error_count, "warnings": warning_count}

if __name__ == "__main__":
    if len(sys.argv) != 2:
        response = {"status": "error", "message": "Usage: python log_analyzer.py <log_file>"}
        print(json.dumps(response))
        sys.exit(1)

    log_file = sys.argv[1]
    report = analyze_log(log_file)
    response = {"report": report}
    print(json.dumps(response))
