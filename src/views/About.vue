<template>
    <div class="about-page">
        <Header type="home" />
        <div class="container">
            <!-- 头部介绍卡片 -->
            <div class="card top-card">
                <h2>📖 关于本项目 — SmartBookHub 智能知识库</h2>
                <p class="desc">
                    SmartBookHub 是一套前后端分离的图书知识交流平台，分为<strong>前台用户端</strong>和<strong>后台管理端</strong>，
                    支持文章发布、知识分享、多级评论、AI实时流式对话、会话持久保存、管理员文章审核等全套业务功能。
                </p>
            </div>

            <div class="card">
                <h3>✨ 前台用户端功能</h3>
                <ul>
                    <li>✅ 用户注册、登录、个人资料、头像上传、修改密码</li>
                    <li>✅ 知识广场：公开文章分页浏览、文章详情</li>
                    <li>✅ 富文本编辑器发布文章，支持【草稿 / 待审核 / 已驳回 / 已发布】状态</li>
                    <li>✅ 多级评论、回复评论、删除评论</li>
                    <li>✅ AI智能对话：新建会话、切换会话、历史对话持久化保存</li>
                    <li>✅ AI流式输出：AI边回复、数据边实时存入数据库，中途打断对话，记录永久保留</li>
                    <li>✅ 个人主页、文章管理、收藏列表</li>
                </ul>
            </div>

            <div class="card">
                <h3>🔐 后台管理员端功能</h3>
                <ul>
                    <li>✅ 登录独立后台面板，路由守卫区分前台/后台访问权限</li>
                    <li>✅ 首页数据统计看板、7日文章发布数据可视化（ECharts）</li>
                    <li>✅ 文章审核：审核通过 / 驳回（填写驳回理由）</li>
                    <li>✅ 查看所有用户已发布、待审核、驳回的文章</li>
                    <li>✅ <strong>权限隔离：管理员无法查看普通用户的草稿文章</strong></li>
                </ul>
            </div>

            <div class="card">
                <h3>💻 前端技术栈</h3>
                <div class="code-block">
                    Vue3 + TypeScript + Vite
                    Pinia 全局状态管理
                    Vue‑Router 4（路由守卫、权限区分前台/后台）
                    Element‑Plus UI组件库
                    Axios 请求统一封装、拦截器
                    ECharts 数据可视化统计
                    WangEditor 富文本编辑器
                    Dayjs 时间格式化
                </div>
            </div>

            <div class="card">
                <h3>⚙️ 后端 & 数据库</h3>
                <div class="code-block">
                    Node.js + Express
                    MySQL 关系型数据库
                    Joi 请求参数校验
                    JWT 身份鉴权
                    bcrypt 密码加盐加密
                    Multer 图片文件上传
                    SSE / ReadableStream AI流式响应
                    事务控制、软删除、数据权限隔离
                </div>
            </div>

            <div class="card">
                <h3>📑 接口文档</h3>
                <p>项目所有接口统一使用 <strong>Apifox</strong> 进行接口调试、文档管理与测试。</p>
                <ul>
                    <li>用户模块：注册、登录、退出、个人信息、修改密码、注销账号</li>
                    <li>文章模块：新增、编辑、保存草稿、提交审核、分页、详情、删除</li>
                    <li>评论模块：发布、回复、删除、多级评论</li>
                    <li>AI会话模块：创建会话、删除会话、流式问答、历史消息持久化存储</li>
                    <li>后台管理模块：数据统计、文章审核</li>
                </ul>
                <div class="link-item">
                    <span>🔗 Apifox 接口文档地址：</span>
                    <a href="https://s.apifox.cn/5e438442-aa17-4e5b-9dfc-50190b6d6d70/503973338e0" target="_blank">
                        https://s.apifox.cn/5e438442-aa17-4e5b-9dfc-50190b6d6d70/503973338e0
                    </a>
                </div>
            </div>
            <div class="card">
                <h3>📌 项目核心特点</h3>
                <ul>
                    <li>1、路由守卫区分普通用户与管理员，实现双端权限隔离</li>
                    <li>2、文章权限隔离：普通用户草稿仅本人可见，管理员无权查看他人草稿</li>
                    <li>3、AI流式对话实时落库：AI边输出内容，边保存消息记录；中途关闭、打断对话，历史记录永久保存</li>
                    <li>4、完整文章状态流：草稿 → 提交审核 → 审核通过 / 审核驳回</li>
                    <li>5、前后端分离架构，接口与页面完全解耦</li>
                </ul>
            </div>
            <div class="card author-card">
                <h3>👨‍💻 项目作者</h3>
                <div class="author-info">
                    <div class="row">
                        <label>作者：</label>
                        <span>鱼块</span>
                    </div>
                    <div class="row">
                        <label>联系方式：</label>
                        <span>3181008805@qq.com</span>
                    </div>
                    <div class="row">
                        <label>前端GitHub：</label>
                        <a href="https://github.com/yukuai1111/smartbookhub-front" target="_blank">
                            https://github.com/yukuai1111/smartbookhub-front
                        </a>
                    </div>
                    <div class="row">
                        <label>后端GitHub：</label>
                        <a href="https://github.com/yukuai1111/smartbookhub-server" target="_blank">
                            https://github.com/yukuai1111/smartbookhub-server
                        </a>
                    </div>
                </div>
            </div>

            <div class="card">
                <h3>© 项目说明</h3>
                <p>本项目仅用于设计学习、全栈开发练习使用，非商用项目。</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
.about-page {
    background-color: #f0f4f9;
    min-height: 100vh;
    padding-bottom: 80px;
}

.container {
    max-width: 960px;
    margin: 32px auto 0;
    padding: 0 20px;
}

.card {
    background: #ffffff;
    border-radius: 14px;
    padding: 28px 32px;
    margin-bottom: 24px;
    box-shadow: 0 2px 12px rgba(77, 104, 148, 0.08);
    transition: 0.25s ease;

    &:hover {
        box-shadow: 0 4px 18px rgba(77, 104, 148, 0.12);
    }

    h2 {
        font-size: 24px;
        color: #2c3e50;
        margin-bottom: 14px;
    }

    h3 {
        font-size: 19px;
        color: #34495e;
        margin-bottom: 14px;
        border-left: 4px solid #4d6894;
        padding-left: 10px;
    }

    .desc {
        color: #555555;
        line-height: 1.8;
        font-size: 15px;
    }

    ul {
        padding-left: 24px;
        line-height: 1.85;
        color: #444444;
        font-size: 15px;
    }

    .code-block {
        background-color: #232b38;
        color: #a5f3fc;
        padding: 20px;
        border-radius: 8px;
        white-space: pre-line;
        font-family: "Consolas", monospace;
        line-height: 1.7;
        font-size: 14px;
    }

    .link-item {
        margin-top: 12px;

        a {
            color: #4d6894;
            text-decoration: none;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    .author-card {
        background: linear-gradient(135deg, #e8eff9, #ffffff);
    }

    .author-info {
        .row {
            display: flex;
            padding: 8px 0;

            label {
                width: 120px;
                color: #666;
            }

            a {
                color: #4d6894;
                text-decoration: none;

                &:hover {
                    text-decoration: underline;
                }
            }
        }
    }
}
</style>
