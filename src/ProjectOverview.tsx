import { useState } from "react";
import "./project-overview.css";

const repository = "https://github.com/Jayden72Huang/flowork-web";
/** Public presentation of product scope. The interactive example uses synthetic data only. */
export default function ProjectOverview() {
  const [stage, setStage] = useState<"source" | "draft" | "receipt">("source");
  return <section id="project" className="wrap block project-overview">
    <span className="sec-tag">FloWork 精力无限 · 智能录音赛道</span>
    <h2>记得当时，<br />也接得住下一步。</h2>
    <p className="project-intro">谈话里的承诺、照片里的经历，常常停在不同的 App。FloWork 用个人上下文找回依据，再把经过你确认的下一步交给设备和服务。</p>
    <div className="project-links"><a href="#trial">申请 iOS 内测</a><a href="/flow-space">探索交互空间</a><a href={repository} target="_blank" rel="noreferrer">网页版源码与接入指南 ↗</a></div>
    <div className="project-scenes">
      <article><span>01 / 找回生活中的一刻</span><h3>“上次在海边散步的那张照片。”</h3><p>把模糊描述转成时间、地点和事情的线索，在获准的 Record 中查找原照。核对候选后，通过 Flo Home 连接家庭照片打印机。</p><small>现场演示目标：ESP32 语音输入、Record 检索与照片打印。云端或家庭 NAS 按实际部署选择。</small></article>
      <article><span>02 / 接住谈话里的承诺</span><h3>标记一下，让 Flo 拟好待办。</h3><p>录音豆留下重要标记，Flo 根据前后文拟好待办，通知你修改、取消或确认。确认后调用获准的设备，并返回执行结果。</p><small>现场演示目标：打印到便携打印机。打印待办与真正发送邮件、创建日程分别授权。</small></article>
    </div>
    <div className="project-example">
      <div><span>可交互流程示例 · 合成数据</span><h3>从一句承诺，到你确认的行动。</h3><p>这里演示产品交互逻辑，不读取私人数据，也不连接实体打印机。</p></div>
      <div className="project-example-state" aria-live="polite">
        {stage === "source" && <><small>录音片段 · 02:18 · 已标记</small><p>“路演结束后，整理演示资料。先给我看一遍，不要直接外发。”</p><button onClick={() => setStage("draft")}>查看 Flo 拟好的待办</button></>}
        {stage === "draft" && <><small>待你确认 · 来源 02:18</small><p>路演结束后整理演示资料，完成后交给本人审核。</p><p className="project-note">本次目标：待办打印示例。没有发件人或收件人授权，不执行外发。</p><button onClick={() => setStage("receipt")}>确认并查看模拟回执</button><button className="secondary" onClick={() => setStage("source")}>取消</button></>}
        {stage === "receipt" && <><small>模拟回执</small><p>待办内容已确认。实际打印需要已配对的设备和设备回执。</p><button onClick={() => setStage("source")}>重新体验</button></>}
      </div>
    </div>
    <div id="full-demo" className="project-recording"><h3>完整功能演示</h3><p>完整实机录屏正在整理。上方流程示例与空间演示用于说明交互，不能替代真实功能录屏。</p><a href="#trial">申请测试，体验可用版本</a></div>
    <div className="project-architecture"><span>实现方式与跨平台迁移</span><h3>资料与授权由 FloWork 管理，设备通过适配器接入。</h3><ol><li><b>采集与 Record</b><p>获准录音、照片和时间地点线索，组织为有来源的记录。</p></li><li><b>Agent 与记忆检索</b><p>从获准资料恢复上下文，模型提出候选与行动草稿。</p></li><li><b>确认与执行网关</b><p>核对目标和参数，由用户确认，执行器调用设备或服务。</p></li><li><b>真实回执</b><p>分别呈现完成、失败与结果待核实，避免重复执行。</p></li></ol><p>SwiftUI 承载 iOS 原生体验，React / TypeScript 承载网页，服务接口与设备适配器隔离平台差异。迁移到其他终端时复用数据协议、授权和任务状态，采集与执行接口仍需逐平台适配。</p><small>现有基础包括原生 App、记录与检索、确认流程及内部 TestFlight 交付记录。完整跨设备执行、NAS 部署与上述打印链路仍以实机验收为准。网页空间是可交互原型。</small></div>
    <div className="project-scenes"><article><span>商业化路径</span><h3>先验证持续使用，再扩大设备组合。</h3><p>免费 App 加执行月会员，具体价格待确认。首批服务频繁记录、亲自负责跟进的创业者和项目负责人，再验证设备接入与软件许可。</p></article><article><span>生态发展方向</span><h3>更多设备，参与同一个人的任务。</h3><p>未来评估 Anker 多品牌设备接入，让外部 Agent 调用用户授权的能力。需要交易的任务再接 Agent Pay 的订单、确认与履约能力。</p><small>逐项验证接口、许可与回执。不代表已经全量兼容、获得官方合作或完成支付接入。</small></article></div>
    <div className="project-release"><h3>测试与开发者入口</h3><p>iOS 采用申请制内测。留下邮箱，经团队审核授权后发送 TestFlight 邀请；安装以当时可用的测试构建为准。</p><p>公开仓库提供网页版代码、README 与原创 SDK 接入方法。iOS、服务端、记忆与执行核心保持私有，厂商 SDK 通过官方授权渠道获取。</p><a href={repository} target="_blank" rel="noreferrer">查看公开代码与 SDK 使用说明 ↗</a></div>
    <p className="project-contact">团队：FloWork 精力无限 · 产品与 AI：Jayden · App 与前端：Lew · 硬件与算法：Carlos<br />公开联系：<a href="mailto:Flowork@inflowx.ai">Flowork@inflowx.ai</a></p>
  </section>;
}
