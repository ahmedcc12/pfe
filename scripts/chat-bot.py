import requests
import time
import sys
import json

url = "https://simple-chatgpt-api.p.rapidapi.com/ask"

headers = {
    "content-type": "application/json",
    "X-RapidAPI-Key": "35a06d5c0amsh51b3aa193b9c266p1b9989jsn011b0f31c6c4",
    "X-RapidAPI-Host": "simple-chatgpt-api.p.rapidapi.com"
}

def ask(question):
    payload = {"question": question}
    response = requests.post(url, json=payload, headers=headers, verify=False)
    return response.json().get("answer")

def process_questions(config_file):
    results = {}
    # Read and parse the JSON file
    with open(config_file, "r") as f:
        data = json.load(f)
        # Extract questions from the "questions" key
        questions = data.get("questions", [])

    # Process questions
    for question in questions:
        # Make the request and get the answer
        answer = ask(question)
        # Store the question and answer in results
        results[question] = answer
        # Add a delay to avoid hitting rate limits
        time.sleep(5)
    
    return results

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script_name.py <config_file>")
        sys.exit(1)

    config_file = sys.argv[1]
    results = process_questions(config_file)
    print(json.dumps(results, indent=4))
