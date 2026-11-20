import { Card, Row, Col, Progress, Tag, Empty } from 'antd'
import {
  ProjectOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
  PlusOutlined,
  RightOutlined,
  CalendarOutlined,
  BulbOutlined
} from '@ant-design/icons'
import './Dashboard.css'

// 第四节课：工作台首页（实训进度概览与数据看板）
export default function Dashboard({ projectList = [], onMenuChange }) {
  // 1. 直观按步骤统计项目与任务数据（避免复杂链式，清晰展示处理逻辑）
  const xiangmuZongshu = projectList.length
  let renwuZongshu = 0
  let yiwanchengRenwushu = 0
  for (let i = 0; i < projectList.length; i++) {
    const xiangmuItem = projectList[i]
    const renwuLiebiao = xiangmuItem.tasks || []
    renwuZongshu += renwuLiebiao.length

    for (let j = 0; j < renwuLiebiao.length; j++) {
      if (renwuLiebiao[j].completed) {
        yiwanchengRenwushu += 1
      }
    }
  }

  // 计算整体平均完成率
  let pingjunJindu = 0
  if (renwuZongshu > 0) {
    pingjunJindu = Math.round((yiwanchengRenwushu / renwuZongshu) * 100)
  }

  // 待推进的任务数
  const daituijinRenwushu = renwuZongshu - yiwanchengRenwushu

  // 2. 问候语与当前日期
  const xianzai = new Date()
  const xiaoshi = xianzai.getHours()
  let wenhou = '早上好'
  if (xiaoshi >= 12 && xiaoshi < 18) {
    wenhou = '下午好'
  } else if (xiaoshi >= 18) {
    wenhou = '晚上好'
  }
  const riqiWenzi = `${xianzai.getFullYear()} 年 ${xianzai.getMonth() + 1} 月 ${xianzai.getDate()} 日`

  // 3. 顶部四张统计卡片配置
  const tongjiKaPian = [
    {
      key: 'xiangmu',
      biaoti: '实训项目总数',
      shuzhi: xiangmuZongshu,
      danwei: '个',
      yanse: 'blue',
      tubiao: <ProjectOutlined />
    },
    {
      key: 'renwu',
      biaoti: '实训任务总数',
      shuzhi: renwuZongshu,
      danwei: '项',
      yanse: 'purple',
      tubiao: <ThunderboltOutlined />
    },
    {
      key: 'wancheng',
      biaoti: '已完成任务',
      shuzhi: yiwanchengRenwushu,
      danwei: '项',
      yanse: 'green',
      tubiao: <CheckCircleOutlined />
    },
    {
      key: 'jindu',
      biaoti: '整体实训完成率',
      shuzhi: pingjunJindu,
      danwei: '%',
      yanse: 'orange',
      tubiao: <ClockCircleOutlined />
    }
  ]

  // 4. 快捷跳转处理函数
  const handleTiaozhuan = (caidanKey) => {
    console.log('*-*-*-*', '工作台快捷跳转目标页面：', caidanKey)
    if (onMenuChange) {
      onMenuChange(caidanKey)
    }
  }

  console.log(
    '=======',
    '工作台首页加载统计数据，项目总数：',
    xiangmuZongshu,
    '，任务总数：',
    renwuZongshu,
    '，平均进度：',
    `${pingjunJindu}%`
  )

  return (
    <div className="gongzuotaishouye">
      {/* 1. 渐变欢迎横幅：问候语 + 日期 + 整体完成率环 */}
      <div className="shouye-banner">
        <div className="shouye-banner-left">
          <div className="shouye-greeting">{wenhou}，欢迎回到实训工作台</div>
          <div className="shouye-subtitle">项目全景、任务进度与快捷入口，一屏掌握今天的推进节奏</div>
          <div className="shouye-date">
            <CalendarOutlined />
            <span>{riqiWenzi}</span>
          </div>
        </div>

        <div className="shouye-banner-right">
          <div className="shouye-ring">
            <Progress
              type="circle"
              percent={pingjunJindu}
              size={96}
              strokeWidth={10}
              strokeColor="#ffffff"
              trailColor="rgba(255, 255, 255, 0.28)"
              format={(baifenbi) => (
                <span style={{ color: '#ffffff', fontSize: 22, fontWeight: 700 }}>
                  {baifenbi}%
                </span>
              )}
            />
            <div className="shouye-ring-label">整体完成率</div>
          </div>
        </div>
      </div>

      {/* 2. 四大核心数据统计指标卡片 */}
      <Row gutter={[16, 16]}>
        {tongjiKaPian.map((kaPian) => (
          <Col xs={24} sm={12} lg={6} key={kaPian.key}>
            <Card className="shouye-stat-card">
              <div className="shouye-stat">
                <div className={`shouye-stat-icon ${kaPian.yanse}`}>{kaPian.tubiao}</div>
                <div>
                  <div className="shouye-stat-value">
                    {kaPian.shuzhi}
                    <span className="shouye-stat-unit">{kaPian.danwei}</span>
                  </div>
                  <div className="shouye-stat-title">{kaPian.biaoti}</div>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 3. 主体内容：左侧项目推进看板 + 右侧完成概况与小贴士 */}
      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card
            title={
              <span className="shouye-card-title">
                <ProjectOutlined style={{ color: '#3b5bdb' }} />
                实训项目推进进度
              </span>
            }
            extra={
              <span className="shouye-card-extra">
                待推进：<b className="shouye-extra-num">{daituijinRenwushu}</b> 项
              </span>
            }
            style={{ height: '100%' }}
          >
            {projectList.length === 0 ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="暂无进行中的实训项目，请先创建项目！"
              />
            ) : (
              <div className="shouye-project-list">
                {projectList.map((xiangmuItem) => {
                  const renwuList = xiangmuItem.tasks || []
                  const zongshu = renwuList.length
                  let wanchengCount = 0

                  for (let k = 0; k < renwuList.length; k++) {
                    if (renwuList[k].completed) {
                      wanchengCount += 1
                    }
                  }
                  const jinduBaifenbi =
                    zongshu === 0 ? 0 : Math.round((wanchengCount / zongshu) * 100)

                  return (
                    <div key={xiangmuItem.id} className="shouye-project-item">
                      <div className="shouye-project-head">
                        <span className="shouye-project-name">{xiangmuItem.name}</span>
                        <Tag color="blue">{xiangmuItem.course}</Tag>
                        {jinduBaifenbi === 100 && <Tag color="success">已完结</Tag>}
                      </div>
                      <div className="shouye-project-bar">
                        <Progress
                          percent={jinduBaifenbi}
                          showInfo={false}
                          status={jinduBaifenbi === 100 ? 'success' : 'active'}
                          strokeColor={{ '0%': '#3b5bdb', '100%': '#52c41a' }}
                        />
                        <span className="shouye-project-count">
                          {wanchengCount} / {zongshu} 项
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <div className="shouye-side">
            <Card
              title={
                <span className="shouye-card-title">
                  <ThunderboltOutlined style={{ color: '#7048e8' }} />
                  任务完成概况
                </span>
              }
            >
              <div className="shouye-progress-wrap">
                <Progress
                  type="dashboard"
                  percent={pingjunJindu}
                  size={148}
                  strokeWidth={10}
                  strokeColor={{ '0%': '#3b5bdb', '100%': '#52c41a' }}
                />
                <div className="shouye-progress-legend">
                  <div className="legend-row">
                    <span className="legend-dot green" />
                    已完成 <b>{yiwanchengRenwushu}</b> 项
                  </div>
                  <div className="legend-row">
                    <span className="legend-dot orange" />
                    待推进 <b>{daituijinRenwushu}</b> 项
                  </div>
                  <div className="legend-row">
                    <span className="legend-dot gray" />
                    任务总数 <b>{renwuZongshu}</b> 项
                  </div>
                </div>
              </div>
            </Card>

            <div className="shouye-tip">
              <div className="shouye-tip-title">
                <BulbOutlined />
                项目制实训小贴士
              </div>
              <p className="shouye-tip-text">
                工作台数据与「项目管理」「任务管理」实时联动。在任务管理中每勾选完成一项任务，此处的完成率与项目进度会立即同步刷新。
              </p>
            </div>
          </div>
        </Col>
      </Row>

      {/* 4. 快捷工作通道 */}
      <div className="shouye-quick">
        <div
          className="shouye-quick-card"
          role="button"
          onClick={() => handleTiaozhuan('projects')}
        >
          <div className="shouye-quick-icon blue">
            <PlusOutlined />
          </div>
          <div>
            <div className="shouye-quick-title">创建新实训项目</div>
            <div className="shouye-quick-desc">关联本地目录，登记课程与项目简介</div>
          </div>
          <RightOutlined className="shouye-quick-arrow" />
        </div>

        <div className="shouye-quick-card" role="button" onClick={() => handleTiaozhuan('tasks')}>
          <div className="shouye-quick-icon purple">
            <CheckCircleOutlined />
          </div>
          <div>
            <div className="shouye-quick-title">进入任务清单管理</div>
            <div className="shouye-quick-desc">拆解阶段目标，实时跟踪完成情况</div>
          </div>
          <RightOutlined className="shouye-quick-arrow" />
        </div>
      </div>
    </div>
  )
}
