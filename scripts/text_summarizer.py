import sys
import json
import openai
import requests
import time

# Define your OpenAI API key

url = "https://simple-chatgpt-api.p.rapidapi.com/ask"

headers = {
    "content-type": "application/json",
    "X-RapidAPI-Key": "35a06d5c0amsh51b3aa193b9c266p1b9989jsn011b0f31c6c4",
    "X-RapidAPI-Host": "simple-chatgpt-api.p.rapidapi.com"
}


def ask(paragraph):
    payload = {"question": "Summarize this paragraph in 50 words or less paragraph : {paragraph}"}
    response = requests.post(url, json=payload, headers=headers, verify=False)
    # Extract the summarized text from the API response
    return response.json().get("answer")


def process_questions(config_file):
    results = {}
    # Read and parse the JSON file
    with open(config_file, "r") as f:
        data = json.load(f)
        # Extract questions from the "questions" key
        paragraphs = data.get("paragraphs", [])

    # Process paragraphs
    for paragraph in paragraphs:
        # Make the request and get the answer
        answer = ask(paragraph)
        # Store the paragraph and answer in results
        results[paragraph] = answer
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

