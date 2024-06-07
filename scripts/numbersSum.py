import json
import sys

def calculate_sum(numbers):
    return sum(numbers)

def main(config_file):
    # Read configuration from the file
    with open(config_file, 'r') as f:
        config = json.load(f)

    # Perform the task
    numbers = config.get('numbers', [])
    result = calculate_sum(numbers)

    return result

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python sum_calculator.py <config_file>")
        sys.exit(1)

    config_file = sys.argv[1]
    result = main(config_file)
    print("Sum:", result)
