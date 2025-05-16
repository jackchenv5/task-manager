from django.db import models

# Create your models here.
from django.contrib.auth import get_user_model

User = get_user_model()


class Project(models.Model):
    PROJECT_TYPE_CHOICES = ((0, "项目"), (1, "非项目"))
    name = models.CharField(
        max_length=255, unique=True, primary_key=True, verbose_name="项目名"
    )
    owner = models.ForeignKey(
        User,
        related_name="owned_projects",
        on_delete=models.CASCADE,
        verbose_name="属主",
    )
    project_type = models.CharField(max_length=8,verbose_name="项目类型", default="项目")
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    class Meta:
        db_table = "project"
        verbose_name = "项目管理"
        indexes = [
            models.Index(fields=["name" ]),
        ]

    def __str__(self):
        return f"{self.name}"


# 其它数据 参与此项目人员的 反馈信息 ，组长评价、项目经理评价、自评


class ProjectEvaluation(models.Model):
    project = models.ForeignKey(
        Project,
        related_name="evaluations",
        on_delete=models.CASCADE,
        verbose_name="关联项目",
    )
    evaluated_user = models.ForeignKey(
        User,
        related_name="received_evaluations",
        on_delete=models.CASCADE,
        verbose_name="被评价人",
    )
    evaluator = models.ForeignKey(
        User,
        related_name="given_evaluations",
        on_delete=models.CASCADE,
        verbose_name="评价人",
    )
    evaluation_type = models.CharField(max_length=8, verbose_name="评价类型")
    score = models.PositiveSmallIntegerField(verbose_name="评分")
    comment = models.TextField(max_length=1000, blank=True, verbose_name="评语")
    evaluation_time = models.DateTimeField(verbose_name="评价时间")
    created_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")

    class Meta:
        db_table = "project_evaluation"
        unique_together = [
            ("evaluated_user", "evaluator", "evaluation_time", "evaluation_type"),
            ("project", "evaluated_user", "evaluation_time", "evaluation_type"),
        ]
        verbose_name = "项目评价"
        indexes = [
            models.Index(fields=["evaluation_time", "evaluation_type"]),
        ]
