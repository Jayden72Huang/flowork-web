import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import './flow-space.css';

const phases = [
  { time: '08:00', name: '早晨', title: '新的一天，已有安排。', request: 'Flo，告诉我今天的安排。', context: '昨晚的计划 · 今日 3 项日程', result: '晨间简报已生成 · 正在同步相框', color: '#7bdfff' },
  { time: '11:20', name: '白天', title: '每个瞬间，都成为上下文。', request: '记录刚才的讨论，保留关键事项。', context: '录音豆 · 语音素材 / App · 地点与照片', result: '讨论已整理 · 3 条行动事项待确认', color: '#70f6d0' },
  { time: '15:30', name: '下午', title: '让想法，抵达真实世界。', request: '把路演准备清单打印出来。', context: '检索今日讨论 · 关联明日路演', result: '演示打印回执已返回 · 清单已归档', color: '#ffbd7b' },
  { time: '22:30', name: '睡前', title: '今天有回响，明天有方向。', request: '总结今天，帮我安排明天。', context: '今日记录 · 已完成任务 · 未完成事项', result: '晚间总结已生成 · 明日计划待确认', color: '#b7a0ff' },
];
const devices = [
  { id: 'pod', name: '录音豆', en: 'FLO POD', desc: '随身语音采集', input: '音频 · 录音时间 · 设备来源', output: '采集状态 · 同步结果', pos: [-6, 1.3, 0.5], color: '#6cebd5' },
  { id: 'bar', name: 'Flow Bar', en: 'VOICE TERMINAL', desc: '可分离的随身终端', input: '语音请求 · 触摸操作', output: '语音回应 · 屏幕反馈 · 任务确认', pos: [-6, 1.3, 3.3], color: '#6cebd5' },
  { id: 'app', name: 'Flow App', en: 'MOBILE CONTEXT', desc: '你的多模态入口', input: '语音 · 照片 · GPS（授权后）', output: '上下文检索 · 规划建议 · 执行反馈', pos: [-6, 1.3, 6.1], color: '#6cebd5' },
  { id: 'data', name: '数据层', en: 'CONTEXT STORE', desc: '原始素材与派生证据', input: '音频 · 图片 · 位置 · 来源', output: '可追溯的上下文', pos: [-1.5, 1.5, 1.5], color: '#65d6ff' },
  { id: 'memory', name: '记忆层', en: 'PERSONAL MEMORY', desc: '从记录中找到关联', input: '有来源的事实与记忆候选', output: '相关记忆 · 引用依据', pos: [-1.5, 1.5, 5.3], color: '#b69cff' },
  { id: 'agent', name: 'Flow Agent', en: 'AWS · AGENT CORE', desc: '理解 · 规划 · 执行', input: '用户请求 · 获准上下文', output: '行动计划 · 工具调用 · 执行回执', pos: [3.5, 2.2, 2.4], color: '#c0b0ff' },
  { id: 'home', name: 'Flow Home', en: 'HOME CONNECTOR', desc: '本次由电脑运行网关服务', input: '已确认的设备任务', output: '设备调用 · 状态回传', pos: [4, 0.9, 6.7], color: '#ffd09a' },
  { id: 'printer', name: '便携打印机', en: 'BLUETOOTH PRINT', desc: '演示设备 · 接口待接入', input: '清单 · 文本', output: '打印任务接收回执', pos: [0.5, 0.6, 10], color: '#ffd09a' },
  { id: 'frame', name: '水墨屏相框', en: 'E-INK DISPLAY', desc: '演示设备 · 接口待接入', input: '晨间简报 · 今日计划', output: '屏幕更新状态', pos: [4, 0.6, 10], color: '#ffd09a' },
  { id: 'wear', name: '穿戴设备', en: 'WEARABLE', desc: '直连路径 · 能力预览', input: '依设备授权与实际接口', output: '提醒 · 状态反馈（规划）', pos: [7.5, 0.6, 10], color: '#ffd09a' },
];
const edges = [[0,3],[1,3],[2,3],[3,4],[3,5],[4,5],[5,6],[6,7],[6,8],[5,9]];

export default function FlowSpace() {
  const mount = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLButtonElement | null)[]>([]);
  const state = useRef({ selected: '', phase: 2, playing: true, step: 0, detached: false });
  const [selected, setSelected] = useState('');
  const [phase, setPhase] = useState(2);
  const [playing, setPlaying] = useState(true);
  const [step, setStep] = useState(0);
  const [detached, setDetached] = useState(false);
  const [appTab, setAppTab] = useState('手机');
  state.current = { selected, phase, playing, step, detached };
  const p = phases[phase];
  const current = devices.find(d => d.id === selected);
  const capability = selected === 'app' && appTab !== '手机' ? devices[appTab === '录音豆' ? 0 : 1] : current;
  useEffect(() => { if (!playing) return; const timer = window.setInterval(() => setStep(s => (s + 1) % 6), 2400); return () => clearInterval(timer); }, [playing]);
  useEffect(() => {
    const host = mount.current!;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2('#050a16', 0.018);
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 150);
    const overview = new THREE.Vector3(2, 14, 22);
    camera.position.copy(overview);
    const target = new THREE.Vector3(0, 0, 4.5);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.7));
    renderer.setClearColor('#050a16', 0);
    host.appendChild(renderer.domElement);
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.addPass(new UnrealBloomPass(new THREE.Vector2(1,1), 0.45, 0.45, 0.8));
    scene.add(new THREE.AmbientLight('#9dbdff', 2));
    const key = new THREE.DirectionalLight('#d8edff', 5); key.position.set(2,12,9); scene.add(key);
    const rim = new THREE.PointLight('#7d6eff', 90, 28); rim.position.set(1,5,2); scene.add(rim);
    const grid = new THREE.GridHelper(70, 70, '#26476a', '#13283d'); grid.position.y=-0.3; scene.add(grid);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(160,160),new THREE.MeshStandardMaterial({color:'#060e1c',metalness:0.65,roughness:0.45,transparent:true,opacity:0.75})); floor.rotation.x=-Math.PI/2; floor.position.y=-0.32; scene.add(floor);
    const material = (color: string, glow = false) => new THREE.MeshStandardMaterial({ color, metalness:0.65, roughness:0.3, emissive:glow?color:'#000000', emissiveIntensity:glow?1.8:0 });
    function box(g:THREE.Group,w:number,h:number,d:number,c:string,x=0,y=0,z=0,glow=false) { const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),material(c,glow));m.position.set(x,y,z);g.add(m);return m; }
    function cylinder(g:THREE.Group,r:number,h:number,c:string,x=0,y=0,z=0) {const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,h,64),material(c));m.position.set(x,y,z);g.add(m);return m;}
    function ring(g:THREE.Group,r:number,c:string,y=0) {const m=new THREE.Mesh(new THREE.TorusGeometry(r,0.018,8,100),material(c,true));m.rotation.x=Math.PI/2;m.position.y=y;g.add(m);return m;}
    const groups:THREE.Group[]=[];
    const rotators:THREE.Object3D[]=[];
    const pods:THREE.Object3D[]=[];
    devices.forEach((d,i)=>{
      const g=new THREE.Group();g.position.set(...d.pos as [number,number,number]);scene.add(g);groups.push(g);
      cylinder(g, i===5?1.5:1.05,0.12,'#122238',0,-d.pos[1]+0.1);ring(g,i===5?1.52:1.08,d.color,-d.pos[1]+0.18);
      if(i===0){const m=cylinder(g,.58,.26,'#b5c8cd',0,0,0);m.rotation.x=Math.PI/2;ring(g,.43,d.color).rotation.x=0;box(g,.16,.035,.06,d.color,0,0,.15,true);}
      if(i===1||i===2){box(g,i===1?.85:.8,i===1?1.55:1.65,.18,'#738998');box(g,i===1?.7:.67,i===1?.9:1.4,.03,'#09172b',0,-.08,.11);for(let j=0;j<5;j++)box(g,.07,.12+j%3*.09,.02,d.color,(j-2)*.12,-.05,.14,true);if(i===1){const pod=cylinder(g,.23,.14,'#b5c8cd',0,.58,.2);pod.rotation.x=Math.PI/2;pods.push(pod);}else{box(g,.18,.025,.02,'#bbcbdc',0,.72,.14);}}
      if(i===3){for(let j=0;j<5;j++){box(g,1.25,.22,.95,'#1a3b50',0,j*.31-.5);box(g,.9,.016,.02,d.color,0,j*.31-.43,.49,true);box(g,.06,.045,.02,'#e0fbff',.48,j*.31-.5,.49,true);}}
      if(i===4){const core=new THREE.Mesh(new THREE.IcosahedronGeometry(.55,1),new THREE.MeshStandardMaterial({color:d.color,wireframe:true,emissive:d.color,emissiveIntensity:1.3}));g.add(core);rotators.push(core);for(let j=0;j<3;j++){const r=ring(g,.8+j*.18,d.color);r.rotation.set(.4+j*.6,.3,j*.5);rotators.push(r);}}
      if(i===5){const shell=new THREE.Mesh(new THREE.IcosahedronGeometry(.95,1),new THREE.MeshStandardMaterial({color:'#a998ff',emissive:'#8070ff',emissiveIntensity:.6,metalness:.9,roughness:.13,transparent:true,opacity:.65}));g.add(shell);rotators.push(shell);const wire=new THREE.Mesh(new THREE.IcosahedronGeometry(1.08,1),new THREE.MeshBasicMaterial({color:'#d4bfff',wireframe:true,transparent:true,opacity:.6}));g.add(wire);rotators.push(wire);for(let j=0;j<3;j++){const r=ring(g,1.35+j*.13,d.color);r.rotation.set(.6+j*.7,.3,j*.7);rotators.push(r);}}
      if(i===6){cylinder(g,.65,.72,'#7c8c9e');cylinder(g,.52,.04,'#142136',0,.38);ring(g,.57,d.color,.4);for(let j=0;j<7;j++)box(g,.025,.11+Math.sin(j)*.05,.025,d.color,(j-3)*.08,.42,.05,true);}
      if(i===7){box(g,1.05,.48,.8,'#b0bdc9');box(g,.75,.025,.5,'#ebf4f4',0,.28,.25);for(let j=0;j<4;j++)box(g,.5,.008,.015,'#314756',0,.299,.17+j*.08);box(g,.8,.045,.03,'#061c2b',0,.1,.42);}
      if(i===8){box(g,1.25,.95,.12,'#aeb6c1');box(g,1.08,.78,.02,'#dfebe5',0,0,.08);for(let j=0;j<4;j++)box(g,.67-j*.08,.028,.01,'#4e6461',-.08,.22-j*.14,.1);}
      if(i===9){box(g,.43,1.3,.15,'#253e4f');const m=cylinder(g,.39,.16,'#a8bcc8',0,0,.1);m.rotation.x=Math.PI/2;const f=cylinder(g,.31,.025,'#0d243a',0,0,.2);f.rotation.x=Math.PI/2;}
    });
    const flows=edges.map(([a,b],i)=>{
      const start=groups[a].position.clone(),end=groups[b].position.clone();const mid=start.clone().lerp(end,.5);mid.y+=1.1;
      const curve=new THREE.QuadraticBezierCurve3(start,mid,end);
      const color=new THREE.Color(i<3?'#55e7db':i<6?'#ab94ff':'#ffc78b');
      const tube=new THREE.Mesh(new THREE.TubeGeometry(curve,64,.025,6,false),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.23}));scene.add(tube);
      const dots=Array.from({length:7},()=>{const dot=new THREE.Mesh(new THREE.SphereGeometry(.06,8,8),new THREE.MeshBasicMaterial({color:color.clone().multiplyScalar(2.5)}));scene.add(dot);return dot;});
      return {curve,dots,tube};
    });
    const starGeo=new THREE.BufferGeometry();const points=new Float32Array(750);for(let i=0;i<750;i++)points[i]=(Math.sin(i*127.1)*.5+.5)*(i%3===1?22:65)-(i%3===1?1:32);starGeo.setAttribute('position',new THREE.BufferAttribute(points,3));scene.add(new THREE.Points(starGeo,new THREE.PointsMaterial({color:'#7ebbd9',size:.028,transparent:true,opacity:.45})));
    let width=1,height=1,raf=0;const resize=()=>{width=host.clientWidth;height=host.clientHeight;renderer.setSize(width,height);composer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();};const observer=new ResizeObserver(resize);observer.observe(host);resize();
    let time=0,last=performance.now();const look=new THREE.Vector3(0,0,5.2);const projected=new THREE.Vector3();const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
    function animate(now:number){raf=requestAnimationFrame(animate);const dt=Math.min((now-last)/1000,.05);last=now;if(document.hidden)return;if(state.current.playing&&!reduced)time+=dt;
      const index=devices.findIndex(d=>d.id===state.current.selected);const focused=index>=0;
      const destination=focused?groups[index].position.clone().add(new THREE.Vector3(6,5,9)):overview;
      camera.position.lerp(destination,.035);target.copy(focused?groups[index].position:look);camera.lookAt(target);
      rotators.forEach((o,i)=>{if(!reduced){o.rotation.y+=dt*(.12+i*.018);o.rotation.z+=dt*.035;}});
      groups.forEach((g,i)=>{g.position.y=devices[i].pos[1]+(reduced?0:Math.sin(time*1.1+i)*.08);});
      pods.forEach(o=>{o.position.x=THREE.MathUtils.lerp(o.position.x,state.current.detached?-.8:0,.08);o.position.y=THREE.MathUtils.lerp(o.position.y,state.current.detached?1.1:.58,.08);});
      flows.forEach((f,i)=>{const active=state.current.step===0?i<3:state.current.step===1?i===3:state.current.step===2?i===4||i===5:state.current.step===3?i===6:state.current.step===4?i>=7:i===6;f.tube.material.opacity=active?.65:.13;f.dots.forEach((dot,j)=>{dot.visible=active;dot.position.copy(f.curve.getPoint(((state.current.step===5?-time:time)*.32+j/7+1000)%1));dot.scale.setScalar(j===0?1.8:1);});});
      groups.forEach((g,i)=>{const el=labels.current[i];if(!el)return;projected.copy(g.position).add(new THREE.Vector3(0,-1.0,0)).project(camera);el.style.left=`${(projected.x*.5+.5)*width}px`;el.style.top=`${(-projected.y*.5+.5)*height}px`;el.style.opacity=focused?(i===index?'1':'.12'):'1';el.style.pointerEvents=focused&&i!==index?'none':'auto';});
      rim.color.set(phases[state.current.phase].color);composer.render();
    }raf=requestAnimationFrame(animate);
    return()=>{cancelAnimationFrame(raf);observer.disconnect();scene.traverse(o=>{if(o instanceof THREE.Mesh||o instanceof THREE.Points||o instanceof THREE.LineSegments){o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose());}});composer.dispose();renderer.dispose();host.removeChild(renderer.domElement);};
  },[]);
  const steps=['接收输入','整理证据','检索上下文','规划与下发','设备执行','回执归档'];
  return <main className={`flow-space phase-${phase}`} style={{'--phase':p.color} as React.CSSProperties}>
    <header className="fs-header"><a className="fs-brand" href="/flow-space"><span className="fs-logo">f</span>flow<span className="fs-brand-divider"/>CONNECTED INTELLIGENCE</a><div className="fs-demo"><i/>演示模式 · 模拟事件</div><button className="fs-clock" onClick={()=>{setPhase((phase+1)%4);setStep(0);}} aria-label="切换一天的时段"><span className="fs-dial"><b style={{transform:`rotate(${phase*85+45}deg)`}}/></span><span><strong>{p.time}</strong><small>{p.name} / 点击切换时段</small></span></button></header>
    <section className="fs-heading"><div className="fs-eyebrow">FLOW ECOSYSTEM / INTERACTIVE EXPERIENCE</div><h1>一个 Flow，<span>连接你的世界。</span></h1><p>{p.title}</p></section>
    <div className="fs-scene" ref={mount} aria-label="Flow 设备与数据传输三维演示"/>
    <div className="fs-labels">{devices.map((d,i)=><button key={d.id} ref={el=>{labels.current[i]=el;}} className={`fs-node ${selected===d.id?'selected':''}`} onClick={()=>setSelected(d.id)} style={{'--node-color':d.color} as React.CSSProperties}><span>{d.name}</span><small>{d.en}</small></button>)}</div>
    <div className="fs-sector fs-sector-left">01 / 随身与穿戴<span>CAPTURE YOUR WORLD</span></div><div className="fs-sector fs-sector-center">02 / 个人上下文<span>DATA → MEMORY</span></div><div className="fs-sector fs-sector-right">03 / 理解与执行<span>CONTEXT → ACTION</span></div>
    <aside className="fs-story"><div className="fs-eyebrow"><i/> SCENARIO {String(phase+1).padStart(2,'0')}</div><h2>{p.request}</h2><div className="fs-story-source">上下文依据<span>{p.context}</span></div><div className="fs-wave">{Array.from({length:28},(_,i)=><b key={i} style={{height:8+(Math.sin(i*3.7)+1)*15,animationDelay:`${i*.04}s`}}/>)}</div><p>{step<3?'正在连接你的上下文…':step<5?'正在将计划转为行动…':p.result}</p><small>场景数据用于效果演示，尚未连接 AWS 或实体设备。</small></aside>
    {current&&<aside className="fs-detail"><button className="fs-back" onClick={()=>setSelected('')}>↗ 返回全景 <span>ESC</span></button><div className="fs-eyebrow">DEVICE EXPLORER / {current.en}</div><h2>{current.name}</h2><p>{current.desc}</p>{current.id==='app'&&<><div className="fs-tabs">{['手机','录音豆','Flow Bar'].map(t=><button className={appTab===t?'active':''} onClick={()=>setAppTab(t)} key={t}>{t}</button>)}</div><div className="fs-phone"><div className="fs-island"/><small>Flow · {appTab}</small><h3>生活正在发生，<br/>Flow 为你记住。</h3><div>◉ {appTab==='手机'?'语音 · 照片 · 位置':appTab==='录音豆'?'随身录音 · 素材同步':'语音交互 · 屏幕反馈'}</div><article>明日路演准备<small>讨论记录 → 行动清单</small></article></div></>}
    <dl><dt>INPUT / 输入到 Flow</dt><dd>{capability?.input}</dd><dt>OUTPUT / 执行与反馈</dt><dd>{capability?.output}</dd></dl>{(current.id==='bar'||current.id==='pod')&&<button className="fs-action" onClick={()=>{setSelected('bar');setDetached(!detached);}}>{detached?'磁吸合体 ↙':'分离录音豆 ↗'}</button>}<div className="fs-detail-note">能力示意 · 以实际设备接口与授权为准</div></aside>}
    <footer className="fs-bottom"><div className="fs-controls"><button onClick={()=>setPlaying(!playing)} aria-label={playing?'暂停演示':'播放演示'}>{playing?'Ⅱ':'▶'}</button><div><strong>上下文，正在流动</strong><small>DEMO SEQUENCE / {steps[step]}</small></div><button className="fs-reset" onClick={()=>{setStep(0);setSelected('');setPlaying(true);}}>↻ 重播</button></div><div className="fs-steps">{steps.map((s,i)=><button key={s} onClick={()=>setStep(i)} className={i===step?'active':i<step?'done':''}><b>{i<step?'✓':`0${i+1}`}</b>{s}</button>)}</div><div className="fs-legend"><span>● 采集</span><span>● 记忆</span><span>● 执行</span></div></footer>
    <nav className="fs-times">{phases.map((p,i)=><button key={p.name} className={phase===i?'active':''} onClick={()=>{setPhase(i);setStep(0);}}>{p.name}</button>)}</nav>
    <Escape onEscape={()=>setSelected('')}/>
  </main>;
}
function Escape({onEscape}:{onEscape:()=>void}) {useEffect(()=>{const listener=(e:KeyboardEvent)=>{if(e.key==='Escape')onEscape();};window.addEventListener('keydown',listener);return()=>window.removeEventListener('keydown',listener);},[onEscape]);return null;}
