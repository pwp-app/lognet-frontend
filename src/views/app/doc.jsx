import React from 'react';
import MarkdownCard from '../../components/main/markdowncard';

const usage = `
# Lognet 使用说明

## 简单集成

我们提供了供你快速完成服务集成的脚本，你只需要将我们提供的脚本文件引入你的项目即可（需引入到全局）。

脚本文件的获取和使用请参考集成脚本项目的 Readme：

[lognet-integration](https://github.com/pwp-app/lognet-integration)

在使用前请不要忘记配置你的脚本，脚本未经正确配置是无法使用的。

## 高级集成

你也可以直接与我们的 API 进行通信，自定义你的日志收集逻辑。

API 只支持 POST 方法，且请确保你提交的内容是 JSON，请求头的 Content-Type 为 application/json。

API 主机：lognet.pwp.app，协议仅支持 HTTPS。

### 普通日志提交

API 路径： /api/submit/general

接收参数：

| 参数 | 描述 | 类型 | 必需 |
| ------ | ------ | ------ | ------ |
| appKey | 站点的 App Key | string | 是 |
| path | 出错页面路径 | string | 是 |
| content | 日志内容 | string | 是 |
| clientWidth | body可视宽度 | number | 否 |
| clientHeight | body可视高度 | number | 否 |
| windowInnerWidth | 窗体内部宽度 | number | 否 |
| windowInnerHeight | 窗体内部高度 | number | 否 |
| windowOuterWidth | 窗体宽度 | number | 否 |
| windowOuterHeight | 窗体高度 | number | 否 |
| userAgent | 浏览器的 UA | string | 否 |

只有在所有关于用户浏览器宽高的参数都提交的时候，系统才会呈现屏幕信息，如果你需要收集该方面信息，清完整提交所有窗体宽高相关参数。

返回值：

| Key | 类型 | 描述 |
| ------ | ------ | ------ |
| code | number | 状态码 |
| message | string | 信息 |

日志提交成功时 code 为 200，如果 code 为其他内容说明调用失败。服务器除内部错误外不会直接以 HTTP 状态码返回调用结果，成功调用接口均返回 200，业务逻辑错误体现在返回的 code 上。

### 任务日志提交

API 路径： /api/submit/mission

接收参数：

| 参数 | 描述 | 类型 | 必需 |
| ------ | ------ | ------ | ------ |
| appKey | 站点的 App Key | string | 是 |
| missionId | 任务的 ID | string | 是 |
| type | 日志类型 | string | 是 |
| path | 出错页面路径 | string | 是 |
| content | 日志内容 | string | 是 |
| clientWidth | body可视宽度 | number | 否 |
| clientHeight | body可视高度 | number | 否 |
| windowInnerWidth | 窗体内部宽度 | number | 否 |
| windowInnerHeight | 窗体内部高度 | number | 否 |
| windowOuterWidth | 窗体宽度 | number | 否 |
| windowOuterHeight | 窗体高度 | number | 否 |
| userAgent | 浏览器的 UA | string | 否 |

type 限定为 debug、info、warn、danger 之一，不支持提交自定义的 type。

返回值：

| Key | 类型 | 描述 |
| ------ | ------ | ------ |
| code | number | 状态码 |
| message | string | 信息 |

`

class DocPage extends React.Component {
    render() {
        return (
            <div className="page-doc">
                <MarkdownCard text={usage}></MarkdownCard>
            </div>
        )
    }
}

export default DocPage;