# 图论

## DFS

## 1. 岛屿问题

### [200. 岛屿的数量](https://leetcode.cn/problems/number-of-islands/description/)

题目：

​	给你一个由 `'1'`（陆地）和 `'0'`（水）组成的的二维网格，请你计算网格中岛屿的数量。岛屿总是被水包围，并且每座岛屿只能由水平方向和/或竖直方向上相邻的陆地连接形成。此外，你可以假设该网格的四条边均被水包围。

解法：

​	此题与 \[1020. 飞地的数量 ]\(1020. 飞地的数量 )思路一致，但是不用将与边界陆地相连的陆地排除在外。

```javascript
var numIslands = function (grid) {
    let m = grid.length,
        n = grid[0].length;
    let result = 0;
    // 1.统计岛屿的数量
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] == 1) {
                result++;
                dfs(i, j);
            }
        }
    }
    return result;

    function dfs(x, y) {
        // 出口
        if (x < 0 || x >= m || y < 0 || y >= n || grid[x][y] == 0) return;

        let dx = [-1, 0, 1, 0],
            dy = [0, 1, 0, -1];
        // 处理当前位置
        grid[x][y] = 0;
        // 遍历邻居
        for (let i = 0; i < 4; i++) {
            dfs(x + dx[i], y + dy[i]);
        }
    }
};
```

### [463. 岛屿的周长](https://leetcode.cn/problems/island-perimeter/description/)

题目：

​	给定一个 `row x col` 的二维网格地图 `grid` ，其中：`grid[i][j] = 1` 表示陆地， `grid[i][j] = 0` 表示水域。网格中的格子 **水平和垂直** 方向相连（对角线方向不相连）。整个网格被水完全包围，但其中恰好有一个岛屿（或者说，一个或多个表示陆地的格子相连组成的岛屿）。

解法：

​`DFS`：

​	从岛屿的入口处DFS整个岛屿，每个陆地的长度等于其周围水域的数量，岛屿的周长等于每个陆地的周长和。没遍历一块陆地，需要将其值改变，防止再次访问该陆地。

```javascript
var islandPerimeter = function (grid) {
    let m = grid.length,
        n = grid[0].length;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] == 1) {
                return dfs(i, j);
            }
        }
    }


    function dfs(x, y) {
        // 出口
        if (x < 0 || x >= m || y < 0 || y >= n || grid[x][y] == 0) return 1;
        if (grid[x][y] == 'V') return 0;

        let dx = [-1, 0, 1, 0],
            dy = [0, 1, 0, -1];
        // 处理当前位置
        let perimeter = 0;
        grid[x][y] = 'V';
        // 遍历邻居
        for (let i = 0; i < 4; i++) {
            perimeter += dfs(x + dx[i], y + dy[i]);
        }
        return perimeter;
    }
};
```

### [695. 岛屿的最大面积](https://leetcode.cn/problems/max-area-of-island/description/)

题目：

​		给你一个大小为 `m x n` 的二进制矩阵 `grid`，`grid[i][j] = 0` 表示为水，`grid[i][j] = 0` 表示为陆地。

一个 **岛屿** 是由一些相邻的 `1` (代表土地) 构成的组合，这里的「相邻」要求两个 `1` 必须在水平或者竖直方向上相邻。找到给定的二维数组中最大的岛屿面积。如果没有岛屿，则返回面积为 `0` 。

解法：

​		`DFS`：

​		1. 找到每个岛屿的入口，从入口开始 `DFS`遍历完岛屿的面积。

​		2. `DFS`思路，DFS实际上是递归。出口是当前位置不合法，如果当前位置合法，将岛屿面积设置为1，并将当前位置加入 visited （这里将`grid[i][j] = 0`）表示当前位置被访问过。接着访问四个邻居位置。

```javascript

var maxAreaOfIsland = function(grid) {
    let m = grid.length,
        n = grid[0].length,
        result = 0;
    // 上，右，下，左 偏移量
    let dx = [-1, 0, 1, 0];
    let dy = [0, 1, 0, -1];
    // 找入口
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid[i][j] == 1) result = Math.max(result, dfs(i, j));
        }
    }
    return result;


    function dfs(x, y) {
        // 出口
        if (x < 0 || x >= m || y < 0 || y >= n || grid[x][y] == 0) return 0;

        // 处理当前合法位置
        let count = 1;
        grid[x][y] = 0; // 加入已访问过集合

        // 遍历四个邻居
        for (let i = 0; i < 4; i++) {
            count += dfs(x + dx[i], y + dy[i]);
        }
        return count;
    }
};
```

注意遍历四个位置邻居的编程技巧，利用  *dx，dy* 两个一维数组。

### [1020. 飞地的数量](https://leetcode.cn/problems/number-of-enclaves/description/)

题目：

​		给你一个大小为 `m x n` 的二进制矩阵 `grid` ，其中 `0` 表示一个海洋单元格、`1` 表示一个陆地单元格。一次 **移动** 是指从一个陆地单元格走到另一个相邻（**上、下、左、右**）的陆地单元格或跨过 `grid` 的边界。返回网格中 **无法** 在任意次数的移动中离开网格边界的陆地单元格的数量。

解法：

​		`DFS`:

1. 从矩阵最外层（边界）找到陆地，以边界陆地为入口，dfs遍历与之相连的陆地将其改为 0。
2. 统计剩下的与边界陆地不相连的为1的个数。

```javascript
var numEnclaves = function (grid) {
    let m = grid.length,
        n = grid[0].length;
    let result = 0;
    // 1. 将与边界陆地相通的陆地走过
    for (let j = 0; j < n; j++) {
        if (grid[0][j] == 1) dfs(0, j);
        if (grid[m - 1][j] == 1) dfs(m - 1, j);
    }
    for (let i = 0; i < m; i++) {
        if (grid[i][0] == 1) dfs(i, 0);
        if (grid[i][n - 1] == 1) dfs(i, n - 1);
    }
    // 2. 统计飞地的数量
    for (let i = 1; i < m - 1; i++) {
        for (let j = 1; j < n - 1; j++) {
            if (grid[i][j] == 1) result++;
        }
    }
    return result;

    function dfs(x, y) {
        // 出口
        if (x < 0 || x >= m || y < 0 || y >= n || grid[x][y] == 0) return;


        // 控制移动方向
        let dx = [-1, 0, +1, 0],
            dy = [0, 1, 0, -1];
        // 处理当前合法位置
        grid[x][y] = 0;

        // 遍历四周邻居
        for (let i = 0; i < 4; i++) {
            dfs(x + dx[i], y + dy[i]);
        }
    }
};
```

### [130. 被围绕的区域](https://leetcode.cn/problems/surrounded-regions/description/)

题目：

​		给你一个 `m x n` 的矩阵 `board` ，由若干字符 `'X'` 和 `'O'` ，找到所有被 `'X'` 围绕的区域，并将这些区域里所有的 `'O'` 用 `'X'` 填充。

解法：

​		`DFS`：

​		此题与 \[1020. 飞地的数量 ]\(1020. 飞地的数量 )思路一致，先从边界陆地入手，采用DFS记录与边界陆地相连的陆地，并记住它们的位置。将与边界陆地不相连的 `X` 改为 `O`。

```javascript
var solve = function (board) {
    let m = board.length,
        n = board[0].length;
    let visited = new Set(); // 标记

    // 1. 将与边界陆地相通的陆地走过并标记
    for (let j = 0; j < n; j++) {
        if (board[0][j] == 'O') dfs(0, j);
        if (board[m - 1][j] == 'O') dfs(m - 1, j);
    }
    for (let i = 0; i < m; i++) {
        if (board[i][0] == 'O') dfs(i, 0);
        if (board[i][n - 1] == 'O') dfs(i, n - 1);
    }
    // 2. 修改不连通的陆地
    for (let i = 1; i < m - 1; i++) {
        for (let j = 1; j < n - 1; j++) {
            if (board[i][j] == 'O' && !visited.has(i + ',' + j)) board[i][j] = 'X';
        }
    }
    return board;

    function dfs(x, y) {
        // 出口
        if (x < 0 || x >= m || y < 0 || y >= n || board[x][y] == 'X') return;


        let dx = [-1, 0, 1, 0],
            dy = [0, 1, 0, -1];
        // 处理当前合法位置
        visited.add(x + ',' + y);

        // 遍历四周邻居
        for (let i = 0; i < 4; i++) {
            let nextX = x + dx[i],
                nextY = y + dy[i];
            if (!visited.has(nextX + ',' + nextY)) dfs(nextX, nextY);
        }
    }
};
```

这题测试用例中 `O`可能成环，所以递归的时候考虑去环问题。

### [1254. 统计封闭岛屿的数目](https://leetcode.cn/problems/number-of-closed-islands/description/)

题目：

​		二维矩阵 `grid` 由 `0` （土地）和 `1` （水）组成。岛是由最大的4个方向连通的 `0` 组成的群，封闭岛是一个 `完全` 由1包围（左、上、右、下）的岛。请返回 *封闭岛屿* 的数目。

解法：

​		此题与 \[1020. 飞地的数量 ]\(1020. 飞地的数量 )思路一致，先从边界陆地入手，采用DFS将与边界陆地相连的陆地修改为 `1`.随后，统计封闭岛屿的数量，如果碰见一块陆地，则岛屿数量+1，同时将整个与之相连的陆地修改为`1`。

```javascript
var closedIsland = function (grid) {
    let m = grid.length,
        n = grid[0].length;
    let result = 0;
    // 1.走遍与边界陆地相连的陆地
    for (let j = 0; j < n; j++) {
        if (grid[0][j] == 0) dfs(0, j);
        if (grid[m - 1][j] == 0) dfs(m - 1, j);
    }
    for (let i = 0; i < m; i++) {
        if (grid[i][0] == 0) dfs(i, 0);
        if (grid[i][n - 1] == 0) dfs(i, n - 1);
    }
    // 2.统计封闭岛个数
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (grid[i][j] == 0) {
                result++;
                dfs(i, j);
            }
        }
    }
    return result;

    function dfs(x, y) {
        // 出口
        if (x < 0 || x >= m || y < 0 || y >= n || grid[x][y] == 1) return;

        let dx = [-1, 0, 1, 0],
            dy = [0, 1, 0, -1];
        // 处理当前位置
        grid[x][y] = 1;
        // 遍历邻居
        for (let i = 0; i < 4; i++) {
            dfs(x + dx[i], y + dy[i]);
        }
    }
};
```

### [1905.  统计子岛屿](https://leetcode.cn/problems/count-sub-islands/description/)

题目：

​		给你两个 m x n 的二进制矩阵 grid1 和 grid2 ，它们只包含 0 （表示水域）和 1 （表示陆地）。一个 岛屿 是由 四个方向 （水平或者竖直）上相邻的 1 组成的区域。任何矩阵以外的区域都视为水域。如果 grid2 的一个岛屿，被 grid1 的一个岛屿 完全 包含，也就是说 grid2 中该岛屿的每一个格子都被 grid1 中同一个岛屿完全包含，那么我们称 grid2 中的这个岛屿为 子岛屿 。请你返回 grid2 中 子岛屿 的 数目 。

解法：

​		`DFS`：

1. 从每个 `grrid2` 的岛屿的入口进行DFS。
2. DFS的过程是遍历整座岛屿，同时维护一个Boolean值，如果当前 `grid2[x][y]` 为陆地且 `grid1[x][y]`也为陆地，则设置初始 Boolean 值为 true，同时判断四周是否也为 true 才能判断当前陆地是 grid1的子集。
   *注意，在DFS一座岛屿过程中，某一块陆地可能为false，这时候已经能确定grid2的这座岛屿不是子岛屿，但必须将这座岛屿BFS完成，防止将一座完整的岛屿分割BFS。*

```javascript
var countSubIslands = function(grid1, grid2) {
    let m = grid2.length,
        n = grid2[0].length;
    let result = 0;
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (grid2[i][j] == 1) dfs(i, j) && result++;
        }
    }
    return result;

    function dfs(x, y) {
        // 出口
        if (x < 0 || x >= m || y < 0 || y >= n || grid2[x][y] == 0) return true;
        if (grid2[x][y] == 'V') return true;

        let dx = [-1, 0, 1, 0],
            dy = [0, 1, 0, -1];
        // 处理当前位置
        let isSub = grid1[x][y] == 1 ? true : false;
        grid2[x][y] = 'V';
        // 遍历四周邻居
        for (let i = 0; i < 4; i++) {
            isSub = dfs(x + dx[i], y + dy[i]) && isSub;
        }
        return isSub;
    }
};
```

## 2. 其他

### [785. 判断二分图](https://leetcode.cn/problems/is-graph-bipartite/description/)

题目：

​		存在一个 无向图 ，图中有 n 个节点。其中每个节点都有一个介于 0 到 n - 1 之间的唯一编号。给你一个二维数组 graph ，其中 graph\[u] 是一个节点数组，由节点 u 的邻接节点组成。graph是无向图的邻接矩阵。判断这个无向图是否是一个二分图。

​		二分图 定义：如果能将一个图的节点集合分割成两个独立的子集 A 和 B ，并使图中的每一条边的两个节点一个来自 A 集合，一个来自 B 集合，就将这个图称为 二分图 。

解法：

​		`DFS`：

1. 由于无向图存在多个连通分量，找到所有连通分量并从该连通分量的任一入口进行DFS。
2. 在DFS过程对节点进行分组，节点有两种状态 `已分组` 和 `未分组`。DFS传入两个参数  *当前节点索引*  和  *该节点应该分到组的标识* 。如果该节点 `已分组`，则比较该节点的 *已经分好组的标识* 和 *应该分到组的标识*；如果该节点未分组，则将该节点划分入应该被分到的组中，并对其邻居进行递归。只有所有节点被划分到正确的组中，该连通分量才是一个二分图。

```javascript
var isBipartite = function (graph) {
    let divide = new Array(graph.length).fill(0); // 记录0~n-1号节点的分组：0表示未分组，true为一组，false为另一组
    // 1. 由于存在多个连通分量，从连通分量的任意入口dfs该连通分量
    for (let i = 0; i < graph.length; i++) {
        if (divide[i] === 0 && !dfs(i, true)) return false;
    }
    return true;

    function dfs(v, flag) {
        // 出口：当前节点已经分组
        if (divide[v] !== 0) return divide[v] == flag;

        let oppFlag = !flag,
            result = true;
        // 处理当前节点
        divide[v] = flag;
        // 处理其邻居节点
        for (let i = 0; i < graph[v].length; i++) {
            result = dfs(graph[v][i], oppFlag) && result;
        }
        return result;
    }
};
```

### [797. 所有可能路径](https://leetcode.cn/problems/all-paths-from-source-to-target/description/)

题目：

​		给你一个有 `n` 个节点的 **有向无环图（DAG）**，请你找出所有从节点 `0` 到节点 `n-1` 的路径并输出（**不要求按特定顺序**）。

思路：

​		根据题意，遍历的是一个有向无环图，所以并不用考虑用 visited 记录走过位置避免成环。采用最简单的DFS：从起点遍历到终点，记录选择的每一步，出口是走到终点。因为这里求的不是最短路径而是所有路径，所以必须回溯所有可能的情况。

```javascript
var allPathsSourceTarget = function (graph) {
    let path = [0],
        result = [];
    dfs(0);
    return result;

    function dfs(startIndex) {
        // 出口
        if (startIndex == graph.length - 1) return result.push([...path]);

        for (let i = 0; i < graph[startIndex].length; i++) {
            // 选择
            path.push(graph[startIndex][i]);
            // 递归
            dfs(graph[startIndex][i]);
            // 取消选择
            path.pop();
        }
    }
};
```

### [399. 除法求值](https://leetcode.cn/problems/evaluate-division/description/)

题目：

​		给一些已知结果的等式：a / b = 2.0，b / c = 3.0，求 a / c，b / a的结果；如果计算不出，比如 x / x，则结果为- 1。

解法：

1. 根据已知的等式结果构建几张带权无向图。
2. 对于一个等式，有三种情况：
   （1）起点和终点都不在图中，比如 x / x 无法通过 a / b =2.0，b / c= 3.0构成的无向图求出，结果为-1.0。
   （2）起点和终点是同一个值，比如 a / a，结果为1.0。
   （3）起点和终点都在图中，`DFS` 查找是否有起点 -> 终点的一条路径。可能找到一条路径：比如 a / c，以a为起点，c为终点对无向图进行DFS，查找到 a -> c = a -> b -> c = 2.0 \* 3.0 = 6.0。也有可能起点和终点不属于同一张无向图，导致找不到路径：比如 a / b =2.0，b / c = 3.0，d / e = 1.0，找不到 a -> e 的一条路径，所以 a / e = -1.0。

```javascript
var calcEquation = function (equations, values, queries) {
    // 1.用邻接链表建立多个带权无向图
    let graph = {};
    for (let i = 0; i < equations.length; i++) {
        let u = equations[i][0],
            v = equations[i][1];
        if (!graph[u]) graph[u] = {};
        graph[u][v] = values[i];
        if (!graph[v]) graph[v] = {};
        graph[v][u] = 1 / values[i];
    }
    // 2.查找是否有起点至终点的一条路径
    let path = [],
        visited = [],
        start = '',
        end = '',
        findPath = [];
    let result = [];

    for (let i = 0; i < queries.length; i++) {
        start = queries[i][0], end = queries[i][1], path = [], visited = [], findPath = [];
        if (!graph[start] || !graph[end]) {
            // 起点或终点不在无向图中
            result.push(-1.0);
        } else if (start == end) {
            // 起点 == 终点
            result.push(1.0);
        } else {
            dfs(start, end);
            let ans = findPath.length ? findPath.reduce((pre, cur) => pre * cur) : -1.0;
            result.push(ans);
        }
    }

    return result;

    function dfs(start) {
        // 出口
        if (start == end) return findPath = [...path];
        if (!graph[start]) return;

        for (let key in graph[start]) {
            // 选择
            path.push(graph[start][key]);
            visited.push(start);
            // 递归
            if (visited.indexOf(key) == -1) dfs(key);
            // 取消选择
            path.pop();
            visited.pop();
        }
    }
};
```

### 多入口最短路径

```javascript
    function shortPath(matrix) {
        let m = matrix.length, n = matrix[0].length;
        // 1.找到多入口和出口坐标
        let entry = [], out = [0, 0];
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < n; j++) {
                if (matrix[i][j] == 8) {
                    out[0] = i, out[1] = j;
                }
                if (j == 0 || j == n - 1 || i == 0 || i == m - 1) {
                    if (matrix[i][j] == 0) {
                        entry.push([i, j]);
                    }
                }
            }
        }
        // 2. 找到多入口的所有路径
        let visited = new Array(m).fill().map(item => new Array(n).fill(false));
        let dx = [-1, 0, 1, 0], dy = [0, 1, 0, -1];
        let path = [], paths = [];
        let allPath = [];
        for (let i = 0; i < entry.length; i++) {
            initVisited(), path = [], paths = [];
            // 找到所有路径
            DFS(entry[i]);
            allPath.push(...paths);
        }
        // 3.找到所有路径的最短路径
        let res = [];
        for (let i = 0; i < allPath.length; i++) {
            if (res.length === 0 || allPath[i].length < res.length) res = allPath[i];
        }

        res = res.map(item => '(' + item[0] + ',' + item[1] + ')');

        return res;


        function DFS(start) {
            // 找到所有路径
            let x = start[0], y = start[1];
            if (x < 0 || x >= m || y < 0 || y >= n || visited[x][y] || matrix[x][y] === 1) return;
            if (x === out[0] && y === out[1]) {
                paths.push([...path, out]);
            }


            path.push(start), visited[x][y] = true;
            for (let i = 0; i < 4; i++) {
                let nextX = x + dx[i], nextY = y + dy[i];
                DFS([nextX, nextY]);
            }
            path.pop(), visited[x][y] = false;
        }

        function initVisited() {
            for (let i = 0; i < m; i++) {
                for (let j = 0; j < n; j++) {
                    visited[i][j] = false;
                }
            }
        }
    }
```

## BFS

BFS模板

```javascript
function BFS(start,target){
    let que = new Array(); 
    let visited = new Set(); // 记录走过的节点，防止走回头路
    let step = 0; // 记录扩散步数
    
    // 将起点加入队列
    que.push(start), visited.add(start);
    
    while(que.length){
        let sz = que.length; // 当前层节点个数
        for(let i = 0; i< sz; i++){
            let cur = que.shift();
            // 划重点：这里判断是否到达终点
            if(cur is target) return step;
            // 如果不是终点，将当前节点的扩散，作为下一层节点
            for(neighbor of cur){
                if( !visited.has(neighbor) ) que.push(neighbor), visited.add(neighbor);
            }
        }
      // 划重点：更新步数在这里
        step++;
    }
    
}
```

## 1. 拓扑排序

### [210. 课程表Ⅱ](https://leetcode.cn/problems/course-schedule-ii/description/)

题目：

​		现在你总共有 numCourses 门课需要选，记为 0 到 numCourses - 1。给你一个数组 prerequisites ，其中 prerequisites\[i] = \[ai, bi] ，表示在选修课程 ai前必须先选修 bi。

例如，想要学习课程 0 ，你需要先完成课程 1 ，我们用一个匹配来表示：\[0,1] 。
返回你为了学完所有课程所安排的学习顺序。可能会有多个正确的顺序，你只要返回 任意一种 就可以了。如果不可能完成所有课程，返回 一个空数组 。

思路：

```纯文本
  1. 利用邻接链表记录有向图，在构图过程中记录每个节点的入度。
  1. 对有向图进行 `BFS`，每次遍历从图中删除入度为 0 的节点，并更新其邻居节点的入度。一旦邻居节点的入度为0，将其入队并从图中删除。不需要用 **visited** 记录删除的节点避免环路，**如果存在环路，最后的结果集 !== 图中节点个数**。
```

```javascript
var findOrder = function (numCourses, prerequisites) {

    let indegree = new Array(numCourses).fill(0);
    let graph = new Array(numCourses).fill().map(item => []);
    // 1. 用邻接链表表示一个有向图并记录每个节点的入度数
    for (let i = 0; i < prerequisites.length; i++) {
        let u = prerequisites[i][1],
            v = prerequisites[i][0];
        // 构造有向边
        graph[u].push(v);
        // 记录入度
        indegree[v]++;
    }
    let result = bfs();
    return result.length == numCourses ? result : [];


    function bfs() {
        let que = new Array();
        let result = [];
        // 寻找入度为0的节点作为起始节点
        for (let i = 0; i < indegree.length; i++) {
            if (indegree[i] == 0) {
                que.push(i);
            }
        }

        while (que.length) {
            let sz = que.length;
            for (let i = 0; i < sz; i++) {
                let cur = que.shift();
                result.push(cur);
                // 遍历邻居
                for (let j = 0; j < graph[cur].length; j++) {
                    let nei = graph[cur][j];
                    // 减少入度
                    if (--indegree[nei] == 0) que.push(nei);
                }
            }
        }
        return result;
    }
};
```

参考：[拓扑排序](https://segmentfault.com/a/1190000024451421)

## 2. 其他

### [542. 01矩阵](https://leetcode.cn/problems/01-matrix/description/)

题目：

​		给定一个由 0 和 1 组成的矩阵 mat ，请输出一个大小相同的矩阵，其中每一个格子是 mat 中对应位置元素到最近的 0 的距离。两个相邻元素间的距离为 1 。

解法：

​		`BFS`：

​		思路一：遍历mat矩阵，以每个矩阵节点为起点进行BFS，求其到 0 的最短路径。这样做会超时。

​		思路二：遍历mat矩阵，以矩阵中所有值为 0 的节点为起点进行BFS，第一层的值为1，第二层的值为2，...以此类推，直到遍历完矩阵中所有节点。这种解法可用于求解：多个源节点至一个目的节点的最短路径？BFS队列中起始节点不再是一个源节点，而是多个源节点。

```javascript
var updateMatrix = function (mat) {
    let m = mat.length,
        n = mat[0].length;
    let result = new Array(m).fill().map(item => new Array(n).fill(0));
    let start = [];
    for (let i = 0; i < m; i++) {
        for (let j = 0; j < n; j++) {
            if (mat[i][j] == 0) start.push([i, j]);
        }
    }
    bfs(start);
    return result;

    function bfs(start) {
        let que = new Array();
        let visited = new Set();
        let step = 0;

        // 将多个起点加入队列
        que.push(...start);
        start.forEach(item => visited.add(item[0] + ',' + item[1]));

        while (que.length) {
            // 记录当前层个数
            let sz = que.length;
            // 处理当前层节点
            for (let i = 0; i < sz; i++) {
                let cur = que.shift();
                // 判断是否为终点
                result[cur[0]][cur[1]] = step;
                // 扩散
                let dx = [-1, 0, 1, 0],
                    dy = [0, 1, 0, -1];
                for (let j = 0; j < 4; j++) {
                    let nextPos = [cur[0] + dx[j], cur[1] + dy[j]];
                    if (nextPos[0] >= 0 && nextPos[0] < m && nextPos[1] >= 0 && nextPos[1] < n) {
                        if (!visited.has(nextPos[0] + ',' + nextPos[1])) {
                            que.push(nextPos), visited.add(nextPos[0] + ',' + nextPos[1]);
                        }
                    }
                }
            }
            // 更新层数
            step++;
        }
    }
};
```
