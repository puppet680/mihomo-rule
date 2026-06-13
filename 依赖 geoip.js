// 第六版 - 支持下载器低倍率下载文件
const CDN_URL = "https://cdn.jsdmirror.com";

const geoxURL = {
  geoip: `${CDN_URL}/gh/Loyalsoldier/v2ray-rules-dat@release/geoip.dat`,
  geosite: `${CDN_URL}/gh/Loyalsoldier/v2ray-rules-dat@release/geosite.dat`,
  mmdb: `${CDN_URL}/gh/Loyalsoldier/geoip@release/Country.mmdb`,
  asn: `${CDN_URL}/gh/Loyalsoldier/geoip@release/GeoLite2-ASN.mmdb`
};

/**
 * 地区代码枚举
 * @readonly
 * @enum {string}
 */
const RegionCode = {
  HK: "hk",
  TW: "tw",
  JP: "jp",
  SG: "sg",
  US: "us",
  KR: "kr",
  GB: "gb",
  MO: "mo",
};

// 地区筛选
const RegionList = [
  { key: "filterHk", name: "🇭🇰香港", code: RegionCode.HK },
  { key: "filterTw", name: "🇹🇼台湾", code: RegionCode.TW },
  { key: "filterJp", name: "🇯🇵日本", code: RegionCode.JP },
  { key: "filterSg", name: "🇸🇬新加坡", code: RegionCode.SG },
  { key: "filterUs", name: "🇺🇸美国", code: RegionCode.US },
  { key: "filterKr", name: "🇰🇷韩国", code: RegionCode.KR },
  { key: "filterUk", name: "🇬🇧英国", code: RegionCode.GB },
  { key: "filterMO", name: "🇲🇴澳门", code: RegionCode.MO },
];

/**
 * GN (Group Names & Icons) - 策略组字典
 * 集中管理所有非动态生成的策略组名称和图标，方便统一维护
 */
const GN = {
  Manual: { name: "默认", icon: `${CDN_URL}/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/adjust.svg` },
  AI: { name: "人工智能", icon: `${CDN_URL}/gh/powerfullz/override-rules@master/icons/chatgpt.png` },
  Google: { name: "谷歌服务", icon: `${CDN_URL}/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/google.svg` },
  Bili: { name: "BiliBili", icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/bilibili.png` },
  Netflix: { name: "奈飞视频", icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Netflix.png` },
  Bahamut: { name: "巴哈姆特", icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Bahamut.png` },
  TikTok: { name: "TikTok", icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/TikTok.png` },
  Social: { name: "社交媒体", icon: `${CDN_URL}/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/telegram.svg` },
  Static: { name: "静态资源", icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Cloudflare.png` },
  Git: { name: "代码托管", icon: `${CDN_URL}/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/github.svg` },
  Crypto: { name: "Crypto", icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Cryptocurrency_3.png` },
  SSH: { name: "SSH(22端口)", icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Server.png` },
  Direct: { name: "🇨🇳 国内直连", icon: `${CDN_URL}/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/link.svg` },
  Auto: { name: "🚀延迟优选", icon: "" },
  Failover: { name: "故障转移", icon: `${CDN_URL}/gh/clash-verge-rev/clash-verge-rev.github.io@main/docs/assets/icons/guard.svg` },
  Download: { name: "下载器", icon: `${CDN_URL}/gh/Koolson/Qure@master/IconSet/Color/Download.png` }
};

const Suffix = {
  Polling: "并发轮询",
  Hash: "会话保持",
  Latency: "延迟优选"
};

// 地区过滤规则
const filters = {
  FilterNetflix: "(NF|奈飞|解锁|Netflix|NETFLIX|Media)",
  FilterAI: "(Gemini|Claude|GPT|OpenAI|Google|Artificial|AI)",
  FilterTiktok: "(TikTok|TK)",
  FilterBahamut: "(🇹🇼|巴哈|动画疯|Bahamut|AniGamer|TW|台湾|臺灣|Hinet|CHT)",
  FilterBilibili: "(🇭🇰|🇹🇼|🇲🇴|港|台|澳门|HK|HongKong|TW|Taiwan|MO|Macau|Hinet|CHT|Bili)",
  FilterResidential: "(家宽|住宅|ISP|Residential|HISP)",
  FilterLowRate: "(?<!\\d)0\\.\\d+",
  FilterAll: "^(?!.*(群|邀请|官网|客服|订阅|流量|已用|剩余|过期|通知|说明|提示|更新|作者|频道|网站|网址|邮箱|回国|校园|游戏|🎮|教育|久虚|禁止)).*$",
  filterHk: "(🇭🇰|香港|港|HK|Hong Kong|HongKong)",
  filterTw: "(🇹🇼|台湾|台|新北|彰化|TW|Taiwan)",
  filterJp: "(🇯🇵|日本|川日|东京|大阪|泉日|埼玉|沪日|深日|JP|Japan)",
  filterSg: "(🇸🇬|新加坡|坡|狮城|SG|Singapore)",
  filterUs: "(🇺🇸|美国|美|波特兰|达拉斯|俄勒冈|凤凰城|费利蒙|硅谷|United States|America|US)",
  filterKr: "(🇰🇷|韩国|韩|韓|首尔|KR|Korea|KOR)",
  filterUk: "(🇬🇧|英国|UK|United Kingdom|London)",
  filterMo: "(🇲🇴|澳门|MO|Macau)",
};

const CommonConfig = { testUrl: "https://cp.cloudflare.com/generate_204", testInterval: 300 };

// 组类型
const GroupType = Object.freeze({
  Select: { value: "select" },
  UrlTest: { value: "url-test", defaults: { url: CommonConfig.testUrl, interval: CommonConfig.testInterval } },
  Fallback: { value: "fallback", defaults: { url: CommonConfig.testUrl, interval: 30, timeout: 2000, } },
  LBRoundRobin: {
    value: "load-balance",
    defaults: { strategy: "round-robin", url: CommonConfig.testUrl, interval: CommonConfig.testInterval }
  },
  LBConsistentHash: {
    value: "load-balance",
    defaults: { strategy: "consistent-hashing", url: CommonConfig.testUrl, interval: CommonConfig.testInterval }
  }
});


// ===================================================================================
// dns配置
const dnsConfig = {
  enable: true,
  ipv6: false,
  "enhanced-mode": "fake-ip",
  "fake-ip-range": "198.18.0.1/16",
  "fake-ip-filter": [
    "geosite:connectivity-check",
    "geosite:private",
    "rule-set:fakeip-filter",
  ],
  "default-nameserver": [
    "223.5.5.5"
  ],
  // 专门用于解析代理服务器域名的解析器
  "proxy-server-nameserver": [
    "223.5.5.5"
  ],
  // 走直连出站的解析器（通常用于国内解析或探测）
  "direct-nameserver": [
    "https://doh.pub/dns-query",
    "https://223.5.5.5/dns-query",
  ],
  // 核心解析器：强制通过 PROXY 组解析，并携带 ECS (EDNS Client Subnet)
  // 这能确保 Google DNS 返回最适合中国大陆出口节点的解析结果
  "nameserver": [
    "https://8.8.8.8/dns-query#PROXY&ecs=120.76.0.0/14&ecs-override=true"
  ],
  // 联动逻辑：确保 nameserver-policy 与你的 GEOSITE 匹配
  "nameserver-policy": {
    "GEOSITE:CATEGORY-ADS@ADS": ["rcode://success"],
    "geosite:cn": [
      "https://doh.pub/dns-query",
      "https://223.5.5.5/dns-query"
    ],
    "geosite:private": "223.5.5.5"
  },
  "fallback": [
    "https://8.8.8.8/dns-query#PROXY&ecs=120.76.0.0/14", // 国外解析走代理组
    "https://1.1.1.1/dns-query#PROXY"
  ],
  "fallback-filter": {
    "geoip": true,           // 核心：解析结果是非中国 IP 时，强制使用 fallback 的结果
    "geoip-code": "CN",
    "ipcidr": [
      "240.0.0.0/4",         // 过滤无效 IP
      "0.0.0.0/32",
      "127.0.0.1/32"
    ]
  }
};
// 嗅探配置
const snifferConfig = {
  enable: true,
  "parse-pure-ip": true,
  "force-domain": [
    "+.netflix.com",
    "+.nflxvideo.net",
    "+.chatgpt.com",
    "+.anthropic.com",
    "+.google.com"
  ],
  "sniff": {
    // 识别 TLS 握手包中的 SNI
    "tls": {
      "ports": [443, 8443]
    },
    // 识别 HTTP 请求头中的 Host
    "http": {
      "ports": [80, 8080],
      "override-destination": true // 将目标 IP 还原为解析出的真实域名
    },
    "quic": {
      "ports": [443]
    }
  },
  "skip-domain": [
    "Mijia Cloud",
    "+.push.apple.com"
  ]
};
const tunConfig = [];         // tun配置
// 规则配置
const rulesConfig = (geoRules = []) => [
  // --- 1. 基础设施层 (屏蔽与私有网络) ---
  // 屏蔽非中国区的 QUIC 流量，确保流媒体降级到 TCP 触发精确分流
  "AND,((NETWORK,UDP),(DST-PORT,443),(NOT,((OR,((GEOSITE,CN),(GEOIP,CN)))))),REJECT",
  "GEOSITE,CATEGORY-ADS@ADS,REJECT",
  `GEOSITE,PRIVATE,${GN.Direct.name}`,
  `GEOIP,PRIVATE,${GN.Direct.name},no-resolve`,
  // 自定义规则
  // 下载器
  `AND,((OR,((RULE-SET,download-client),(PROCESS-NAME-REGEX,(?i)ABDownloadManager))),(NOT,((GEOSITE,CN))),(NOT,((GEOIP,CN)))),${GN.Download.name}`,
  // --- 2. 专项业务层 (IP/节点高敏感) ---
  `GEOSITE,CATEGORY-AI-!CN,${GN.AI.name}`,
  `GEOSITE,CATEGORY-CRYPTOCURRENCY,${GN.Crypto.name}`,
  // --- 3. 媒体与社交层 (流媒体 & SNS) ---
  // 流媒体部分
  `GEOSITE,NETFLIX,${GN.Netflix.name}`,
  `GEOSITE,BAHAMUT,${GN.Bahamut.name}`,
  `GEOSITE,TIKTOK,${GN.TikTok.name}`,
  `GEOSITE,BILIBILI,${GN.Bili.name}`,
  // 社交媒体部分
  `GEOSITE,TELEGRAM,${GN.Social.name}`,
  `GEOSITE,TWITTER,${GN.Social.name}`,
  `GEOSITE,FACEBOOK,${GN.Social.name}`,
  `GEOSITE,INSTAGRAM,${GN.Social.name}`,
  `GEOSITE,DISCORD,${GN.Social.name}`,
  `GEOSITE,LINE,${GN.Social.name}`,
  `GEOSITE,REDDIT,${GN.Social.name}`,
  `GEOSITE,LINKEDIN,${GN.Social.name}`,
  `GEOSITE,PINTEREST,${GN.Social.name}`,
  `GEOSITE,TUMBLR,${GN.Social.name}`,
  `GEOSITE,WHATSAPP,${GN.Social.name}`,
  // 社交媒体 IP 兜底 (no-resolve 避免泄露)
  `GEOIP,TELEGRAM,${GN.Social.name},no-resolve`,
  `GEOIP,TWITTER,${GN.Social.name},no-resolve`,
  `GEOIP,FACEBOOK,${GN.Social.name},no-resolve`,
  // 代码托管平台
  `GEOSITE,GITHUB,${GN.Git.name}`,
  `GEOSITE,GITLAB,${GN.Git.name}`,
  `GEOSITE,ATLASSIAN,${GN.Git.name}`,
  // --- 4. 通用代理层 (Google 服务与 CDN 加速) ---
  `AND,((GEOSITE,GOOGLE),(NOT,((GEOSITE,GOOGLE-CN)))),${GN.Google.name}`,
  // 仅在命中 CDN 且非国内 IP 时，才走静态资源加速
  `AND,((RULE-SET,cdn),(NOT,((GEOIP,CN)))),${GN.Static.name}`,
  // --- 5. 国内直连层 ---
  `GEOSITE,CN,${GN.Direct.name}`,
  `GEOIP,CN,${GN.Direct.name},no-resolve`,
  `RULE-SET,app-cms10,${GN.Direct.name}`,

  // --- 6. 区域 IP 分流 (动态生成部分) ---
  ...geoRules,

  // --- 7. 最终兜底 ---
  `MATCH,${GN.Manual.name}`
];

/**
 * 动态代理组配置函数
 * * @param {NodeSelector} n - 链式节点选择器实例。
 * @returns {Object[]} 构造完成的代理组数组，对应 YAML 的 proxy-groups 字段。
 * * @description
 * 逻辑结构：
 * 1. 地区负载均衡组：为每个地区（HK, TW等）生成“并发轮询”和“会话保持”两种 LB 组。
 * - type: load-balance
 * - strategy: round-robin (轮询)
 * - strategy: consistent-hashing (一致性哈希，用于保持登录状态)
 * 2. 业务策略组：
 * - AI/Netflix/BiliBili 等专有组，利用正则自动筛选节点。
 * - 使用 hidden: true 隐藏后端负载均衡组，保持 UI 简洁。
 */
function proxyGroupsConfig(n) {
  // 地区分组
  const allLBNames = [];
  const regionDefinitions = [];

  const subGroupConfigs = [
    { suffix: Suffix.Polling, type: GroupType.LBRoundRobin },
    { suffix: Suffix.Hash, type: GroupType.LBConsistentHash },
    { suffix: Suffix.Latency, type: GroupType.UrlTest }
  ];

  // 动态生成各地区的负载均衡组
  RegionList.forEach(reg => {
    const nodes = n[reg.key];
    if (nodes && nodes.value.length > 0) {
      subGroupConfigs.forEach(conf => {
        const groupName = getRegionGroupName(reg.code, conf.suffix);

        regionDefinitions.push({
          name: groupName,
          type: conf.type,
          chain: nodes, // 保持 Proxy 对象
          hidden: true,
        });

        allLBNames.push(groupName);
      });
    }
  });

  // 定义基础策略组
  const baseDefinitions = [
    { ...GN.Manual, type: GroupType.Select, chain: n.add(GN.Auto.name).FilterAll.add(allLBNames).add(GN.Failover.name).add(GN.Direct.name) },
    { ...GN.Auto, type: GroupType.UrlTest, chain: n.FilterAll, hidden: true },
    { ...GN.Failover, type: GroupType.Fallback, chain: n.add(allLBNames).exclude(Suffix.Polling).exclude(Suffix.Hash).add(GN.Auto.name) },
    { ...GN.AI, type: GroupType.Select, chain: n.FilterAI.add(allLBNames).exclude("filterHk") },
    { ...GN.Google, type: GroupType.Select, chain: n.add(GN.Manual.name).add(allLBNames) },
    { ...GN.Bili, type: GroupType.Select, chain: n.add(GN.Direct.name).FilterBilibili },
    { ...GN.Netflix, type: GroupType.Select, chain: n.FilterNetflix.default(allLBNames) },
    { ...GN.Bahamut, type: GroupType.Select, chain: n.FilterBahamut.add(allLBNames).include("filterHk|filterTw|filterMo") },
    { ...GN.TikTok, type: GroupType.Select, chain: n.FilterTiktok.add(allLBNames).exclude("filterHk").add(GN.Direct.name) },
    { ...GN.Social, type: GroupType.Select, chain: n.add(GN.Manual.name).add(allLBNames).exclude(Suffix.Polling) },
    { ...GN.Git, type: GroupType.Fallback, chain: n.add(GN.Manual.name).add(allLBNames) },
    { ...GN.Static, type: GroupType.Select, chain: n.add(GN.Manual.name).add(allLBNames).exclude(Suffix.Hash) },
    { ...GN.Crypto, type: GroupType.Select, chain: n.add(GN.Manual.name).add(allLBNames) },
    { ...GN.Download, type: GroupType.Fallback, chain: n.FilterLowRate.add(GN.Manual.name) },
    { ...GN.SSH, type: GroupType.Select, chain: n.add(GN.Direct.name).add(allLBNames).exclude(Suffix.Polling) },
    { ...GN.Direct, type: GroupType.Select, chain: n.add("DIRECT"), hidden: true },
  ];

  const finalDefinitions = [...baseDefinitions, ...regionDefinitions];

  // 3. 转换逻辑
  return finalDefinitions
    .filter(d => d.name)
    .map(({ name, type, chain, hidden, icon }) => {
      // 统一从 chain.value 获取最终数组，如果没有 chain 则给空数组
      const proxies = (chain && chain.value) ? chain.value : [];

      const res = {
        name: name,
        type: type.value,
        proxies: proxies
      };

      if (type.defaults) Object.assign(res, type.defaults);
      if (hidden) res.hidden = true;
      if (icon) res.icon = icon;
      return res;
    })
    .filter(g => g.proxies.length > 0);
}
// 规则提供者
// Rule Provider 通用配置
const ruleProviderCommonMrs = { type: "http", format: "mrs", interval: 86400 };
const ruleProviderCommonText = { type: "http", format: "text", interval: 86400 };
const ruleProviderCommonYaml = { type: "http", format: "yaml", interval: 86400 };
const ruleProvidersConfig = {
    "cdn": { ...ruleProviderCommonMrs, behavior: "domain", url: `${CDN_URL}/gh/QuixoticHeart/rule-set@ruleset/meta/domain/cdn.mrs`, path: "./rulesets/domain/cdn.mrs" },
    "fakeip-filter": { ...ruleProviderCommonMrs, behavior: "domain", url: `${CDN_URL}/gh/DustinWin/ruleset_geodata@mihomo-ruleset/fakeip-filter.mrs`, path: "./rulesets/domain/fakeip-filter.mrs" },
    "download-client": { ...ruleProviderCommonYaml, behavior: "classical", url: `${CDN_URL}/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Download/Download.yaml`, path: "./rulesets/domain/download-client.yaml" },
    "app-cms10": { ...ruleProviderCommonYaml, behavior: "classical", url: `https://raw.githubusercontent.com/puppet680/cms-config/refs/heads/main/mihomo_rules.yaml`, path: "./rulesets/domain/app-cms10.yaml" },
};
/**
 * 业务逻辑配置构建器
 * * @param {Object} config - 待修改的配置对象。
 * @description
 * 脚本在此处定义了 Mihomo 特有的高性能字段：
 * - unified-delay: true (开启统一延迟计算)
 * - tcp-concurrent: true (开启 TCP 并发连接)
 * - geox-url: 自定义资源镜像，加速资源下载
 */
function buildCustomConfig(config) {

  const n = createNodesProxy(config.proxies || []);
  const geoRules = RegionList
  .filter(reg => n[reg.key]?.value.length > 0) // 1. 过滤：只处理有节点的地区
  .map(reg => {
    const targetGroup = getRegionGroupName(reg.code, Suffix.Polling);
    return `GEOIP,${reg.code},${targetGroup},no-resolve`;
  });

  // 基础全局项
  config["mode"] = "rule";
  config["allow-lan"] = true;
  config["log-level"] = "info";
  config["ipv6"] = false;
  config["unified-delay"] = true;
  config["tcp-concurrent"] = true;

  // 统一注入核心配置块
  config["geox-url"] = geoxURL;
  config["dns"] = dnsConfig;
  config["sniffer"] = snifferConfig;
  // config["tun"] = tunConfig;
  config["rules"] = rulesConfig(geoRules);
  config["proxy-groups"] = proxyGroupsConfig(n);
  config["rule-providers"] = ruleProvidersConfig;
  config["profile"] = {
    "store-selected": true,
    "store-fake-ip": false
  };

  return config;
}

/**
 * Mihomo 配置文件覆写主函数
 */
function main(config) {
  return buildCustomConfig(config);
}

/**
 * @typedef {Object} NodeSelector
 * @property {string[]} value - 结束链式调用，返回最终的节点名称数组。
 * @property {function(...(NodeSelector | string | RegExp | string[])): NodeSelector} add - 【并集】追加节点、组名或另一个选择器。
 * @property {function(...(NodeSelector | string | RegExp | string[])): NodeSelector} default - 【兜底】仅当当前集合为空时，才追加节点。
 * @property {function(keyof filters | string | RegExp): NodeSelector} include - 【交集】在当前结果中二次筛选，保留匹配项。
 * @property {function(keyof filters | string | RegExp): NodeSelector} exclude - 【差集】从当前结果中移除匹配项。
 * @description 
 * 这是一个 Proxy 包装的对象，支持通过 `filters` 字典中的 Key 直接访问。
 * 例如：n.filterHk.exclude("IEPL")
 */

/**
 * 创建 Proxy 链式节点选择器
 * @param {Object[]} allProxies - 原始节点数组 (config.proxies)。
 * @param {Set<string>} [selectedNames=new Set()] - 内部递归使用的选中集合。
 * @returns {NodeSelector} 返回支持链式调用的 Proxy 对象。
 */
function createNodesProxy(allProxies, selectedNames = new Set()) {
  return new Proxy({}, {
    get(target, prop) {
      if (prop === 'value') return Array.from(selectedNames);

      // 提取通用逻辑：识别是 filters 的 Key 还是原生字符串/正则
      const getRegex = (pattern) => {
        if (typeof pattern === 'string' && pattern.includes('|')) {
          // 如果包含 |，拆分并检查每一个部分是否在 filters 中
          const combined = pattern
            .split('|')
            .map(p => filters[p.trim()] || p.trim())
            .join('|');
          return new RegExp(combined, "i");
        }
        return new RegExp(filters[pattern] || pattern, "i");
      };

      // --- 功能：default (兜底逻辑) ---
      if (prop === 'default') {
        return (...args) => {
          // 如果当前已经有节点了，直接返回现状，无视兜底参数
          if (selectedNames.size > 0) {
            return createNodesProxy(allProxies, selectedNames);
          }
          // 如果当前为空，则执行 add 的逻辑
          const nextSelected = new Set();
          args.forEach(arg => {
            if (!arg) return;
            if (arg.value) arg.value.forEach(v => nextSelected.add(v));
            else if (Array.isArray(arg)) arg.forEach(v => nextSelected.add(v));
            else if (typeof arg === 'string' && filters[arg]) {
              const regex = new RegExp(filters[arg], "i");
              allProxies.forEach(p => { if (regex.test(p.name)) nextSelected.add(p.name); });
            }
            else nextSelected.add(arg);
          });
          return createNodesProxy(allProxies, nextSelected);
        };
      }

      // --- 功能: add (手动追加字符串、数组或另一个 Proxy) ---
      if (prop === 'add') {
        return (...args) => {
          const nextSelected = new Set(selectedNames);
          args.forEach(arg => {
            if (!arg) return;
            if (arg.value && Array.isArray(arg.value)) {
              // 如果传的是另一个 Proxy 对象，展开它的 value
              arg.value.forEach(item => nextSelected.add(item));
            } else if (Array.isArray(arg)) {
              // 如果传的是普通数组
              arg.forEach(item => nextSelected.add(item));
            } else {
              // 如果是普通字符串 (如 "DIRECT" 或 "Manual")
              nextSelected.add(arg);
            }
          });
          return createNodesProxy(allProxies, nextSelected);
        };
      }

      // --- 功能: include (在当前结果中二次筛选 / 交集) ---
      if (prop === 'include') {
        return (pattern) => {
          const regex = getRegex(pattern);
          const nextSelected = new Set();
          selectedNames.forEach(name => {
            if (regex.test(name)) nextSelected.add(name);
          });
          return createNodesProxy(allProxies, nextSelected);
        };
      }

      // --- 功能 : exclude (从当前结果中移除 / 差集) ---
      if (prop === 'exclude') {
        return (pattern) => {
          const regex = getRegex(pattern);
          const nextSelected = new Set(selectedNames);
          nextSelected.forEach(name => {
            if (regex.test(name)) nextSelected.delete(name);
          });
          return createNodesProxy(allProxies, nextSelected);
        };
      }

      // --- 功能 : 直接属性访问 (追加包含 / 并集) ---
      const nextSelected = new Set(selectedNames);
      if (filters[prop]) {
        const regex = new RegExp(filters[prop], "i");
        allProxies.forEach(p => {
          if (regex.test(p.name)) nextSelected.add(p.name);
        });
      }
      return createNodesProxy(allProxies, nextSelected);
    }
  });
}

/**
 * 动态组名生成器 (工具函数)
 * @param {RegionCode} code - 地区代码 (如 "HK", "US")
 * @param {Suffix} suffix - 后缀 (如 "轮询", "散列")
 */
function getRegionGroupName(code, suffix = Suffix.Polling) {
  const region = RegionList.find(r => r.code === code);
  return region ? `${region.name}·${suffix}` : GN.Manual.name;
}
