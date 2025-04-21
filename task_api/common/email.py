from django.core.mail import EmailMessage

import common


def generate_email_body(tasks, publisher=None, status="首次下发", add_content="",has_footer=True):
    # 使用HTML模板来生成邮件内容
    if not isinstance(tasks, list):
        tasks = [tasks]
    all_task_html = ""
    footer_html = ""
    if has_footer:
        footer_html=f"""
                <p>请尽快查看并处理此任务。如有任何疑问，请与组长当面沟通。</p>
                <p><a href="{common.TAKE_HOME}">点击查看我的任务!</a></p>  
                <p>谢谢！</p>  
                """
    for task in tasks:
        publisher = task.publisher.username if task.publisher else "未指定"
        creator = task.creator.username if task.creator else "未指定"
        all_task_html += f"""
             <div class="task-info">  
                <p class="task-name"> 任务名： {task.name}</p> 
                <p style="font-size:12px;" > 项目：{task.project} </p>  
                <p style="font-size:12px">ID：{task.id} &nbsp &nbsp 执行人：{task.receiver.username} &nbsp &nbsp 状态：{status}&nbsp &nbsp 下发人：{publisher} &nbsp &nbsp 创建人：{creator} &nbsp &nbsp</p>  
                <p> 描述信息：{task.description} </p>  
                <p class="due-date">工作量: {task.workload} 天<span> &nbsp &nbsp&nbsp &nbsp 开始日期: {task.start_time}</span>&nbsp &nbsp&nbsp &nbsp&nbsp &nbsp<span>截止日期: {task.deadline_time}</span></p>
                <p style="font-weight: bold;"><span style="font-size:14px;color:#862123">任务内容:</span> {task.content}</p>  
                <p style="font-weight: bold;"><span style="font-size:14px;color:#862123">挑战目标:</span> {task.challenge}</p>  
                <div style="background: #f5f5f5;border: 1px solid #bd6767;">{add_content}</div>
            </div>  
            """
    html_content = f"""  
    <html>  
    <head>  
        <style>  
            body {{  
                font-family: Arial, sans-serif;  
                margin: 0;  
                padding: 10px;  
            }}  
            h1 {{  
                color: #333;  
                font-size: 24px;  
                margin: 0 0 5px 0;  
            }}  
            p {{  
                color: #666;  
                font-size: 12px;  
            }}  
            .task-info {{
                padding:20px;
                margin-bottom: 10px; 
                border: 1px solid #2e2e1f;
                width:80%;
            }} 
            .task-name {{  
                font-weight: bold; 
                font-size: 14px;  
            }}   
            .due-date {{  
                font-weight: bold;  
                color: #0099cc;  
            }}  
        </style>  
    </head>  
    <body>   
        {all_task_html} 
        {footer_html}
    </body>  
    </html>  
    """
    return html_content


def send_email(html_content,to_email,cc=None,subject="",action="任务下发"):
    subject = '【看板-任务系统】' + subject.replace('\n', ' ').replace('\r', ' ') + " " + action
    from_email = 'scmsender@rd.maipu.com'  # 修改为你的发件人邮箱
    if not isinstance(to_email, list):
        to_email = [to_email]  # 修改为你的收件人邮箱列表
    to_cc = []
    if cc:
        to_cc = cc
    email = EmailMessage(
        subject=subject,
        body='',  # 纯文本内容为空，因为我们只发送 HTML
        from_email=from_email,
        to=to_email,
        cc=to_cc,
        headers={'Content-Type': 'text/html'}  # 设置内容类型为 HTML
    )

    # 设置 HTML 内容
    email.content_subtype = 'html'  # 明确指定内容为 HTML
    email.body = html_content  # 将 HTML 字符串设置为邮件正文
    # 发送邮件
    email.send()


