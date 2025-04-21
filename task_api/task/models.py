from datetime import datetime

from django.contrib.auth import get_user_model
from django.db import models
from django.db.models import Sum

from common.email import generate_email_body, send_email
from user.models import Group

import common

User = get_user_model()

# 任务状态
class TaskStatus(models.Model):
    name = models.CharField(max_length=128, blank=True, unique=True)

    class Meta:
        db_table = 'task_status'

    def __str__(self):
        return self.name

# 任务分类：项目任务、特性任务
class TaskCategory(models.Model):
    name = models.CharField(max_length=128, blank=True, unique=True)

    class Meta:
        db_table = 'task_category'

    def __str__(self):
        return self.name

# 标签 标记任务标签
class Tag(models.Model):
    name = models.CharField(max_length=128, blank=True, unique=True)
    color = models.CharField(max_length=10, blank=True)

    class Meta:
        db_table = 'tag'

    def __str__(self):
        return self.name


class AbstractTask(models.Model):
    # 任务名
    name = models.CharField(max_length=512, blank=True)

    # 任务类型
    category = models.ForeignKey(TaskCategory, related_name="%(class)s", on_delete=models.SET_DEFAULT, default=1)
    # 任务内容
    content = models.CharField(max_length=2056, null=True)
    # 挑战目标
    challenge = models.CharField(max_length=2056, null=True)
    # 反馈
    feedback = models.CharField(max_length=2056, null=True)

    feedback_time = models.DateTimeField(auto_now=False, auto_now_add=False, null=True)

    sender = models.CharField(max_length=2056, null=True)
    # 创建人
    creator = models.ForeignKey(User, related_name="%(class)s_of_creator", on_delete=models.CASCADE, null=True)

    # 关联项目
    project = models.CharField(max_length=512, null=True)
    # 负责人
    receiver = models.ForeignKey(User, related_name="%(class)s_of_receiver", on_delete=models.CASCADE, null=True)
    # 发布者
    publisher = models.ForeignKey(User, related_name="%(class)s_of_publisher", on_delete=models.CASCADE, null=True)

    workload = models.FloatField(null=True, default=0.0)  # 更改为FloatField并设置默认值为0.0
    #
    act_workload = models.FloatField(null=True, default=0.0)  # 更改为FloatField并设置默认值为0.0
    # 创建时间
    create_time = models.DateField(auto_now=False, auto_now_add=False, null=True)

    start_time = models.DateField(auto_now=False, auto_now_add=False, null=True)
    # 完成时间,用于标记
    done_time = models.DateField(auto_now=False, auto_now_add=False, null=True)
    # 截至时间
    deadline_time = models.DateField(auto_now=False, auto_now_add=False, null=True)
    # 任务状态
    status = models.ForeignKey(TaskStatus, on_delete=models.SET_NULL, null=True)
    # progress
    progress = models.CharField(max_length=32, null=True)

    class Meta:
        abstract = True  # 设置为抽象基类

class Task(AbstractTask):
    # 描述信息
    description = models.CharField(max_length=512, null=True)

    # 关联任务
    related_task = models.ForeignKey('self', on_delete=models.SET_NULL, null=True)
    # 关联Job

    class Meta:
        db_table = 'task'

    def __str__(self):
        return self.name

    # def save(self, *args, **kwargs):
    #     # 项目在进行中，并且进度为100%
    #     if self.status.name == common.TASK_STATUS_PROGRESS and self.progress == '100':
    #         self.status = TaskStatus.objects.get(name=common.TASK_STATUS_COMPLETED)
    #     # 在保存之前检查是否有任何字段被修改
    #     if not self._state.adding and self.status.name in [common.TASK_STATUS_PROGRESS,common.TASK_STATUS_COMPLETED]:
    #         modify_content='<p style="font-weight: bold; font-size: 15px;">修改内容</p>'
    #         orgin_task = Task.objects.get(id=self.id)
    #         for f_obj in self._meta.get_fields():
    #             try:
    #                 f =f_obj.attname
    #                 filed_name = common.TASK_FILED_MAP[f] if  f in common.TASK_FILED_MAP else ""
    #             except AttributeError:
    #                 print(f_obj.name,"不是常规字段")
    #                 continue
    #             #不一样的字段
    #             old = getattr(orgin_task, f, None)
    #             new = getattr(self, f, None)
    #             if f == 'progress':
    #                 old = f"{old}%"
    #                 new = f"{new}%"
    #             if f == 'status_id':
    #                 # pend状态只能由草稿触发
    #                 old = common.STATUS_TO_CHE[old]
    #                 new = common.STATUS_TO_CHE[new]
    #                 if new == common.PEND and old != common.DRAFT:
    #                     return
    #                 # 进行状态只能由PEND状态触发
    #                 elif new == common.PROGRESS and old != common.PEND:
    #                     return
    #                 # 完成只能由进行状态触发
    #                 elif new == common.FINISH and old != common.PROGRESS:
    #                     return
    #
    #             if new != old :
    #                 #发生修改并且修改内容为反馈信息
    #                 if f in ['feedback','progress','act_workload','feedback_time']:
    #                     self.feedback_time = datetime.now()
    #                     if f == 'feedback_time':
    #                         continue
    #                     if f == 'feedback':
    #                         # modify_content += f'<p>上次反馈信息：<p><pre>{old}</pre>'
    #                         modify_content += f'<h4>{datetime.now().strftime("%Y-%m-%d %H:%M")} 最新反馈信息： <h4><pre>{new}</pre>'
    #                     else:
    #                         modify_content += f'<p style="font-weight: bold; font-size: 12px;">{filed_name} ： {old} ===> {new} </p>'
    #                 else:
    #                     modify_content += f'<p style="font-weight: bold; font-size: 12px;">{filed_name} ： {old} ===> {new} </p>'
    #
    #         #检查是否有反馈字段，有加上反馈时间。
    #
    #         email_body=generate_email_body(self,status="被修改",add_content=modify_content)
    #         if self.publisher and self.publisher != self.receiver:
    #             to =[self.publisher.email, self.receiver.email]
    #         else:
    #             to = [self.receiver.email]
    #         senders = self.get_sender_email()
    #         send_email(email_body, to,cc=senders, subject=self.receiver.username,action="任务修改")
    #     super().save(*args, **kwargs)

    def save(self, *args, **kwargs):

        #任务增加修改 组长和Tl都要通知
        to = self.receiver.get_group_leader_email()
        # TL
        if self.creator and self.creator.email and self.creator.email not in to:
            to.append(self.creator.email)

        # 增加任务，只通知平台创建的
        if self._state.adding and self.status_id == common.PEND:
            #获取 TL  组长 邮件
            #获取邮件内容
            email_body = generate_email_body(self, status="新增任务",has_footer=False)
            #下发邮件
            send_email(email_body, to, subject=f'{self.receiver.username}|{self.name}', action="新增任务")
        # 修改任务  # 待下发 进行中、已完成通知
        elif not self._state.adding and self.status_id in [common.PEND,common.PROGRESS,common.FINISH]:
            # 进行中通知执行人
            action = "修改任务"
            if self.status_id in [common.PROGRESS]:
                if not self.receiver.email in to:
                    to.append(self.receiver.email)

            senders = self.get_sender_email()

            # 进度100% 状态修改为已完成
            if self.status_id == common.PROGRESS and self.progress == '100':
                self.status = TaskStatus.objects.get(name=common.TASK_STATUS_COMPLETED)
                action = "任务完成"

            modify_content='<p style="font-weight: bold; font-size: 15px;">修改内容</p>'
            orgin_task = Task.objects.get(id=self.id)
            #生成修改信息
            change_fields=[]
            feed_back_fields =['feedback','progress','act_workload','feedback_time']
            for f_obj in self._meta.get_fields():
                try:
                    f =f_obj.attname
                    filed_name = common.TASK_FILED_MAP[f] if  f in common.TASK_FILED_MAP else ""
                except AttributeError:
                    continue

                # 不一样的字段
                old = getattr(orgin_task, f, None)
                new = getattr(self, f, None)
                # 进度用%
                if f == 'progress':
                    old = f"{old}%"
                    new = f"{new}%"

                if f == 'status_id':
                    #转换为中文
                    old = common.STATUS_TO_CHE[old]
                    new = common.STATUS_TO_CHE[new]

                if new != old :
                    change_fields.append(f)
                    # 状态改变
                    # pend状态只能由草稿触发
                    if new == common.TASK_STATUS_PENDING and old != common.TASK_STATUS_DRAFT:
                        return
                    # 进行状态只能由PEND状态触发
                    elif new == common.TASK_STATUS_PROGRESS and old != common.TASK_STATUS_PENDING:
                        return
                    # 完成只能由进行状态触发
                    #elif new == common.TASK_STATUS_COMPLETED and old != common.TASK_STATUS_PROGRESS:
                    #    return

                    #发生修改并且修改内容为反馈信息
                    if f in ['feedback','progress','act_workload','feedback_time']:
                        self.feedback_time = datetime.now()
                        if f == 'feedback_time':
                            continue
                        if f == 'feedback':
                            # modify_content += f'<p>上次反馈信息：<p><pre>{old}</pre>'
                            modify_content += f'<p>{datetime.now().strftime("%Y-%m-%d %H:%M")} 最新反馈信息： <p><pre style="font-size: 12px;">{new}</pre><p>===END=====</p>'
                        else:
                            modify_content += f'<pre style="font-weight: bold; font-size: 12px;">{filed_name} ： {old} ===> {new} </pre>'
                    #其它普通修改
                    else:
                        modify_content += f'<pre style="font-weight: bold; font-size: 12px;">{filed_name} ： {old} ===> {new} </pre>'

            #在修改内容不是反馈相关的时候才通知邮件
            print('change_fields',change_fields)
            print('feed_back_fields',feed_back_fields)
            if not set(change_fields).issubset(set(feed_back_fields)):
                email_body=generate_email_body(self,status="修改任务",add_content=modify_content)
                #下发邮件
                send_email(email_body, to,cc=senders, subject=f'{self.receiver.username}|{self.name.strip()}', action=action)
        else:
            pass
        super().save(*args, **kwargs)


    def get_sender_email(self):
        cc = []
        if self.sender:
            users = list(set(self.sender.split(",")))
            for username in users:
                u = User.objects.get(username=username)
                if u.email not in cc:
                    cc.append(u.email)
        return cc

    @staticmethod
    def calculate_workload_intensity(receiver_id, start_date, deadline_date):
        # 注意：这个查询假设了start_time和deadline_time都是DateField，不包含时间部分
        # 你可以根据需要调整查询
        tasks = Task.objects.filter(receiver_id=receiver_id,status__name__in=common.TASK_STATUS_FOR_WORKLOAD, start_time__gte=start_date, deadline_time__lte=deadline_date).aggregate(total_workload=Sum('workload'))

        # 检查是否有任务以及天数差是否大于0
        total_workload = tasks['total_workload']
        if total_workload and total_workload > 0:
            return  total_workload
        else:
            return 0.0
