
import os
import smtplib
import mimetypes
from email.message import EmailMessage

from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

# --- Configuration (can be moved to config/env) ---
SMTP_SERVER = 'smtp.gmail.com'
SMTP_PORT = 465
EMAIL_SENDER = 'no-reply@WDLAdmin.com'
EMAIL_USER = 'nikhilsaindane14@gmail.com'
EMAIL_PASSWORD = 'piez hqdt jhvp cmyg'  # App Password from Google
EMAIL_RECIPIENTS = [
    "amit.chopra@capgemini.com",
    "amit.chopra.78@gmail.com"
]
EMAIL_CC = ["amit.chopra@capgemini.com"]


def send_email(subject, recipient, plain_text, html_body):
    try:
        msg = EmailMessage()
        msg['Subject'] = subject
        msg['From'] = EMAIL_SENDER
        msg['To'] = recipient
        msg.set_content(plain_text)
        msg.add_alternative(html_body, subtype='html')

        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as smtp:
            smtp.login(EMAIL_USER, EMAIL_PASSWORD)
            smtp.send_message(msg)

        print(f"[INFO] Email sent to {recipient}")
    except Exception as e:
        print(f"[ERROR] Failed to send email: {str(e)}")

def send_otp_email(recipient_email, otp):
    subject = "Your Login OTP"
    plain_text = f"Your OTP is: {otp}. It will expire in 5 minutes."
    html_body = f"<html><body><h3>Your OTP is: {otp}</h3><p>Expires in 5 minutes.</p></body></html>"
    send_email(subject, recipient_email, plain_text, html_body)

def send_approval_request_email(admin_email, user_email, demo_name, approval_url):
    subject = "New Access Request Pending Approval"
    plain_text = f"User {user_email} requested access to '{demo_name}'. Review here: {approval_url}"
    html_body = f"""
    <html><body>
    <h3>Access Request Notification</h3>
    <p>User <strong>{user_email}</strong> requested access to <strong>{demo_name}</strong>.</p>
    <p>{approval_url}</p>
    </body></html>
    """
    send_email(subject, admin_email, plain_text, html_body)

def send_decision_email(user_email, demo_name, status, reason=None):
    subject = f"Access Request {status}"
    plain_text = f"Your request for '{demo_name}' has been {status}."
    if reason:
        plain_text += f"\nReason: {reason}"
    html_body = f"""
    <html><body>
    <h3>Your request for <strong>{demo_name}</strong> has been <strong>{status}</strong>.</h3>
    {"<p><strong>Reason:</strong> " + reason + "</p>" if reason else ""}
    </body></html>
    """
    send_email(subject, user_email, plain_text, html_body)
def create_html_body(claim_id, claim_data, has_attachments, attachment_types):
    print(f"[DEBUG]::NEW SERVICE-EMAIL-SERVICE::create_html_body:: claim_data=: {claim_data} for attachment_types {attachment_types}")
    """Create the HTML body for the claim email."""
    return f"""
    <div style="font-family:Arial,sans-serif; padding:20px; border:1px solid #ddd;">
        <h2 style="color:#2b6cb0;">Travel Claim Submitted</h2>
        <p><strong>Claim ID:</strong> {claim_id}</p>
        <p><strong>Employee:</strong> {claim_data['employeeId']} ({claim_data['employeeRole']})</p>
        <p><strong>Purpose:</strong> {claim_data['claimPurpose']}</p>
        <p><strong>Description:</strong> {claim_data.get('description', 'N/A')}</p>
        <p><strong>Amount:</strong> {claim_data['claimAmount']} {claim_data['currency']}</p>
        <p><strong>Cost Center:</strong> {claim_data['costCenter']}</p>
        <p><strong>Trip Type:</strong> {claim_data['tripType']}</p>
        <p><strong>Status:</strong> {claim_data.get('status', 'New')}</p>
        <p><strong>Manager Approval:</strong> {claim_data.get('managerApproval', 'Pending')}</p>
        <p><strong>Has Attachments:</strong> {has_attachments}</p>
        <p><strong>Attachment Types:</strong> {', '.join(attachment_types) if attachment_types else 'None'}</p>
        <hr>
        <p style="color:gray; font-size:12px;">This is an automated email from RHIM Travel & Expense Portal.<br>
        Your claim <strong>{claim_id}</strong> for <strong>{claim_data['claimPurpose']}</strong> has been submitted for review.</p>
    </div>
    """


def attach_files_to_message(msg, attachments):
    """Attach files to the email message and return their MIME types."""
    attachment_types = []
    for file_path in attachments or []:
        if os.path.exists(file_path):
            mime_type, _ = mimetypes.guess_type(file_path)
            maintype, subtype = (mime_type or 'application/octet-stream').split('/')
            attachment_types.append(mime_type or 'application/octet-stream')

            with open(file_path, 'rb') as f:
                msg.add_attachment(
                    f.read(),
                    maintype=maintype,
                    subtype=subtype,
                    filename=os.path.basename(file_path)
                )
        else:
            print(f"[WARN] Attachment not found: {file_path}")
    return attachment_types



def send_claim_email(claim_data, claim_id, attachments=None):
    print(f"[DEBUG]::NEW SERVICE-EMAIL-SERVICE::send_claim_email:: claim_data=: {claim_data} for attachments {attachments}")

    # Normalize attachments
    if attachments and isinstance(attachments, str):
        attachments = [attachments]

    print(f"[DEBUG] Sending claim email for Claim ID {claim_id} | Attachments: {attachments}")

    try:
        # Step 1: Create the outer message (multipart/mixed)
        msg = EmailMessage()
        msg['Subject'] = f"[Claim Submitted] Claim #{claim_id} by {claim_data['employeeId']} (TEST by Amit Chopra DI Team)"
        msg['From'] = EMAIL_SENDER
        msg['To'] = ', '.join(EMAIL_RECIPIENTS)
        msg['Cc'] = ', '.join(EMAIL_CC)

        # Step 2: Create the alternative part (plain + HTML)
        plain_text = "Your claim has been submitted. Please view the HTML version for full details."
        html_body = create_html_body(claim_id, claim_data, has_attachments="Yes" if attachments else "No", attachment_types=["(attached)"])

        # Step 3: Use `set_content()` and `add_alternative()` together
        msg.set_content(plain_text)
        msg.add_alternative(html_body, subtype='html')

        # Step 4: Attach files
        attachment_types = attach_files_to_message(msg, attachments)

        print(f"[INFO] Email message built successfully. Sending...")

        # Step 5: Send email
        with smtplib.SMTP_SSL(SMTP_SERVER, SMTP_PORT) as smtp:
            smtp.login(EMAIL_USER, EMAIL_PASSWORD)
            smtp.send_message(msg)

        print(f"[INFO] Email successfully sent for Claim ID {claim_id}")

    except Exception as e:
        print(f"[ERROR] Failed to send email for Claim ID {claim_id}: {str(e)}")
