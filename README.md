# 小小中文 / ちいさな中国語

给住在日本、日常说日语的孩子用的**初级中文**小工具。

本仓库由 [Tank-OCR](https://github.com/tanktangmold/Tank-OCR) 中的 `xiaoxue-zhongwen` 独立出来，可单独运行，不依赖 OCR 服务。

## 一个月 · 一轮故事 + 9分测试

主线是 **C罗成长故事**，30天连成一篇长故事：

1. 第1周：小岛、家里的爱、三岁第一脚
2. 第2周：离开家、里斯本、想家也不放弃
3. 第3周：心跳手术、被人叫爱哭、把话变成力量
4. 第4周：去英国、进球、有名也不忘记家

听完当天一轮故事（一句一图、点字发音、点句发音），再做 **9 分测试**。第一次按的算分。**9 分满分才能玩一次内置小游戏，并进入下一轮**（奇数天飞机、偶数天贪吃蛇）。不到 9 分就温柔地再测一遍，没有失败画面。

## 让孩子喜欢学的机制

- **复习热身**：从第2天起，新课前先做3道复习题，优先复习最近答错的词，可跳过
- **贴纸册**：每完成一天得一张贴纸，30张收集完就是整个故事
- **连续天数**：坚持≥2天会看到鼓励；中断了不批评，安静重来
- **答错不惩罚**：测试第一次按的算分；不到 9 分只是再听、再测，没有失败画面；完成时有随机中文夸奖和庆祝动画

设计细节和升级路线见 [docs/LEARNING_DESIGN.md](docs/LEARNING_DESIGN.md)。

## 多个孩子 · iPad

- 每个孩子一个头像，进度分开存，互不影响
- 同一台 iPad 可以换人；同一 Wi-Fi 下多台 iPad 可同时打开
- 按钮大、可点、适合手指；可加到主屏幕当网页 App

## 平板上怎么用（不用开电脑）

平板浏览器打开这一页即可，进度保存在这台平板上：

**https://raw.githack.com/tanktangmold/chinese-learning-stories/cursor/import-xiaoxue-zhongwen-a877/static/index.html**

iPad：打开后点右上角 **分享** → **添加到主屏幕**。以后像普通 App 一样点图标就能学，电脑不用开。

长期固定地址（合并 PR 并在仓库 Settings → Pages 里把 Source 设为 GitHub Actions 之后）：

**https://tanktangmold.github.io/chinese-learning-stories/**

电脑上本地 `go run .` 时，平板不要打开 `http://127.0.0.1:8080/`。用终端里 `Phone/iPad:` 那一行。

## 本地运行

需要 [Go 1.22+](https://go.dev/dl/)。

```bash
git clone https://github.com/tanktangmold/chinese-learning-stories.git
cd chinese-learning-stories
pip3 install -r requirements.txt
go test ./...
go run .
```

电脑浏览器打开 <http://127.0.0.1:8080/> 。
iPad 请连同一 Wi-Fi，用终端打印的局域网地址打开。

```bash
LISTEN_ADDR=0.0.0.0:8080 go run .
```

朗读默认用免费的中文神经语音（女声晓晓/晓伊/晓涵，男声云希/云扬/云健）。

每句课文都有一张**预先内置的宫崎骏风动漫静帧**（`static/pictures/ghibli/`），图下是这句中文。上课只读现成照片，不现生成。画风仍可在漫画 / 绘本 / 写实之间微调颜色。

如果语音暂时连不上网，会退回浏览器朗读。

## 目录

```
.
  main.go           独立 HTTP 服务（默认同网可访问）
  learn/            30日课程、句型短句、多孩子进度、游戏
  handler/          API
  static/           iPad 阅读页
  static/pictures/  240 张按句内置的插图
  scripts/          把课文句子画成内置图
  data/             运行后自动生成，保存每个孩子的进度
```

课文是原创短句，根据公开的成长经历改写成儿童能读的中文，不照抄任何传记原文。
