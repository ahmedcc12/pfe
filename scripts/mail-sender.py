import smtplib
import sys
import json
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_email(subject, body, to_emails, smtp_server, smtp_port, smtp_user, smtp_password):
    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = ", ".join(to_emails)
    msg['Subject'] = subject

    msg.attach(MIMEText(body, 'plain'))

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(smtp_user, smtp_password)
        text = msg.as_string()
        server.sendmail(smtp_user, to_emails, text)
        server.quit()
        return {"status": "success", "message": "Emails sent successfully"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def process_emails(config_file):
    with open(config_file, "r") as f:
        data = json.load(f)
    
    subject = data.get("subject", "No Subject")
    body = data.get("body", "No Body")
    to_emails = data.get("to_emails", [])
    
    smtp_config = data.get("smtp_config", {})
    smtp_server = smtp_config.get("smtp_server")
    smtp_port = smtp_config.get("smtp_port")
    smtp_user = smtp_config.get("smtp_user")
    smtp_password = smtp_config.get("smtp_password")
    
    if not to_emails or not smtp_server or not smtp_port or not smtp_user or not smtp_password:
        return {"status": "error", "message": "Invalid configuration"}

    result = send_email(subject, body, to_emails, smtp_server, smtp_port, smtp_user, smtp_password)
    return result

if __name__ == "__main__":
    if len(sys.argv) != 2:
        response = {"status": "error", "message": "Usage: python send_emails.py <config_file>"}
        print(json.dumps(response))
        sys.exit(1)

    config_file = sys.argv[1]
    response = process_emails(config_file)
    print(json.dumps(response))
