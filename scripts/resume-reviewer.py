import openai
from PyPDF2 import PdfReader
import sys

# Set your OpenAI API key
openai.api_key = 'sk-proj-LqlfzUKTIhRh5j7ttu5nT3BlbkFJyBX1MlH8eWlCHL8DKxSP'

def extract_text_from_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text()
    return text
def get_resume_score(resume_text, job_description):
    prompt = (
        "You are a hiring manager. Given the following resume and job description, "
        "score the resume on a scale of 1 to 10 based on how well it matches the job description.\n\n"
        "Resume:\n" + resume_text + "\n\n"
        "Job Description:\n" + job_description + "\n\n"
        "Score (1-10):"
    )
    
    response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt(language="en",prompt=prompt),
        max_tokens=50,
    )
    
    score = response['choices'][0]['text'].strip()
    try:
        score = int(score)
    except ValueError:
        score = "Error: Unable to determine score"
    return score

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py path/to/resume.pdf")
        sys.exit(1)

    resume_path = sys.argv[1]  # Path to the resume PDF file
    job_description_path = 'C:/Users/acharfeddine/Desktop/scripts/job_description.txt'  # Path to the job description text file

    with open(job_description_path, 'r') as file:
        job_description = file.read()

    resume_text = extract_text_from_pdf(resume_path)
    score = get_resume_score(resume_text, job_description)

    print(f"Resume Score: {score}/10")
