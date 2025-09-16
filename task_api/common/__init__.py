# 定义状态常量
TAKE_HOME="http://128.255.125.12:9888/person/index"

PEND = 1
FINISH = 2
# DRAFT = 3
PROGRESS = 4

STATUS_TO_CHE = {
    # DRAFT:'草稿',
    PROGRESS:'进行中',
    FINISH:'已完成',
    PEND: '待下发'
}

TASK_STATUS_CHOICES = {
    # 'DRAFT':'草稿',
    'IN_PROGRESS':'进行中',
    'COMPLETED':'已完成',
    'PENDING': '待下发'
}
TASK_STATUS_PROGRESS = TASK_STATUS_CHOICES['IN_PROGRESS']
# TASK_STATUS_DRAFT = TASK_STATUS_CHOICES['DRAFT']
TASK_STATUS_COMPLETED = TASK_STATUS_CHOICES['COMPLETED']
TASK_STATUS_PENDING = TASK_STATUS_CHOICES['PENDING']

TASK_STATUS_FOR_WORKLOAD = [TASK_STATUS_PROGRESS,TASK_STATUS_PENDING]
TASK_FILED_MAP={
    "id":"ID",
    "name":"任务名",
    "receiver": "执行人",
    "publisher": "发布人",
    "creator": "创建人",
    "start_time": "开始时间",
    "deadline_time": "截至时间",
    "workload": "工作量/天",
    "act_workload": "实际工作量/天",
    "content":"任务内容",
    "challenge":"挑战目标",
    "feedback":"反馈信息",
    "feedback_time":"反馈时间",
    "related_task":"关联项目",
    "status":"当前状态",
    "status_id":"当前状态",
    "sender":"抄送人",
    "description":"描述信息",
    "project":"项目",
    "progress":"进度",
}

SIGNAL_ACTIONS = {
    "created": "新增",
    "updated": "修改",
    "deleted": "删除",
}