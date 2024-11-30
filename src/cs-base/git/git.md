# Git 学习笔记

::: info 入门资料

- 参考: [Git - 官方文档](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%85%B3%E4%BA%8E%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6)
- 安装: [Git - 安装 Git](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git)
- 配置: [Git - 初次运行 Git 前的配置](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%88%9D%E6%AC%A1%E8%BF%90%E8%A1%8C-Git-%E5%89%8D%E7%9A%84%E9%85%8D%E7%BD%AE)
  :::

## 1. 常用 GIT 命令

练习文档：https://learngitbranching.js.org/?locale=zh_CN

### 1.1 文件同步

- 1. git add `filename`: 将文件添加入缓存区。

  - git add --all 和 git add . 区别：-all 添加项目所有文件，. 添加当前目录下所有文件。

- 2. git commit -m `message`"：当前节点上提交一个迭代，生成一个节点。
  - git commit --amend: 修改最新一次提交的 message。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20241004221654.png"/> </div>

### 1.2 移动

- 1. git branch `branch-name`：当前节点上创建一个分支。

  - git branch -D `branch-name`: 删除本地分支。
  - git branch -m `old-branch-name` `new-branch-name`: 修改本地分支名称。

- 2. git checkout `branch`：从当前节点切换至另一分支（后续引入 git switch）。
  - git checkout -b `branch-name`：branch + checkout 快速创建新分支，并切换至该分支。
  - git checkout `commit-id`（一般是 commit 的 hash 值）: 切换当前 HEAD 的指向，指向某个历史的 commit，从而以该 commit 为基进行开发。（注意此时 HEAD 处于 detached 状态，没有指向具体分支，所做变更存档）。
  - git checkout HEAD~n：移动 HEAD，以当前 HEAD 指向的 commit 为基准，将 HEAD 向上移动 n 个 commit 节点（n 不取值表示向上移动 1 个 commit）。

### 1.3 合并

- 1. git merge `branch`：在当前分支合并另一分支，在当前节点上，生成一个节点。

  - git merge --abort: 取消正在进行中的 merge，恢复当前分支 merge 前的状态。

    <div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20241004232939.png"/> </div>

- 2. git rebase `branch`：当前分支合并另一分支，复制当前节点至基（分支最初被 checkout 的那个节点）的所有 commit，转移至另一分支上，以另一分支的最新 commit 为基。

  - git rebase --abort: 取消正在进行中的 rebase，恢复当前分支 rebase 前的状态。

    <div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20241005104027.png"/> </div>

  - git rebase -i `commit-id`: 修改历史提交 commit 的 message（未 push 至远端仓库）。

  <div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20241005104607.png"/> </div>

  - git rebase -i `commit-id`: 将历史多个连续 commit 合并为一个 commit（未 push 至远端仓库）。

  <div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20241005104639.png"/> </div>

- 3. git cherry-pick `commit-id`: 在当前分支合并另一个分支上的一个 commit；

  - git cherry-pick `start-commit-id`..`end-commit-id`: 在当前分支合并另一个分支上的多个 commit，`(start-commit-id, end-commit-id]` start-commit-id 不包含其中。

  <div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20241005104755.png"/> </div>
::: info 多分支集成主干解冲突
当feature分支合入主干master分支出现冲突时如何解决？
1. feature分支本地先合并一遍master分支，解决冲突后再合入master分支
2. 如果想保持主干分支的线性化，先checkout出一个主干分支的副本 `copy-master`，在copy-master分支上rebase feature分支，每个commit都得解一次冲突，再将copy-master合入master分支，操作十分繁琐。推荐一种用master一次性解冲突并rebase保持主干分支线性的方式 [`git rerere`](https://juejin.cn/post/6844903924122517512)：
- 开启git rerere配置 `git config --global rerere.enabled true`；
- feature 分支 `git merge copy-master`分支，一次性解决冲突。并触发 `git rerere` 自动记录解冲突的方案；
- feature 分支 `git reset HEAD^1` 销毁merge copy-master的这一次commit；
- copy-master分支 `git rebase feature`，自动利用git rerere 记录解冲突的方案，一路`git add .` 、`git rebase --continue`即可；
- master 分支 `git rebase copy-master`，合入feature分支功能的同时保持主干分支的线性。
:::


### 1.4 撤销

- 1. git reset **（适用于代码未提交至远端的场景）**
  - git reset HEAD：将 **本地暂存区（注意撤销对象）** add 的代码回退至与本地仓库一致，期间被 add 的代码会保留在工作区；
  - git reset HEAD -- `file_name`：指定回退 add 的部分文件，而不是所有文件；
  - git reset `commit-id`：将 **本地仓库（注意撤销对象）** 的 commit 回退至某一个版本，期间 commit 链路产生的代码 diff 会保留在工作区；
  - git reset --hard `commit-id`：与上一条功能相同，不过期间 commit 链路产生的代码 diff 不会保留在工作区，代码会完全丢失。
- 2. git revert `commit-id`: 将当前本地的某一 commit 代码取消，`保留commit链路，重新生成一个commit（适用于代码已提交至远端的场景）`。 + git revert `start-commit-id ^.. end-commit-id`: 将本地的多个 commit 代码取消，生成多个 commit； + git revert -n `start-commit-id ^.. end-commit-id`: 将本地的多个 commit 代码取消，生成一个 commit；
     假如 git commit 链是 `A -> B -> C  -> D` 如果想把 B，C，D 都给 revet，执行命令 `git revert B^..D`，这样就把 B，C，D 都给 revert 了，生成新的 git commit 链 `A -> B -> C -> D -> D' -> C' -> B' `。

### 1.5 缓存

- 1. git stash：
  - git stash push -m "description"：将当前暂存区未提交至工作区的代码，放入缓存中以栈的形式存储；
  - git stash pop：将缓存栈的栈顶存储的代码弹出；
  - git stash pop `stash-id`：将缓存栈中的指定层存储的代码弹出；
  - git stash list：查看缓存栈中缓存代码层次。

### 1.6 远端仓库

- 1. git clone `remote`: 将远端仓库复制到本地。
- 2. git fetch <远端主机名> <远端分支名> 和 git pull <远端主机名> <远端分支名>: 将远端分支 commit 同步至本地。
  - 两者区别：https://github.com/febobo/web-interview/issues/224
  - git pull --rebase: git pull origin main 实际是 git fetch origin origin/main + git merge origin/main 至本地 main 分支，--rebase 使得 main 合并 origin/main 使用了 rebase 方式使得提交记录更线性。
  - git fetch: 将本地所有 origin/\*\* 分支与对应远端分支同步。

::: info 将远端分支强制覆盖本地分支

1. git fetch -all：将本地的 origin/xxx 分支与远端 xxx 分支同步
2. git reset --hard origin/xxx：将本地的 xxx 分支与本地的 origin/xxx 分支同步
   :::

- 3. git push <远端主机名><远端分支名>: 将本地 commit 同步至远端分支（不用在乎当前 HEAD 所在位置）。比如当前处于 feat/test 测试分支上，执行 git push origin main 命令，可以直接将本地 main 分支 commit 内容同步至远端；如果只执行 git push，那么只等价于 git push origin feat/test。
  - git push <远端主机名> --delete <远端分支名>: 删除远端仓库分支。
- 4. git remote：建立远端仓库 url 在本地的映射
  - git remote -v：查看远端仓库的本地命名及对应 url；
  - git remote add：添加远端仓库的本地命名及对应 url，git remote add origin https::/a/xxxx；
  - git remote set-url：修改远端仓库的本地命名及对应 url，git remote set-url origin https::/b/xxx；
  - git remote rm：删除远端仓库的本地命名，git remote rm。

### 1.7 查看信息

- 1. git log：查看 git commit 历史信息
  - git log --oneline：缩略展示 commit 信息；
- 2. git config：查看git相关配置信息    
  - gtt config --`local/global/system` --list: 查看git相关配置信息，其中优先级 `local > global > system`；
  

## 2. GIT 原理

### 2.1 GIT 文件结构

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20241005105848.png"/> </div>

- 1. objects：存储 git 相关所有信息，以对象形式存储，以 hash 值标识对象。有以下几种对象类型：
  - commit：用户每一次提交。
  - tree：git 仓库中文件夹。
  - blob：git 仓库中每一个文件，原子单位，hash 值用文件内容生成。
- 2. git cat-file：根据 hash 值查看 git 对象相关信息
  - git cat-file -t `object_hash`：查看对象类型；
  - git cat-file -p `object_hash`：查看对象内容。

对应关系如下：

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20241005105931.png"/> </div>

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20241005110007.png"/> </div>

## 3. 最佳实践

##### 【1】`feature`分支合入`master`分支生成 commit-id 为 B，之后又在`master`将 B 进行 revert 生成 commit-id 为 B‘，再次将`feature`分支合入`master`，部分代码丢失？

解法：在 `master` 分支上 checkout 出一个新分支 `master_revert_temp`，在 `master_revert_temp` 上将 revert 生成的 commit-id B' 再次进行 revert 即可。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20241021205719.png"/> </div>

1. [最佳实践](https://jitwxs.cn/38727be2)
2. [官方解释](https://github.com/git/git/blob/master/Documentation/howto/revert-a-faulty-merge.txt)

## 4. 集成使用禁忌

### 1. 禁止向集成分支执行git push -f 操作
  禁止执行 `git push -f` 将本地分支的commit强制覆盖远端分支commit，导致其他协同开发者commit丢失。
### 2. 禁止向集成分支执行变更历史的操作
  禁止修改集成分支的历史commit，比如通过 `git rebase -i `修改历史commit的message，再`git push -f`强制推送到远端，导致其他协同开发者本地分支与远端分支不一致。
