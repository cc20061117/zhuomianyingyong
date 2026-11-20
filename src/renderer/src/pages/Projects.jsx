import { useState } from 'react'
import {
  Card,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Input,
  Tag,
  Space,
  Empty,
  message,
  Popconfirm
} from 'antd'
import {
  PlusOutlined,
  FolderOutlined,
  FolderOpenOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'

const WEIGUANLIAN_MULU = '待关联本地文件夹'

// 项目管理页组件（第六课：补齐项目编辑与删除能力）
export default function Projects({
  projectList = [],
  onAddProject,
  onEditProject,
  onDeleteProject
}) {
  // 控制新建 / 编辑弹窗的显示与隐藏
  const [isModalOpen, setIsModalOpen] = useState(false)

  // 正在编辑的项目；为 null 表示当前是“新建”模式
  const [bianjiXiangmu, setBianjiXiangmu] = useState(null)

  // Ant Design 表单实例（用于手动重置与回填表单字段）
  const [form] = Form.useForm()

  // 点击“新建项目”按钮
  const handleOpenModal = () => {
    setBianjiXiangmu(null)
    form.resetFields()
    setIsModalOpen(true)
  }

  // 点击“编辑”按钮：把该项目信息回填到表单
  const handleBianji = (xiangmu) => {
    console.log('-------', '进入项目编辑模式：', xiangmu)
    setBianjiXiangmu(xiangmu)
    form.setFieldsValue({
      name: xiangmu.name,
      course: xiangmu.course,
      folderPath: xiangmu.folderPath === WEIGUANLIAN_MULU ? '' : xiangmu.folderPath,
      description: xiangmu.description
    })
    setIsModalOpen(true)
  }

  // 取消关闭弹窗
  const handleCloseModal = () => {
    setIsModalOpen(false)
    setBianjiXiangmu(null)
    form.resetFields()
  }

  // 删除项目（二次确认后执行）
  const handleShanchu = (xiangmu) => {
    console.log('-------', '确认删除项目：', xiangmu.id, xiangmu.name)
    if (onDeleteProject) {
      onDeleteProject(xiangmu.id)
    }
    message.success(`项目「${xiangmu.name}」已删除`)
  }

  // 调用 Electron 原生窗口选择本地文件夹
  const handleXuanzeMulu = async () => {
    if (!window.api?.selectFolder) {
      message.warning('当前环境不支持原生文件夹选择')
      return
    }
    try {
      const xuanzhongLujing = await window.api.selectFolder()
      console.log('+++++++', '选择本地项目文件夹返回：', xuanzhongLujing)
      if (xuanzhongLujing) {
        form.setFieldsValue({ folderPath: xuanzhongLujing })
      }
    } catch (err) {
      console.error('选择文件夹失败：', err)
      message.error('选择文件夹失败：' + (err?.message || '未知错误'))
    }
  }

  // 调用 Electron 在 Windows 资源管理器中打开项目目录
  const handleDakaiMulu = async (mubiaoLujing) => {
    console.log('*-*-*-*', '点击打开本地项目目录：', mubiaoLujing)
    if (!window.api?.openFolder) {
      message.warning('当前环境不支持打开本地目录')
      return
    }
    const jieguo = await window.api.openFolder(mubiaoLujing)
    if (!jieguo?.success) {
      message.warning(jieguo?.message || '打开目录失败，请检查文件夹路径是否存在')
    }
  }

  // 弹窗表单校验通过，点击“确定”提交（区分新建与编辑）
  const handleFormFinish = (values) => {
    console.log('-------', '项目表单提交数据：', values, '，编辑模式：', Boolean(bianjiXiangmu))

    const muluLujing = values.folderPath ? values.folderPath.trim() : ''

    // 组装项目基础信息
    const xiangmuXinxi = {
      name: values.name.trim(),
      course: values.course.trim(),
      description: values.description?.trim() || '暂无简介描述',
      folderPath: muluLujing || WEIGUANLIAN_MULU
    }

    if (bianjiXiangmu) {
      // 编辑模式：更新原有项目，保留任务列表与创建时间
      if (onEditProject) {
        onEditProject(bianjiXiangmu.id, xiangmuXinxi)
      }
      message.success('项目信息已更新')
    } else {
      // 新建模式：生成新项目对象
      const newProject = {
        id: `p_${Date.now()}`,
        ...xiangmuXinxi,
        createdAt: new Date().toISOString().split('T')[0],
        tasks: []
      }
      if (onAddProject) {
        onAddProject(newProject)
      }
      message.success('项目创建成功')
    }

    // 关闭弹窗并清空输入框
    handleCloseModal()
  }

  return (
    <div className="xiangmuguanli">
      {/* 1. 顶部操作栏 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>我的教学项目</h2>
          <span style={{ color: '#8c8c8c', fontSize: '13px' }}>
            共管理 {projectList.length} 个进行中的实训项目
          </span>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenModal}>
          新建项目
        </Button>
      </div>

      {/* 2. 项目卡片网格列表（无数据时展示友好空状态引导） */}
      {projectList.length === 0 ? (
        <Empty
          style={{ marginTop: 60 }}
          description="暂无教学实训项目，点击右上角「新建项目」创建第一个项目！"
        />
      ) : (
        <Row gutter={[16, 16]}>
          {projectList.map((item) => (
            <Col xs={24} sm={12} lg={8} key={item.id}>
              <Card
                hoverable
                title={
                  <span
                    title={item.name}
                    style={{
                      fontWeight: 'bold',
                      display: 'block',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {item.name}
                  </span>
                }
                extra={<Tag color="blue">{item.course}</Tag>}
                style={{ height: '100%' }}
              >
                {/* 项目简介 */}
                <p
                  style={{
                    color: '#595959',
                    minHeight: '42px',
                    lineHeight: '21px',
                    margin: '0 0 12px 0'
                  }}
                >
                  {item.description}
                </p>

                {/* 本地目录展示 */}
                <div
                  className="xiangmumuluqu"
                  style={{
                    fontSize: '12px',
                    color: '#8c8c8c',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginBottom: '8px'
                  }}
                >
                  <FolderOutlined style={{ flexShrink: 0 }} />
                  <span
                    title={item.folderPath}
                    style={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {item.folderPath}
                  </span>
                </div>

                {/* 卡片底部操作区：打开目录 / 编辑 / 删除 */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    alignItems: 'center',
                    gap: '2px',
                    borderTop: '1px dashed #f0f0f0',
                    paddingTop: '8px'
                  }}
                >
                  <Button
                    type="text"
                    size="small"
                    icon={<FolderOpenOutlined />}
                    onClick={() => handleDakaiMulu(item.folderPath)}
                  >
                    打开目录
                  </Button>
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={() => handleBianji(item)}
                  >
                    编辑
                  </Button>
                  <Popconfirm
                    title="确认删除该项目？"
                    description={`「${item.name}」及其下的 ${(item.tasks || []).length} 项任务将被永久删除，无法恢复。`}
                    okText="确认删除"
                    okButtonProps={{ danger: true }}
                    cancelText="取消"
                    onConfirm={() => handleShanchu(item)}
                  >
                    <Button type="text" size="small" danger icon={<DeleteOutlined />}>
                      删除
                    </Button>
                  </Popconfirm>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* 3. 新建 / 编辑项目 Modal 对话框 */}
      <Modal
        title={bianjiXiangmu ? '编辑教学实训项目' : '新建教学实训项目'}
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        okText={bianjiXiangmu ? '保存修改' : '创建'}
        cancelText="取消"
      >
        <Form form={form} layout="vertical" onFinish={handleFormFinish}>
          <Form.Item
            label="项目名称"
            name="name"
            rules={[{ required: true, message: '请输入项目名称！' }]}
          >
            <Input placeholder="例如：金融数据上链存证系统" />
          </Form.Item>

          <Form.Item
            label="所属课程"
            name="course"
            rules={[{ required: true, message: '请输入所属课程名称！' }]}
          >
            <Input placeholder="例如：区块链技术原理及应用" />
          </Form.Item>

          <Form.Item label="本地项目目录">
            <Space.Compact style={{ width: '100%' }}>
              <Form.Item name="folderPath" noStyle>
                <Input placeholder="请点击右侧按钮选择项目文件夹（选填）" />
              </Form.Item>
              <Button icon={<FolderOpenOutlined />} onClick={handleXuanzeMulu}>
                选择文件夹
              </Button>
            </Space.Compact>
          </Form.Item>

          <Form.Item label="项目简介" name="description">
            <Input.TextArea
              rows={3}
              placeholder="简要描述项目的核心目标、技术栈或成果要求（选填）"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
