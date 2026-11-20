import { Card, Row, Col, Tag, Progress, Empty, Button } from 'antd'
import {
  ProjectOutlined,
  CheckSquareOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ArrowRightOutlined,
  CalendarOutlined,
  FundOutlined,
  RocketOutlined
} from '@ant-design/icons'

export default function Dashboard({ projectList = [], onMenuChange }) {
  // 汇总所有项目的任务，计算全局统计
  const allTasks = projectList.flatMap((item) => item.tasks || [])
  const totalTasks = allTasks.length
  const completedTasks = allTasks.filter((task) => task.completed).length
  const pendingTasks = totalTasks - completedTasks
  const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // 根据当前时间生成问候语
  const hour = new Date().getHours()
  const greeting = hour < 6 ? '凌晨好' : hour < 12 ? '上午好' : hour < 18 ? '下午好' : '晚上好'
  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })

  // 跳转到侧边栏对应页面
  const goToPage = (key) => {
    if (onMenuChange) {
      onMenuChange(key)
    }
  }

  // 顶部统计卡片配置
  const statCards = [
    {
      key: 'projects',
      title: '我的项目',
      value: projectList.length,
      icon: <ProjectOutlined />,
      color: 'blue'
    },
    {
      key: 'total',
      title: '总任务数',
      value: totalTasks,
      icon: <CheckSquareOutlined />,
      color: 'purple'
    },
    {
      key: 'done',
      title: '已完成任务',
      value: completedTasks,
      icon: <CheckCircleOutlined />,
      color: 'green'
    },
    {
      key: 'pending',
      title: '待推进任务',
      value: pendingTasks,
      icon: <ClockCircleOutlined />,
      color: 'orange'
    }
  ]

  return (
    <div className="gongzuotaishouye">
      {/* 1. 渐变欢迎横幅 + 环形整体完成率 */}
      <div className="shouye-banner">
        <div className="shouye-banner-left">
          <div className="shouye-greeting">{greeting}，同学</div>
          <div className="shouye-subtitle">
            欢迎回到 USY 项目制教学工作台，继续推进你的实训项目吧
          </div>
          <div className="shouye-date">
            <CalendarOutlined />
            <span>{today}</span>
          </div>
        </div>
        <div className="shouye-banner-right">
          <Progress
            type="dashboard"
            percent={percent}
            size={118}
            strokeWidth={8}
            strokeColor="#ffffff"
            trailColor="rgba(255, 255, 255, 0.28)"
            format={(value) => (
              <div className="shouye-ring">
                <span className="shouye-ring-value">{value}%</span>
                <span className="shouye-ring-label">整体完成率</span>
              </div>
            )}
          />
        </div>
      </div>

      {/* 2. 数据概览统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        {statCards.map((item) => (
          <Col xs={24} sm={12} lg={6} key={item.key}>
            <Card className="shouye-stat-card">
              <div className="shouye-stat">
                <div className={`shouye-stat-icon ${item.color}`}>{item.icon}</div>
                <div className="shouye-stat-info">
                  <div className="shouye-stat-value">{item.value}</div>
                  <div className="shouye-stat-title">{item.title}</div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 3. 任务完成情况 + 各项目进度概览 */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} lg={10}>
          <Card
            className="shouye-panel"
            style={{ height: '100%' }}
            title={
              <span className="shouye-card-title">
                <FundOutlined />
                任务完成情况
              </span>
            }
          >
            <div className="shouye-progress-wrap">
              <Progress
                type="circle"
                percent={percent}
                size={148}
                strokeWidth={10}
                strokeColor={{ '0%': '#3b5bdb', '100%': '#9254de' }}
                trailColor="#f0f0f5"
              />
              <div className="shouye-progress-legend">
                <div className="legend-row">
                  <span className="legend-dot green" />
                  <span>
                    已完成 <b>{completedTasks}</b> 项
                  </span>
                </div>
                <div className="legend-row">
                  <span className="legend-dot orange" />
                  <span>
                    待推进 <b>{pendingTasks}</b> 项
                  </span>
                </div>
                <div className="legend-row">
                  <span className="legend-dot gray" />
                  <span>
                    合计 <b>{totalTasks}</b> 项
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={14}>
          <Card
            className="shouye-panel"
            style={{ height: '100%' }}
            title={
              <span className="shouye-card-title">
                <ProjectOutlined />
                各项目进度概览
              </span>
            }
            extra={
              <Button type="link" size="small" onClick={() => goToPage('projects')}>
                查看全部 <ArrowRightOutlined />
              </Button>
            }
          >
            {projectList.length === 0 ? (
              <Empty description="还没有项目，先去创建一个吧！" />
            ) : (
              <div className="shouye-project-list">
                {projectList.map((item) => {
                  const tasks = item.tasks || []
                  const done = tasks.filter((task) => task.completed).length
                  const projectPercent =
                    tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0
                  return (
                    <div className="shouye-project-item" key={item.id}>
                      <div className="shouye-project-head">
                        <span className="shouye-project-name">{item.name}</span>
                        <Tag color="blue">{item.course}</Tag>
                      </div>
                      <div className="shouye-project-bar">
                        <Progress
                          percent={projectPercent}
                          size="small"
                          showInfo={false}
                          strokeColor={{ '0%': '#3b5bdb', '100%': '#9254de' }}
                          trailColor="#f0f0f5"
                        />
                        <span className="shouye-project-count">
                          {done}/{tasks.length} 项
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* 4. 快捷操作入口 */}
      <div className="shouye-quick">
        <div className="shouye-quick-card" onClick={() => goToPage('projects')}>
          <div className="shouye-quick-icon blue">
            <ProjectOutlined />
          </div>
          <div>
            <div className="shouye-quick-title">项目管理</div>
            <div className="shouye-quick-desc">创建、查看与管理你的实训项目</div>
          </div>
          <ArrowRightOutlined className="shouye-quick-arrow" />
        </div>
        <div className="shouye-quick-card" onClick={() => goToPage('tasks')}>
          <div className="shouye-quick-icon purple">
            <RocketOutlined />
          </div>
          <div>
            <div className="shouye-quick-title">任务管理</div>
            <div className="shouye-quick-desc">拆解阶段目标，跟踪任务完成进度</div>
          </div>
          <ArrowRightOutlined className="shouye-quick-arrow" />
        </div>
      </div>
    </div>
  )
}
