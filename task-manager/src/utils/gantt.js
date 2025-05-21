// gantt 数据按项目组织
// data demo
/*
{
    "id": 17420,
    "name": "任务测试",
    "category": 1,
    "content": "任务内容",
    "challenge": "挑战目标",
    "feedback": "",
    "creator": 608,
    "receiver": 343,
    "start_time": "2025-02-03",
    "deadline_time": "2025-02-07",
    "project": "CP-V003R016C000_嵌入式软件平台智算网络快速收敛及设备健康度检查等关键技术研发",
    ...
}

tasks: [
    { id: 11, text: "Project #1", type: "project", progress: 0.6, open: true },
    { id: 12, text: "Task #1", start_date: "03-04-2023", duration: 5, parent: 11, progress: 1, open: true },
    { id: 13, text: "Task #2", start_date: "03-04-2023", type: "project", parent: 11, progress: 0.5, open: true },
    { id: 14, text: "Task #3", start_date: "02-04-2023", duration: 6, parent: 11, progress: 0.8, open: true },
    { id: 15, text: "Task #4", type: "project", parent: 11, progress: 0.2, open: true },
],

// 1. project 用项目名最为ID
// 2. 子任务 parent: 项目ID
*/
export const transToProjectGanttData = (tasks) => {
    const projectData = []
    const retData = []

    // project : []
    let isFirst = true
    if( tasks?.length == 0) return retData
    tasks.forEach(x => {
        const tmpProject = x.project
        let tmpData = {}
        // 项目级配置
        if (!(projectData.includes(tmpProject))) {
            projectData.push(tmpProject)
            
            if (isFirst) {
                tmpData = { id: tmpProject, text: tmpProject, type: "project", open: true }
                isFirst = false
            }else{
                tmpData = { id: tmpProject, text: tmpProject, type: "project", open: false }
            }
            // 任务级配置
            retData.push(tmpData)

        }
        retData.push({ ...x, parent: tmpProject}) 
    })
    return retData
}

export const transToRecevierGanttData = (tasks) => {
    const recevierData = []
    const retData = []

    // project : []
    let isFirst = true
    if( tasks?.length == 0) return retData
    tasks.forEach(x => {
        const tmpRecevier = x.receiver_name
        // 项目级配置
        if (!(recevierData.includes(tmpRecevier))) {
            recevierData.push(tmpRecevier)
            let tmpData = {}    
            if (isFirst) {
                tmpData = { id: tmpRecevier, text: tmpRecevier, type: "project", open: true }
                isFirst = false
            }else{
                tmpData = { id: tmpRecevier, text: tmpRecevier, type: "project", open: false }
            }
            retData.push(tmpData)  
        } 
        retData.push({ ...x, parent: tmpRecevier})

        
    })
    return retData
}
