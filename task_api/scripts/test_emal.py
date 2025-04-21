import django
import os
import sys

#启动django
from pathlib import Path
from django.core.mail import send_mail

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = str(Path(__file__).resolve().parent.parent)
sys.path.insert(0,BASE_DIR)

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'task_api.settings')
django.setup()

def send_test_email():
    subject = 'Test Email from Django'
    message = 'This is a test email sent using Django\'s email functionality.'
    from_email = 'scmsender@rd.maipu.com'  # 修改为你的发件人邮箱
    to_email = ['chenchengf@rd.maipu.com']  # 修改为你的收件人邮箱列表

    # 发送邮件
    send_status = send_mail(subject, message, from_email, to_email)

    if send_status == 1:
        print('Test email sent successfully!')
    else:
        print('Failed to send test email.')


if __name__ == '__main__':
    send_test_email()