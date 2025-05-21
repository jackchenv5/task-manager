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

