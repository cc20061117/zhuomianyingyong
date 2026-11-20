import { useState } from 'react'
import {
  Empty,
  Space,
  Select,
  Card,
  Tag,
  Progress,
  Input,
  Button,
  List,
  Checkbox,
  Segmented,
  Popconfirm
} from 'antd'
import {
  ProjectOutlined,
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'

export default function Tasks({
  projectList = [],
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onEditTask
}) {
  const [currentProjectId, setCurrentProjectId] = useState('')
  const [taskInput, setTaskInput] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [editingTaskId, setEditingTaskId] = useState('')
  const [editingTitle, setEditingTitle] = useState('')

  // 当前选中的项目：优先取手动切换的，否则默认取第一个
  const currentProject = projectList.find((item) => item.id === currentProjectId) || projectList[0]

  // 切换所属项目
  const handleProjectChange = (projectId) => {
    setCurrentProjectId(projectId)
    // 切换项目时退出编辑状态，避免编辑到其他项目下的任务
    handleCancelEdit()
  }

  // 新增任务：按 Enter 回车键或点击按钮都可以触发
  const handleCreateTask = () => {
    const title = taskInput.trim()
    if (!title || !currentProject) return
    if (onAddTask) {
      onAddTask(currentProject.id, title)
    }
    setTaskInput('')
  }

  // 切换任务完成状态（勾选/取消勾选）
  const handleToggle = (taskId) => {
    if (onToggleTask) {
      onToggleTask(currentProject.id, taskId)
    }
  }

  // 删除任务
  const handleDelete = (taskId) => {
    if (onDeleteTask) {
      onDeleteTask(currentProject.id, taskId)
    }
  }

  // 进入编辑状态（双击任务名或点击编辑按钮）
  const handleStartEdit = (task) => {
    setEditingTaskId(task.id)
    setEditingTitle(task.title)
  }

  // 保存编辑（按 Enter 或点击保存按钮）
  const handleSaveEdit = () => {
    const title = editingTitle.trim()
    if (title && editingTaskId && onEditTask) {
      onEditTask(currentProject.id, editingTaskId, title)
    }
    setEditingTaskId('')
    setEditingTitle('')
  }

  // 取消编辑（按 Esc 或点击取消按钮）
  const handleCancelEdit = () => {
    setEditingTaskId('')
    setEditingTitle('')
  }

  // 如果系统里面没有任何项目，友好提示先去创建
  if (!projectList.length || !currentProject) {
    return (
      <div className="renwuguanli">
        <h2>任务管理清单</h2>
        <Empty
          style={{ marginTop: 60 }}
          description="系统暂无可用任务，请先前往左侧【项目管理】创建项目"
        />
      </div>
    )
  }

  // 当前项目的任务统计
  const tasks = currentProject.tasks || []
  const totalCount = tasks.length
  const completedCount = tasks.filter((task) => task.completed).length
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0

  // 按状态筛选后的任务列表
  const filteredTasks = tasks.filter((task) => {
    if (statusFilter === 'doing') return !task.completed
    if (statusFilter === 'done') return task.completed
    return true
  })

  return (
    <div className="renwuguanli">
      {/* 1. 顶部操作栏与项目选择器 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>任务管理清单</h2>
          <span style={{ color: '#8c8c8c', fontSize: '13px' }}>
            拆解实训阶段目标，标间完成情况并实时统计进度
          </span>
        </div>
        {/* 项目下拉选择器 */}
        <Space>
          <span style={{ fontSize: '14px', color: '#595959', fontWeight: 500 }}>
            <ProjectOutlined style={{ marginRight: 6 }} />
            切换所属项目：
          </span>
          <Select
            value={currentProject.id}
            onChange={handleProjectChange}
            style={{ width: 260 }}
            options={projectList.map((item) => ({
              label: item.name,
              value: item.id
            }))}
          ></Select>
        </Space>
      </div>

      {/* 2. 当前选中项目的基本信息与实时进度看板 */}
      <Card
        style={{ marginBottom: '20px', background: '#fafafa', border: '1px solid #f0f0f0' }}
        styles={{ body: { padding: '20px' } }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px',
            flexWrap: 'wrap',
            gap: '8px'
          }}
        >
          <div>
            <span style={{ fontSize: '16px', fontWeight: 'bold', marginRight: '10px' }}>
              {currentProject.name}
            </span>
            <Tag color="blue">{currentProject.course}</Tag>
          </div>
          <div style={{ fontSize: '15px', color: '#8c8c8c' }}>
            <span>
              总任务：<b>{totalCount}</b> 项
            </span>
            <span style={{ margin: '0 8px' }}>|</span>
            <span style={{ color: '#52c41a' }}>
              已完成：<b>{completedCount}</b> 项
            </span>
            <span style={{ margin: '0 8px' }}>|</span>
            <span style={{ color: '#faad14' }}>
              待推进：<b>{totalCount - completedCount}</b> 项
            </span>
          </div>
        </div>
        <Progress
          percent={percent}
          status={percent >= 100 ? 'success' : 'active'}
          strokeColor={{ '0%': '#108ee9', '100%': '#52c41a' }}
        />
      </Card>

      {/* 3. 极简任务快速录入输入框 */}
      <Space.Compact style={{ width: '100%', marginBottom: '20px' }}>
        <Input
          size="large"
          placeholder="输入实训待办任务，例如：完成前端页面开发与组件封装（支持按 Enter 回车键添加）"
          value={taskInput}
          onChange={(e) => setTaskInput(e.target.value)}
          onPressEnter={handleCreateTask}
        />
        <Button type="primary" size="large" icon={<PlusOutlined />} onClick={handleCreateTask}>
          添加任务
        </Button>
      </Space.Compact>

      {/* 4. 任务清单列表（支持状态筛选、双击编辑） */}
      <Card
        title="实训待办任务列表"
        extra={
          <Segmented
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { label: '全部', value: 'all' },
              { label: '进行中', value: 'doing' },
              { label: '已完成', value: 'done' }
            ]}
          />
        }
        style={{ border: '1px solid #f0f0f0' }}
      >
        {filteredTasks.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              tasks.length === 0
                ? '当前项目还没有任何任务，快在上方输入框添加一个吧！'
                : '该筛选状态下暂无任务'
            }
          />
        ) : (
          <List
            dataSource={filteredTasks}
            renderItem={(task) => (
              <List.Item
                key={task.id}
                actions={[
                  editingTaskId === task.id ? (
                    <Button
                      key="save"
                      type="text"
                      icon={<CheckOutlined />}
                      onClick={handleSaveEdit}
                    >
                      保存
                    </Button>
                  ) : (
                    <Button
                      key="edit"
                      type="text"
                      icon={<EditOutlined />}
                      onClick={() => handleStartEdit(task)}
                    >
                      编辑
                    </Button>
                  ),
                  editingTaskId === task.id ? (
                    <Button
                      key="cancel"
                      type="text"
                      icon={<CloseOutlined />}
                      onClick={handleCancelEdit}
                    >
                      取消
                    </Button>
                  ) : (
                    <Popconfirm
                      key="delete"
                      title="确认删除该任务？"
                      description={`「${task.title}」删除后无法恢复。`}
                      okText="确认删除"
                      okButtonProps={{ danger: true }}
                      cancelText="取消"
                      onConfirm={() => handleDelete(task.id)}
                    >
                      <Button type="text" danger icon={<DeleteOutlined />}>
                        删除
                      </Button>
                    </Popconfirm>
                  )
                ]}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                  {/* 完成状态勾选框 */}
                  <Checkbox checked={task.completed} onChange={() => handleToggle(task.id)} />
                  {/* 任务名称（双击可编辑，已完成添加横线划掉和灰色弱化） */}
                  {editingTaskId === task.id ? (
                    <Input
                      size="small"
                      autoFocus
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      onPressEnter={handleSaveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          handleCancelEdit()
                        }
                      }}
                      style={{ maxWidth: 360 }}
                    />
                  ) : (
                    <span
                      style={{
                        fontSize: '14px',
                        color: task.completed ? '#8c8c8c' : '#262626',
                        textDecoration: task.completed ? 'line-through' : 'none',
                        transition: 'all 0.2s',
                        cursor: 'text'
                      }}
                      onDoubleClick={() => handleStartEdit(task)}
                    >
                      {task.title}
                    </span>
                  )}
                  {/* 状态徽标 Tag */}
                  {task.completed ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                      已完成
                    </Tag>
                  ) : (
                    <Tag icon={<ClockCircleOutlined />} color="warning">
                      进行中
                    </Tag>
                  )}
                </div>
              </List.Item>
            )}
          />
        )}
      </Card>
    </div>
  )
}
