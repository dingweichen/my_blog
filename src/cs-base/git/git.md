# Git学习笔记

::: info 入门资料
+ 参考:  [Git - 官方文档](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%85%B3%E4%BA%8E%E7%89%88%E6%9C%AC%E6%8E%A7%E5%88%B6)
+ 安装:  [Git - 安装 Git](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%AE%89%E8%A3%85-Git)
+ 配置:  [Git - 初次运行 Git 前的配置](https://git-scm.com/book/zh/v2/%E8%B5%B7%E6%AD%A5-%E5%88%9D%E6%AC%A1%E8%BF%90%E8%A1%8C-Git-%E5%89%8D%E7%9A%84%E9%85%8D%E7%BD%AE)
:::

## 1. 常用GIT命令
练习文档：https://learngitbranching.js.org/?locale=zh_CN

### 1.1 文件同步
+ 1. git add  `filename`: 将文件添加入缓存区。
	+ git add --all和 git add . 区别：-all添加项目所有文件，. 添加当前目录下所有文件。

+ 2. git commit -m `message`"：当前节点上提交一个迭代，生成一个节点。
	+ git commit --amend: 修改最新一次提交的message。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20241004221654.png"/> </div>

### 1.2 移动
+ 1. git branch `branch-name`：当前节点上创建一个分支。
	+ git branch -D  `branch-name`: 删除本地分支。
	+ git branch -m `old-branch-name` `new-branch-name`: 修改本地分支名称。

+ 2. git checkout `branch`：从当前节点切换至另一分支（后续引入git switch）。
	+ git checkout -b `branch-name`：branch + checkout 快速创建新分支，并切换至该分支。
	+ git checkout `commit-id`（一般是commit的hash值）: 切换当前HEAD的指向，指向某个历史的commit，从而以该commit为基进行开发。（注意此时HEAD处于detached状态，没有指向具体分支，所做变更存档）。
	+ git checkout HEAD~n：移动HEAD，以当前HEAD指向的commit为基准，将HEAD向上移动n个commit节点（n不取值表示向上移动1个commit）。

### 1.3 合并 
* 1. git merge `branch`：在当前分支合并另一分支，在当前节点上，生成一个节点。
    * git merge --abort: 取消正在进行中的merge，恢复当前分支merge前的状态。

    <div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20241004232939.png"/> </div>

* 2. git rebase `branch`：当前分支合并另一分支，复制当前节点至基（分支最初被checkout的那个节点）的所有commit，转移至另一分支上，以另一分支的最新commit为基。
    * git rebase --abort: 取消正在进行中的rebase，恢复当前分支rebase前的状态。

    <div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20241005104027.png"/> </div>

	* git rebase -i `commit-id`: 修改历史提交commit的message（未push至远端仓库）。
 
    <div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20241005104607.png"/> </div>

	* git rebase -i `commit-id`: 将历史多个连续commit合并为一个commit（未push至远端仓库）。

    <div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20241005104639.png"/> </div>
 
* 3. git cherry-pick `commit-id`: 在当前分支合并另一个分支上的一个commit；
	* git cherry-pick `start-commit-id`..`end-commit-id`: 在当前分支合并另一个分支上的多个commit，`(start-commit-id, end-commit-id]` start-commit-id不包含其中。

    <div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20241005104755.png"/> </div>

### 1.4 撤销
+ 1. git reset **（适用于代码未提交至远端的场景）**
    + git reset HEAD：将本地暂存区add的代码回退至与本地仓库一致，期间被add的代码会保留在工作区；
    + git reset HEAD --  `file_name`：指定回退add的部分文件，而不是所有文件；
    + git reset `commit-id`：将本地仓库的commit回退至某一个版本，期间commit链路产生的代码diff会保留在工作区；
    + git reset --hard `commit-id`：与上一条功能相同，不过期间commit链路产生的代码diff不会保留在工作区，代码会完全丢失。
+ 2. git revert `commit-id`: 将当前本地的某一commit代码取消，`保留commit链路，重新生成一个commit（适用于代码已提交至远端的场景）`。
	+ git revert `start-commit-id ^.. end-commit-id`: 将本地的多个commit代码取消，生成多个commit；
	+ git revert -n `start-commit-id ^.. end-commit-id`: 将本地的多个commit代码取消，生成一个commit；
假如git commit链是 `A -> B -> C  -> D`  如果想把B，C，D都给revet，执行命令 `git revert B^..D`，这样就把B，C，D都给revert了，生成新的git commit 链 `A -> B -> C -> D -> D' -> C' -> B' `。

### 1.5 缓存
+ 1. git stash：
	+ git stash push -m "description"：将当前暂存区未提交至工作区的代码，放入缓存中以栈的形式存储；
	+ git stash pop：将缓存栈的栈顶存储的代码弹出；
	+ git stash pop `stash-id`：将缓存栈中的指定层存储的代码弹出；
	+ git stash list：查看缓存栈中缓存代码层次。

### 1.6 远端仓库
+ 1. git clone `remote`: 将远端仓库复制到本地。
+ 2. git fetch <远端主机名> <远端分支名> 和 git pull <远端主机名> <远端分支名>: 将远端分支commit同步至本地。
	+ 两者区别：https://github.com/febobo/web-interview/issues/224
	+ git pull --rebase: git pull origin main 实际是 git fetch origin origin/main + git merge origin/main 至本地main分支，--rebase 使得main 合并 origin/main 使用了rebase方式使得提交记录更线性。
	+ git fetch: 将本地所有 origin/** 分支与对应远端分支同步。

::: info 将远端分支强制覆盖本地分支
1. git fetch -all：将本地的origin/xxx 分支与远端 xxx分支同步
2. git reset --hard origin/xxx：将本地的xxx分支与本地的origin/xxx分支同步
:::

+ 3. git push <远端主机名><远端分支名>: 将本地commit同步至远端分支（不用在乎当前HEAD所在位置）。比如当前处于 feat/test 测试分支上，执行 git push origin main命令，可以直接将本地main分支commit内容同步至远端；如果只执行 git push，那么只等价于 git push origin feat/test。
	+ git push <远端主机名> --delete <远端分支名>: 删除远端仓库分支。
+ 4. git remote：建立远端仓库url在本地的映射
	+ git remote -v：查看远端仓库的本地命名及对应url；
	+ git remote add：添加远端仓库的本地命名及对应url，git remote add origin https::/a/xxxx；
	+ git remote set-url：修改远端仓库的本地命名及对应url，git remote set-url origin https::/b/xxx；
	+ git remote rm：删除远端仓库的本地命名，git remote rm。

### 1.7 查看信息
+ 1. git log：查看git commit历史信息
	+ git log --oneline：缩略展示commit信息

## 2. GIT原理

### 2.1 GIT文件结构

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20241005105848.png"/> </div>

+ 1. objects：存储git相关所有信息，以对象形式存储，以hash值标识对象。有以下几种对象类型：
	+ commit：用户每一次提交。
	+ tree：git仓库中文件夹。
	+ blob：git仓库中每一个文件，原子单位，hash值用文件内容生成。
+ 2. git cat-file：根据hash值查看git对象相关信息
	+ git cat-file -t `object_hash`：查看对象类型；
	+ git cat-file -p `object_hash`：查看对象内容。

对应关系如下：
<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20241005105931.png"/> </div>

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/20241005110007.png"/> </div>
 
 
