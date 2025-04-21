from django.contrib.auth.models import AbstractUser
from django.db import models

class Role(models.Model):
    name = models.CharField(max_length=20,blank=True,unique=True)
    
    class Meta:  
        db_table = 'role'
    def __str__(self):
        return self.name

class User(AbstractUser):
    id = models.IntegerField(primary_key=True,blank=True,null=False)
    emp_num = models.CharField(max_length=15, blank=True,null=True)
    depart = models.CharField(max_length=32, blank=True, null=True)
    role = models.ForeignKey(Role,on_delete=models.SET_NULL,null=True)
    login_ip = models.CharField(max_length=32, blank=True, null=True)
    home_path = models.CharField(max_length=64, blank=True, null=True)
    config = models.JSONField(default=dict)
    class Meta:  
        db_table = 'user'
    def __str__(self):
        return self.username

    def get_group_leader_email(self):
        groups = self.group.all()
        group_emails = []
        if groups:
            group_emails = list(set([ User.objects.get(username=g.group_leader).email for g in groups]))
        return group_emails

    def get_depart_leader_email(self):
        groups = self.group.all()
        depart_emails = []
        if groups:
            depart_emails = list(set([ User.objects.get(username=g.depart_leader).email for g in groups]))
        return depart_emails

class Group(models.Model):
    name = models.CharField(max_length=48, blank=True,unique=True)
    users = models.ManyToManyField(User,related_name='%(class)s')
    group_leader = models.CharField(max_length=48, blank=True,unique=False,default="")
    depart_leader = models.CharField(max_length=48, blank=True,unique=False,default="")
    class Meta:
        db_table = 'group'

    def __str__(self):
        return self.name

# UserGroupRole 模型（用户-组-角色的中间模型）  
class UserGroupRole(models.Model):  
    user = models.ForeignKey(User, on_delete=models.CASCADE)  
    group = models.ForeignKey(Group, on_delete=models.CASCADE)  
    role = models.ForeignKey(Role, on_delete=models.CASCADE)  
  
    class Meta:  
        db_table = 'user_group_role'
        unique_together = (('user', 'group', 'role'),)  # 确保用户-组-角色组合是唯一的  
  
    def __str__(self):  
        return f"{self.user.username} in {self.group.name} as {self.role.name}" 
