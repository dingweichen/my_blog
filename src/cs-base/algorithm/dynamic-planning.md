# 动态规划

## 1. 算法模板

```javascript
1. dp数组及下标的含义
2. 递推公式（转移方程）
3. dp数组的初始化
4. dp数组遍历顺序
5. 打印dp数组
```

## 2. 基础问题

### [256. 粉刷房子](https://leetcode.cn/problems/paint-house/description/)

题目：

​			给一个长度为n的二维数组costs，表示有n个连着的房子。costs \[i] 是一个三元组，表示给房子粉刷三种颜色红、蓝、绿的花费。要求两两房子之间不能染同一种颜色，求粉刷完所有房子的最少花费成本。

​			costs = \[ \[17, 2, 17]，\[16, 16, 5]，\[14, 3, 19]]，0号房子粉刷蓝色costs\[0]取2，1号房子粉刷绿色costs\[1]取5，2号房子粉刷蓝色costs\[2]取3。

解法：

1. dp\[i] 是截至到第 i 个房子的最少花费成本，为一个三元组 dp \[ i ] \[0] 、 dp \[ i ] \[1]、 dp \[ i ] \[2] 分别对应红、蓝、绿。
2. 转移方程：对于每间房子有三种选择：红、蓝、绿色。对于红色 dp\[ i ] \[ 0 ] = min (dp \[ i-1 ] \[1]，dp\[ i-1 ] \[2])+ costs\[ i ] \[ 0 ]，即粉刷成当前颜色所需总花费 = 粉刷第i个房子成当前颜色花费 + 粉刷第 i -1 个房子成其他两种颜色的最小花费，其他两种颜色类似。
3. dp数组初始化：dp\[0] = \[ costs\[0] \[0]，costs\[0] \[1]，cost\[0] \[2] ]。
4. 遍历：1 -> dp.length-1 顺序遍历。

```javascript
var minCost = function(costs) {
    let dp = new Array(costs.length).fill().map(item => new Array(3).fill(0));
    dp[0][0] = costs[0][0], dp[0][1] = costs[0][1], dp[0][2] = costs[0][2];
    for (let i = 1; i < dp.length; i++) {
        dp[i][0] = costs[i][0] + Math.min(dp[i - 1][1], dp[i - 1][2]);
        dp[i][1] = costs[i][1] + Math.min(dp[i - 1][0], dp[i - 1][2]);
        dp[i][2] = costs[i][2] + Math.min(dp[i - 1][0], dp[i - 1][1]);
    }
    return Math.min(dp[dp.length - 1][0], dp[dp.length - 1][1], dp[dp.length - 1][2]);
};
```

### [926. 将字符串反转到单调递增](https://leetcode.cn/problems/flip-string-to-monotone-increasing/description/)

题目：

​		有一个由 0 和 1 组成的字符串，可以将任何 0 翻转为 1 ，或者 1 翻转为 0，使得字符串单调递增。字符串单调递增的形式，如 *00000* 或 *00011*。求最小的翻转次数。

​		00110 ，最后一位0翻转为 1 => 00111。最小翻转次数为1。

解法：

1. dp\[i]为一个二元组，dp\[i] \[0] 表示当前形式为 *00000* 的所需最小翻转次数，dp\[i] \[1] 表示当前形式为 00011 的所需最小翻转次数。
2. 转移方程：对于每个字符 s\[i] 有两种选择，保持当前形式为 *00000* 或为 *00011*。根据情况进行分类讨论：
   **s\[i] = 0**, 那么 dp\[i] \[0] = dp\[i-1] \[0], 即由 000 => 0000; 那么dp\[i] \[1] = min(dp\[i-1] \[0], dp\[i-1] \[1]) + 1 **（这里需要将0翻转为1）**, 即由 000 => 0001 或者 001 => 0011，两者中取小。
   **s\[i] = 1**, 那么 dp\[i] \[0] = dp\[i-1] \[0] + 1 **（这里需要将1翻转为0）**, 即由 000 => 0000；那么 dp\[i] \[1] = min(dp\[i-1] \[0], dp\[i-1] \[1]) ，即由 000 => 0001 或者 001 => 0011，两者中取小。
3. dp数组初始化：根据情况进行分类讨论：
   **s\[0] = 0**, dp\[0] \[0] = 0, dp\[0] \[1] = 1。
   **s\[0] = 1**, dp\[0] \[0] = 1, dp\[0] \[1] = 0。
4. 遍历：1 -> dp.length-1 顺序遍历。

```javascript
var minFlipsMonoIncr = function(s) {
    let dp = new Array(s.length).fill().map(item => new Array(2).fill(0));
    // 初始化
    if (s[0] == 0) dp[0][0] = 0, dp[0][1] = 1;
    else dp[0][0] = 1, dp[0][1] = 0;
    // 状态转移
    for (let i = 1; i < dp.length; i++) {
        if (s[i] == 0) {
            dp[i][0] = dp[i - 1][0];
            dp[i][1] = Math.min(dp[i - 1][0], dp[i - 1][1]) + 1;
        } else {
            dp[i][0] = dp[i - 1][0] + 1;
            dp[i][1] = Math.min(dp[i - 1][0], dp[i - 1][1]);
        }
    }
    return Math.min(dp[dp.length - 1][0], dp[dp.length - 1][1]);
};
```

### [983. 最低票价](https://leetcode.cn/problems/minimum-cost-for-tickets/description/)

​		动态转移方程：`dp[i] = dp[i-1] ` ( 当天没有旅行计划)，`dp[i]=min(dp[i-1]+cost[0],dp[i-7]+cost[1],dp[i-30]+cost[2])` (当天有旅行计划)。

​		转移方程的推导（贪心思想）：如果当天没有旅行计划则不需要花费，故 dp\[i] = dp\[i-1]。 如果当前有旅行计划，则有三种选择：花费 cost\[0] 买时长为1天的票，花费cost\[1]买时长为7天的票，花费cost\[2]买时长为30天的票。根据这个原理进行倒推，得到 `dp[i]=min(dp[i-1]+cost[0],dp[i-7]+cost[1],dp[i-30]+cost[2])` 。

## 3. 背包问题

### 《0-1 背包问题》

问题：

​	有n种物品，每种物品有 *重量* 和 *价值*，在给定背包容量的 情况下，求能够获取的最大价值。0-1背包的特点是 **每种物品数量只有一个**。

​	比如：weight = \[1, 3, 5], value = \[15, 20, 30]。背包容量 c =  4，result = 35。即拿物品1 和 物品 2。

解法：

1. dp数组的含义：这里dp数组是一个二维数组，其中 i 表示的是物品的编号，j 表示的是背包的容量。以上面示例为例：dp\[1] \[3]，意思是物品编号为 \[0,1] 且容量为 3 的情况下能装下物品的最大价值dp \[1] \[3]； 整个问题的物品编号为 \[0,1,2]且容量为4，最大价值为dp \[2] \[4]。dp\[1] \[3]实际上是 dp\[2] \[4]的一个子问题。
2. 转移方程：对于每个物品 i，有两种选择：放入背包 or 不放入背包。

**不放入背包：** 那么当前背包最大价值就是取 编号为\[0, ... ,i-1]，容量为 j 的 情况下的最大价值 即 dp\[i-1] \[j]

​**放入背包：** 已知 dp\[i-1] \[j], 此时容量为j。如果想放入物品 i ，则必须先减去 物品 i 的重量 => j - weight\[i], 然后在 dp\[i-1] \[j -  weight\[i]] 的基础上，加上 物品i 的价值 => dp \[i-1] \[ j - weight\[i] ] + value\[i]。

​		所以转移方程为：dp\[i] \[j]  = max ( dp\[i-1] \[j], dp \[i-1] \[ j - weight\[i] ] + value\[i] )。

1. 初始化：
   第一行：dp\[0] \[j] 表示只有一个物品0，而背包容量 j 从 0 -> c。如果 j > weight\[0], 说明此时背包能放下物品0，dp\[0] \[j] 初始化为value\[0]；反之，dp\[0] \[j] 初始化为 0。
   第一列：dp\[i] \[0] 表示有 物品 0 \~ i , 而背包容量始终为0。由于不能放入物品，所有dp\[i] \[0] 都初始化为 0。
2. 遍历顺序：从 dp\[1] \[1] 行序遍历 至 dp\[m-1] \[n-1]。（m为物品的个数，n为背包的最大容量c+1）。

```javascript
function bag01(weight, value, size) {
    let m = weight.length,
        n = size + 1;
    let dp = new Array(m).fill().map(item => new Array(n).fill(0));
    // 初始化
    for (let j = 0; j < n; j++) {
        if (j >= weight[0]) dp[0][j] = value[0];
    }
    // 状态转移
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            if (j < weight[i]) {
                // 不能放下
                dp[i][j] = dp[i - 1][j];
            } else {
                // 能放下
                dp[i][j] = Math.max(dp[i - 1][j], dp[i - 1][j - weight[i]] + value[i]);
            }
        }
    }
    return dp[m - 1][n - 1];
}
```

上面的解法可以通过**一维数组** (滚动数组) 实现：

1. dp数组的含义：这里dp数组是一个一维数组，j表示的是背包的容量，dp\[j] 表示的是当前容量下能获取物品的最大价值。
2. 转移方程：由于更新前 dp\[j] 实际上是 二维数组中的 dp\[i-1] \[j] ,所以这里只要考虑在能放下物品 i 的情况下，能获取的最大价值。即 当 j > weight\[i]， dp \[j] = max(dp\[j], dp\[ j - weight\[i] ]+  value\[i]) 。
3. 初始化：dp\[0] = 0, 即背包容量为0时最大价值为0。其他dp\[j] =0。
4. 遍历顺序：这里遍历顺序十分考究。首先，因为是将二维数组dp\[i] \[j] 压缩为 dp\[j]，计算当前dp \[i] \[j] 的值需要上一层 dp \[i-1] \[j] 的值，**所以应该先从 i （ 物品0 -> 物品 N）开始遍历，再从背包 j 开始遍历**，N为最后一个物品的编号。那么，j （背包容量）是从 0开始，还是从最大容量c 开始呢？观察转移方程，dp\[i] \[j] 的计算需要 上一层 dp\[i-1] \[j] 或者 dp\[i-1] \[j - weight\[i]], 即 需要当前列和当前列左边列的 dp\[i-1] \[j]。如果 j 从 0 开始，那么就会覆盖上一层 的dp \[ i-1 ] \[j]，导致同一个物品可以被放入多次。所以 j 应该从 size 开始，直到 weight\[i]；因为如果 j < weight\[i]，则dp\[j] = dp\[i-1] \[j]，相当于不进行更新。

<div align="center"> <img src="http://dwc-images-store.oss-cn-beijing.aliyuncs.com/images/image-20220414104309552_hfJAN7Hc9R.png"/> </div>

```javascript
function bag01(weight, value, size) {
    // 初始化   
    let dp = new Array(size + 1).fill(0);
    // 状态转移
    for (let i = 0; i < weight.length; i++) {
        for (let j = size; j >= weight[i]; j--) {
            // 能放下
            dp[j] = Math.max(dp[j], dp[j - weight[i]] + value[i]);
        }
    }
    return dp[size];
}
```

### [494. 目标和](https://leetcode.cn/problems/target-sum/description/)

题目：

​	给一个整数数组 nums 和 一个目标和 target，向数组中的每个整数前添加 + 或 - ，串联起来构成一个表达式，求上述方法构造的、运算结果等于 target的不同表达式的数目。

​			nums = \[1,1,1,1,1], target = 3。result = 5。构造的5中表达式为：

```纯文本
                  -1 + 1 + 1 + 1 + 1 = 3
                  +1 - 1 + 1 + 1 + 1 = 3
                  +1 + 1 - 1 + 1 + 1 = 3
                  +1 + 1 + 1 - 1 + 1 = 3
                  +1 + 1 + 1 + 1 - 1 = 3
```

解法：

​		首先通过推理转化成一个 0-1背包问题，假设nums中前面带 `+` 的所有元素绝对值和为sumP，带` -` 的所有元素绝对值和为sumN，nums所有元素的绝对值和为sum。显然有第一个等式 sumP + sumN = sum （1）成立；如果表达式和为 target，则有第二个等式 sumP - sumN = target  （2）成立。

​		联合（1）（2）可以得到 sumP = （sum + target）/ 2 。即如果在nums中所有元素前加 `+` 或 `-`，并使得表达式和为 target 成立，必须满足带 `+` 号的那些元素和为 （sum + target）/ 2 。此问题转化为这样一个问题：

​		**从nums数组中选取一部分元素，且每个元素只能被选择一次，使得它们的和为 （sum + target）/ 2 ，有几种组合方式？**

​		**或者说nums数组表示一些物品的重量（weights），且每个物品只有一个，背包容量为（sum + target）/ 2 ，有几种选物品的方式使背包装满？**

​		这样问题就转化成了一个 0-1背包。首先排除一些意外条件：

```javascript
1. sum + target 为奇数，则(sum + targert) / 2 为小数，从nums找不到子数组和为小数，return0；
2. abs（target）> sum, 即目标值超出了数组求和能取得的最大范围，return 0；
```

采用0-1背包问题一维滚动数组写法：

1. dp数组的含义：dp\[j] ，目标和为 j 的子数组的个数， 0<= j <= （sum + target）/ 2 。
2. 转移方程：
   二维数组：i 表示的是nums的索引，例如在 \[1, 1, 1] 中找和为2的子数组 => dp \[2] \[2], 当前 nums\[2] = 1。如果不将 nums \[2] 加入子数组，则结果为 dp\[1] \[2] (子问题为：在 \[1,1] 中找和为 2 的子数组)；如果将 nums\[2] 加入子数组，则结果为 dp\[1] \[2 - nums\[2]] (子问题为：在 \[1,1] 中找和为 2 - nums\[2] 的子数组)。
   j < nums\[i],  dp\[i] \[j] = dp\[i-1] \[ j ].
   j >= nums\[i], dp \[i] \[j] =  dp\[ i-1 ] \[ j ] + dp\[ i-1 ] \[ j - nums\[i] ].
   一维数组：
   j < nums\[i], dp\[ j ] = dp\[ j ].
   j >= nums\[i], **dp\[ j ] = dp\[ j ] + dp \[ j - nums\[ i ] ]**.
3. 初始化：dp\[0] = 1, 即目标和为 0 的默认有一种，那就是子数组为 \[]。
4. 遍历顺序：从 i （nums\[0] -> nums\[N]）开始遍历，再从 j  （ （sum + target）/ 2  -> nums \[ i ]  ）开始遍历。N为nums的最后一个元素索引。

```javascript
var findTargetSumWays = function(nums, target) {
    let sum = nums.reduce((pre, cur) => pre + cur);
    if (Math.abs(target) > sum) return 0;
    target = sum + target;
    if (target % 2) return 0;
    target = target >> 1;

    let dp = new Array(target + 1).fill(0);
    // 初始化
    dp[0] = 1;
    // 状态转移
    for (let i = 0; i < nums.length; i++) {
        for (let j = target; j >= nums[i]; j--) {
            dp[j] += dp[j - nums[i]];
        }
    }
    return dp[target];
};
```

### [416. 分割等和子集](https://leetcode.cn/problems/partition-equal-subset-sum/description/)

题目：

​			给一个 只包含正整数的非空数组。请你判断是否可以将这个数组分割成两个子集，使得两个子集的元素和相等。

解法：

​			此问题等价于这样一个0-1背包问题：

​			**从nums数组中选取一部分元素，且每个元素只能被选择一次，使他们的和最接近于 sum / 2。**

​			**或者说nums数组表示一些物品的重量（weights），且每个物品只有一个，背包容量为 sum / 2, 求可以装的物品的最大重量dp\[halfSum]。** 如果 dp\[halfSum] ==  sum / 2，则返回true，表示可以等分数组，反之返回false，表示不能等分数组

采用0-1背包问题一维滚动数组写法：这里 value == weight == nums，即 **物品的价值与其重量相等**。

1. dp数组的含义：dp\[j] 表示背包能装物品的最大价值，0 <= j <= floor( sum / 2 ) 。
2. 转移方程：
   j < nums \[ i ], 说明背包不能放下当前物品，dp\[j] = dp\[j]
   j >= nums\[ i ], 说明背包能放下当前物品，可以选择放或者不放，dp\[ j ] = max( dp\[j]（不放）, dp\[ j - nums\[i] ] + nums\[i] )。
3. 初始化：当 j=0，说明背包容量为0，此时 dp\[ 0 ] = 0。
4. 遍历顺序：从 i （nums \[ 0 ] -> nums \[ N ] ）开始遍历，再从 j （ floor( sum / 2 )  -> nums\[ i ] ）开始遍历。N为最后一个物品的编号。

```javascript
var canPartition = function (nums) {
    let sum = nums.reduce((pre, cur) => pre + cur);
    if (sum % 2) return false;
    let halfSum = sum >> 1;

    // 初始化
    let dp = new Array(halfSum + 1).fill().map((item) => {
        return {
            value: 0,
            subArr: [],
        }
    });
    // 状态转移
    for (let i = 0; i < nums.length; i++) {
        for (let j = halfSum; j >= nums[i]; j--) {
            let putItme = dp[j - nums[i]]['value'] + nums[i];
            // 可以放下，且选择放下
            if (putItme > dp[j]['value']) {
                dp[j]['value'] = putItme;
                dp[j]['subArr'].push(nums[i]);
            }
        }
    }
    return dp[halfSum]['value'] == halfSum;
};
```

​		上面代码考虑有些题目不仅仅要求判断能否分割（true or false），还要求分割方法。所以dp 是一个对象数组，其中 value表示的是 dp\[j]容量下获取的最大价值，而 item 表示的是获得该最大价值下所选取的物品的重量。

### [419. 最后一块石头的重量Ⅱ](https://leetcode.cn/problems/last-stone-weight-ii/description/)

题目：

​		用一堆石头，整数数组 stones 表示石头的重量。每一回合，从中选出任意两块石头，然后将它们一起粉碎，剩下石头重量为 y-x，放入stones中。待石头进行两两碰撞后，最多只会剩下一块石头，求这块剩下石头的最小重量。如果没有石头剩下，则返回0。

解法：

​		先解释如何转化为0-1背包问题，无论将石头如何拿出进行两两消除，最终都是将石头分为两堆，一堆前面为`+`号，一堆前面为 `-` 号 [参考](https://leetcode-cn.com/problems/last-stone-weight-ii/solution/gong-shui-san-xie-xiang-jie-wei-he-neng-jgxik/ "参考")。 设前面为 `+` 号的石头重量和为 sumP，前面为 `-`号的石头重量和为 sumN，则剩下那块石头的重量为 target = sumP - sumN （1）。假设所有石头的总重量，即stones数组的和为 sum，则有 sum = sumP + sumN （2）。根据 （1）（2），可以推出 target = 2sumP - sum。如果要取得target最小，则sumP应该尽可能接近 sum/2。即在stones中取一些数 组成子数组，它们前面的符号为  `+`, 使得子数组的和接近于 sum / 2。此问题转化为这样一个问题：

​		**从nums数组中选取一部分元素，且每个元素只能被选择一次，使他们的和最接近于 sum / 2**

​		**或者说nums数组表示一些物品的重量（weights），且每个物品只有一个，背包容量为 sum / 2, 求可以装的物品的最大重量dp\[halfSum]。** target即是 sum - 2\*dp\[halfSum]

采用 0-1 背包问题一维滚动数组写法：**物品的价值与其重量相等**

1. dp数组的含义：dp\[j] 背包能装物品的最大价值，0 <= j <= floor( sum / 2 )。
2. 转移方程：
   j < stones\[i], 说明背包放不下当前石头，dp\[j] = dp\[j]
   j >= stones\[i], 说明背包能放下当前石头，现在是选择 放 or 不放 dp \[j] = dp\[ j- stones\[i] ] + stones\[ i ]
3. 初始化：当 j=0，说明背包容量为0，此时 dp\[ 0 ] = 0。
4. 遍历顺序：从 i （stones\[ 0 ] -> stones \[ N ] ）开始遍历，再从 j （ sum/2 -> stones\[i] ）开始遍历。N为最后一块石头索引。

```javascript
var lastStoneWeightII = function(stones) {
    let sum = stones.reduce((pre, cur) => pre + cur);
    let halfSum = Math.floor(sum / 2);
  
    // 初始化
    let dp = new Array(sum + 1).fill(0);
    // 状态转移
    for (let i = 0; i < stones.length; i++) {
        for (let j = halfSum; j >= stones[i]; j--) {
            dp[j] = Math.max(dp[j], dp[j - stones[i]] + stones[i]);
        }
    }
    return sum - 2 * dp[halfSum];
};
```

### [471. 一和零](https://leetcode.cn/problems/ones-and-zeroes/description/)

题目：

​			给你一个二进制字符串数组 strs 和两个整数 m 和 n。请你找出并返回 strs 的最大子集的长度， 该子集中最多有 m 个 0 和 n 个 1 。

```javascript
输入：strs = ["10", "0001", "111001", "1", "0"], m = 5, n = 3
输出：4
解释：最多有 5 个 0 和 3 个 1 的最大子集是 {"10","0001","1","0"} ，因此答案是 4 。
其他满足题意但较小的子集包括 {"0001","1"} 和 {"10","1","0"} 。{"111001"} 不满足题意，因为它含 4 个 1 ，大于 n 的值 3 。
```

解法：

​			这是一个 0-1 背包问题，不过有两个背包 m 和 n。对于每个字符 strs \[ k ]，它  0 的个数得  <= n, 1的个数得 <= m，这时背包可以选择放入 strs\[k] 与否。

1. dp数组的含义：dp \[i] \[j]，0 <= i <=m, 0 <= j <= n。表示当0的个数不能超过 i，1的个数不能超过 j 的情况下，所能放入 strs \[ k ]的最大个数。
2. 转移方程：
   zero <=i ( 当前字符串strs \[ k ]包含 0 的个数 zero ) && one <= j （当前字符串strs \[ k ]包含 1 的个数 one），说明当前字符串 strs \[ k ] 能放入背包中：
   ​			dp \[ i ] \[ j ] = max ( dp\[ i ] \[ j ]，dp \[ i - zero ] \[ j -  one ] + 1 )
   zero >i || one >j ，说明当前字符串 strs \[ k ] 不能放入背包中：
   ​			dp \[ i ] \[ j ] = dp \[ i ] \[ j ]
3. 初始化：
   当 i = 0 && j = 0时，说明两个背包都为空，dp \[ 0 ] \[ 0 ] = 0。
4. 遍历顺序：
    先遍历物品 k ( 0 <= k <= strs.length), 再遍历背包。由于采用的是滚动数组，像一维数组那样从后往前遍历，从右下角到左上角。（ 1<= i <= m, 1 <= j <= n ）。

```javascript
var findMaxForm = function (strs, m, n) {
    let dp = new Array(m + 1).fill().map(item => new Array(n + 1).fill(0));
    // 状态转移
    for (let k = 0; k < strs.length; k++) {
        let countO1 = statis01(strs[k]);
        for (let i = m; i >= countO1[0]; i--) {
            for (let j = n; j >= countO1[1]; j--) {
                // 能放下当前strs[k]
                dp[i][j] = Math.max(dp[i][j], dp[i - countO1[0]][j - countO1[1]] + 1);
            }
        }
    }
    return dp[m][n];

    // 工具函数：统计字符串0的个数和1的个数
    function statis01(str) {
        let result = [0, 0];
        for (let i = 0; i < str.length; i++) {
            str[i] == '0' ? result[0]++ : result[1]++;
        }
        return result;
    }
};
```

### 《 完全背包问题 》

问题：

​	有n种物品，每种物品有 *重量* 和 *价值*，在给定背包容量的 情况下，求能够获取的最大价值。完全背包的特点是 **每种物品数量有无数个**。

​	比如：weight = \[1, 3, 5], value = \[15, 20, 30]。背包容量 c =  4，result = 60。即拿 4 个物品1。

解法：

​	思路与 0-1 背包一致，判断当前物品 i 能否被容量为 j 的背包放下，根据 放入当前物品 i or 不放入当前物品 i 进行状态转移分析。采用一维滚动数组：

1. dp数组的含义：j 表示的是背包的容量, dp\[j] 表示的是当前容量下能获取物品的最大价值。
2. 转移方程：
   ​		weight \[ i ] <  j, dp\[ j ] = dp \[ j ].
   ​		weight\[ i ] >= j, dp \[ j ] = max ( dp\[ j ], dp \[ j - weight\[ i ] ] + value \[ i ] )
3. 初始化：背包容量为0时，能获取的最大价值为0，dp \[ 0 ] = 0.
4. 遍历顺序：**完全背包与0-1背包唯一的不同在于遍历顺序**，0-1背包**从后往前**遍历 ( size 背包容量-> weight \[ i ]  )，因为物品 i 只有一个，如果 j 从 weight \[ i ] -> size 开始遍历，每次都能放入物品 i ，且会覆盖上一层的结果。可是，完全背包问题物品数量是无限制的，所以完全背包问题是**从前往后**遍历 （weight \[ i ] -> size容量）。

```javascript
function dagAll(weight, value, size) {
    let dp = new Array(size + 1).fill(0);
    // 初始化
    dp[0] = 0;
    // 状态转移
    for (let i = 0; i < weight.length; i++) {
        for (let j = weight[i]; j <= size; j++) {
            dp[j] = Math.max(dp[j], dp[j - weight[i]] + value[i]);
        }
    }
    return dp[size];
}
```

### [322. 零钱兑换](https://leetcode.cn/problems/coin-change/description/)

题目：

​	给你一个整数数组 coins ，表示不同面额的硬币；以及一个整数 amount ，表示总金额。计算并返回可以凑成总金额所需的 最少的硬币个数 。如果没有任何一种硬币组合能组成总金额，返回 -1 。

​	你可以认为每种硬币的数量是无限的。

```纯文本
输入：coins = [1, 2, 5], amount = 11
输出：3 
解释：11 = 5 + 5 + 1
```

解法：

​	符合完全背包问题，物品重量为coins，背包容量为 amount，**求用物品装满背包的最少物品个数**，物品数量是无限的。

1. dp数组的含义：j表示的是背包的容量，dp \[ j ]表示装满容量 j 的背包所用的最少物品数量。
2. 转移方程：
   coins \[ i ]  > j, dp \[ j ] = dp\[ j ],
   coins\[ i ] <= j, dp \[ j ] = min (dp\[ j ], dp \[ j - coins\[ i ] ] + 1 )。因为求的是 “最少” ，所以用min。
3. 初始化：j =0 时背包的容量为0，此时物品数量为0，dp \[ 0 ] = 0, 因为转移方程中用的是min，所以其他dp\[ j ]初始化为最大值 Infinity。
4. 遍历顺序：先遍历物品 i （0 <= i <= N）,再遍历背包容量 j (  weight \[i] <= j <= size )，从前往后 (weight \[ i ]  ---> size )。

```javascript
var coinChange = function (coins, amount) {
    let dp = new Array(amount + 1).fill(Infinity);
    // 初始化
    dp[0] = 0;
    // 状态转移
    for (let i = 0; i < coins.length; i++) {
        for (let j = coins[i]; j <= amount; j++) {
            dp[j] = Math.min(dp[j], dp[j - coins[i]] + 1);
        }
    }
    return dp[amount] == Infinity ? -1 : dp[amount];
};
```

### [518. 零钱兑换Ⅱ](https://leetcode.cn/problems/coin-change-ii/description/)

题目：

​	给你一个整数数组 coins 表示不同面额的硬币，另给一个整数 amount 表示总金额。

​	请你计算并返回可以凑成总金额的硬币组合数。如果任何硬币组合都无法凑出总金额，返回 0 。

​	假设每一种面额的硬币有无限个。

```latex
输入：amount = 5, coins = [1, 2, 5]
输出：4
解释：有四种方式可以凑成总金额：
5=5
5=2+2+1
5=2+1+1+1
5=1+1+1+1+1
```

解法：

​	此题与**494. 目标和 **题目类似，给定一组物品重量 coins，背包容量为amount，求装满背包的**组合总数**。所不同的是，这里物品的数量是无限的，这是一个完全背包问题。

1. dp数组的含义：j 表示背包容量（0 <= j <= amount），dp\[ j ] 表示装满容量为 j 的背包的组合数。
2. 转移方程：
   j >= coins\[ i ]，表示能放下物品 i ，dp \[ j ] =  dp \[ j ] + dp \[ j - coins\[i] ]。不放物品 i 能装满背包 j 的组合数 + 放物品 i 能装满背包 j 的组合数。
   j <  coins\[ i ], dp \[ j ] = dp \[ j ]。
3. 初始化：j =  0，背包容量为0时，有一种装满背包的方案，即不放任何物品。dp \[ 0 ] = 1。其余初始化为0。
4. 遍历：先从物品开始遍历 i （0 <= i <= N），再从背包开始从前往后遍历 j ( coins\[ i ] <= j <= amount )。

```javascript
var change = function (amount, coins) {
    let dp = new Array(amount + 1).fill(0);
    // 初始化
    dp[0] = 1;
    // 状态转移
    for (let i = 0; i < coins.length; i++) {
        for (let j = coins[i]; j <= amount; j++) {
            dp[j] = dp[j] + dp[j - coins[i]];
        }

    }
    return dp[amount];
};
```

### [377. 组合总和Ⅳ](https://leetcode.cn/problems/combination-sum-iv/description/)

题目：

​	给你一个由 **不同** 整数组成的数组 `nums` ，和一个目标整数 `target` 。请你从 `nums` 中找出并返回总和为 `target` 的元素组合的个数。

```latex
输入：nums = [1,2,3], target = 4
输出：7
解释：
所有可能的组合为：
(1, 1, 1, 1)
(1, 1, 2)
(1, 2, 1)
(1, 3)
(2, 1, 1)
(2, 2)
(3, 1)
请注意，顺序不同的序列被视作不同的组合。
```

解法：

​	此题与 **322. 零钱兑换**、**518. 零钱兑换Ⅱ** 类似，给定一组物品重量nums，背包容量为target，物品数量无限，求装满背包的**排列总数**。所不同的是，这里要求的是排列数，比如背包容量为 3，物品重量为 1 + 2，而 2 + 1是物品的另一种排列，与 1 + 2 不同。

1. dp数组的含义：j 表示背包容量（0 <= j <= amount），dp\[ j ] 表示装满容量为 j 的背包的排列数。
2. 转移方程：
   nums\[ i ] <= j，dp\[ j ] = dp \[ j ] + dp \[ j - nums\[ i ] ]
   nums\[ i ] > j，dp\[ j ] = dp \[ j ]
3. 初始化：dp\[ 0 ] = 1, 其余初始化为0。
4. 遍历顺序：
   **组合总数的遍历顺序为：先遍历物品 i ( 0 -> N)，再遍历背包 j ( nums\[ i ] -> size)****排列总数的遍历顺序为：先遍历背包 j（0 -> size），再遍历物品 i （ 0 -> size ）**
   这题如果先遍历物品，比如 nums = \[ 1,2 ] target = 3 时，dp\[3] 只有 {1，2}没有{2，1},因为重量为2的物品在重量为1的物品放完后才能放入背包。

另外，这题目不能用回溯做，会超时。

### [279. 完全平方数](https://leetcode.cn/problems/perfect-squares/description/)

题目：

​	给你一个整数 `n` ，返回 *和为 **`n`** 的完全平方数的最少数量* 。

```纯文本
输入：n = 12
输出：3 
解释：12 = 4 + 4 + 4
```

解法：

​	试想一下，对于数字n，能作为其因子的完全平方数是多少？比如 n = 12，能作为其因子的完全平方数为 \[1, 4, 9]。这个数组开根号为 \[1, 2, 3] 显然，这些数字都是 <= sqrt(n) 的。那么问题转化为：对于数字 n=12，从\[1, 4, 9] 中选择最少个数的数字使得它们和为12。

​	这就转化为一个完全背包问题，物品重量为weight = \[1, 4, 9]，物品数量无限，背包容量为 12，**求物品装满背包所需的最少物品个数**。与 \[322. 零钱兑换]\(322. 零钱兑换)一样的解法。

```javascript
var numSquares = function (n) {
    let dp = new Array(n + 1).fill(Infinity);
    // 初始化
    dp[0] = 0;
    // 状态转移
    for (let i = 1; i <= Math.sqrt(n); i++) {
        let weight = i * i;
        for (let j = weight; j <= n; j++) {
            dp[j] = Math.min(dp[j], dp[j - weight] + 1);
        }
    }
    return dp[n];
};
```

### [139. 单词拆分](https://leetcode.cn/problems/word-break/description/)

题目：

​			给你一个字符串 s 和一个字符串列表 wordDict 作为字典。请你判断是否可以利用字典中出现的单词拼接出 s 。注意：不要求字典中出现的单词全部都使用，并且字典中的单词可以重复使用。

```latex
输入: s = "leetcode", wordDict = ["leet", "code"]
输出: true
解释: 返回 true 因为 "leetcode" 可以由 "leet" 和 "code" 拼接成。
```

解释：

​			物品等价于wordDict 中的单词，背包等价于 s 的子串，由于wordDict 单词可以无限次被使用，所以这是一个完全背包问题，是否能用物品填满背包。

1. dp数组的含义：j 表示背包的容量（0 <= j <= s.length），dp \[ j ] 表示能否用单词拼出该字符串。比如dp \[ 5 ]表示能否用 wordDict 中单词拼出 `leetc` 。
2. 转移方程：
   j >  wordDict \[i].length  &&  wordDict\[ i ] == s.slice(  j - wordDict\[ i ].length, j );表示当前单词wordDict \[ i ]与当前所求字符串（比如dp\[ 5 ]为 `leetc` ）后几位相匹配。可以放入背包中：
   ​	dp \[ j ] = dp \[ j ] || dp \[ j - wordDict \[i].length ]
   j < wordDict \[ i ]，表示放不下 wordDict\[ i ]：
   ​	dp\[ j ] = dp\[ j ]
3. 初始化：dp \[ 0 ] = true，没有具体含义，为了满足转移方程。当 s  =  `leet`, wordDict\[ i ] = `leet`
   时，dp \[ 4 ] = dp \[ 4 -  wordDict\[ i ].length ] = dp \[ 0 ]，因为 s 与 wordDict\[ i ] 匹配所以dp\[ 0 ] = true.
4. 遍历顺序：如果从物品开始遍历，即 i （0 <= i <= wordDict.length）, 则单词1被选择一次后，等到单词2被选择时，不能再选择单词1。比如：*s = "applepenapple",  wordDict = \["apple", "pen"]*。单词1 apple 能够匹配到  dp \[ 5 ] = apple ，单词2 pen 能够匹配到 dp \[ 8 ] = applepen，但是由于先遍历物品，无法将单词1接着匹配下面的字符串，即 dp \[ 13 ] = applepenapple = false。 所以得从背包开始遍历，即 j ( 0 <= j <= s.length )，再遍历单词 i （0 <= i <= wordDict.length），这样单词放入背包没有顺序。

```javascript
var wordBreak = function(s, wordDict) {
    let dp = new Array(s.length + 1).fill(false);
    // 初始化
    dp[0] = true;
    // 状态转移
    for (let j = 1; j <= s.length; j++) {
        for (let i = 0; i < wordDict.length; i++) {
            let curLength = wordDict[i].length;
            if (j >= curLength && s.slice(0, j).slice(-curLength) == wordDict[i]) {
                dp[j] = dp[j - curLength] || dp[j];
            }
        }
    }

    return dp[s.length];
};
```

## 4. 打家劫舍

### [198. 打家劫舍](https://leetcode.cn/problems/house-robber/description/)

题目：

​			给一个数组 nums，相邻元素不能取，求数组元素的最大和。nums = \[2, 3, 2], 和为 3。

解法：

1. i表示的是当前房屋 dp\[i]是截至到第i个房价能偷取的最高金额。
2. 转移方程：对于每间房屋有两种选择，偷 or 不偷。偷：dp\[i] = dp\[i-2]+nums\[i], 不偷：dp\[i] = dp\[i-1]，得 dp\[i] = max(dp\[i-1],dp\[i-2]+nums\[i])
3. dp数组初始化：由于涉及 i-2，初始化dp\[0] = nums\[0], **dp\[1] = max(nums\[0],nums\[1])**。注意这里dp\[1]的初始化会影响结果
4. 遍历顺序：i -> nums.length-1 顺序遍历

```javascript
var rob = function(nums) {
if (nums.length == 1) return nums[0];
if (nums.length == 2) return Math.max(nums[0], nums[1]);

let dp = new Array(nums.length).fill(0);
dp[0] = nums[0], dp[1] = Math.max(nums[0], nums[1]);
for (let i = 2; i < dp.length; i++) {
dp[i] = Math.max(dp[i - 1], dp[i - 2] + nums[i])
}
return dp[dp.length - 1];
};
```

### [213. 打家劫舍Ⅱ](https://leetcode.cn/problems/house-robber-ii/description/)

题目：

​			比起上一题，这里做了限制，即 nums是一个**环形数组**。

解法：

​			环形数组分为两种情况讨论：

- 包含首元素，不包含尾元素
- 不包含首元素，包含尾元素

将上题解法分两个数组进行dp即可。

```javascript
var rob = function(nums) {
    if (nums.length == 1) return nums[0];
    if (nums.length == 2) return Math.max(nums[0], nums[1]);

    let dp1 = new Array(nums.length - 1),
        dp2 = new Array(nums.length - 1);
    dp1[0] = nums[0], dp1[1] = Math.max(nums[0], nums[1]);
    dp2[0] = nums[1], dp2[1] = Math.max(nums[1], nums[2]);
    for (let i = 2; i < dp1.length; i++) {
        dp1[i] = Math.max(dp1[i - 1], dp1[i - 2] + nums[i]);
    }
    for (let i = 2; i < dp2.length; i++) {
        dp2[i] = Math.max(dp2[i - 1], dp2[i - 2] + nums[i + 1]);
    }
    return Math.max(dp1[dp1.length - 1], dp2[dp2.length - 1]);
}
```

### [337. 打家劫舍Ⅲ](https://leetcode.cn/problems/house-robber-iii/description/)

题目：

​			比起第一题，这里将nums转换成了**二叉树**。

1. i 表示的是当前房屋 dp\[i]是截至到第i个房间能偷取的最高金额。
2. 转移方程：对于两间房屋有两种选择，偷 or 不偷。偷：当前节点 =  当前节点.val + 左子树.不偷 + 右子树.不偷，**不偷：当前节点 = max（左子树.偷，左子树不偷）+ max（右子树.偷，右子树.不偷）**。
3. dp树初始化：叶子节点进行初始化，一个二元组 \[node.val (偷), 0 (不偷) ]。
4. 遍历顺序：考虑到当前节点的dp值由其左子树和右子树的dp值决定，采用二叉树的后序遍历方式。

```javascript
var rob = function(root) {
    let result = postOrder(root);
    return Math.max(result[0], result[1]);

    // 树形dp
    function postOrder(root) {
        if (!root) return [0, 0];
        let leftDp, rightDp, result = [0, 0];
        leftDp = postOrder(root.left), rightDp = postOrder(root.right);
        result[0] = root.val + leftDp[1] + rightDp[1]; // 偷
        result[1] = Math.max(leftDp[0], leftDp[1]) + Math.max(rightDp[0], rightDp[1]); // 不偷
        return result;
    }
}
```

## 5. 股票问题
    待补充...
## 6. 子序列问题

第一种思路模板是一个一维的dp数组，**通常输入只有一个字符串**：

```javascript
let dp = new Array(arr.length);
let result;

for (let i = 1; i < dp.length; i++) {
    for (let j = 0; j < i; j++) {
        dp[i] = 最值(dp[i], dp[j] + ...)
    }
  result = 最值(result,dp[i])             
}
```

这种思路做法是：每次求dp\[i]，都得遍历一遍 dp\[j] = dp\[0] -> dp\[i]，每次求得的结果都会影响dp\[i]。且最终结果在每个dp\[i] 中取得，而不是 dp\[dp.length-1]中取得。

### [300. 最长上升子序列](https://leetcode.cn/problems/longest-increasing-subsequence/description/)

题目：

​		给你一个整数数组nums，找到其中最长严格递增子序列的长度。

​		nums = \[10, 9, 2, 5, 3, 7, 101, 18]，最长递增子序列是 \[2, 3, 7, 101], result=4。

解法：

​		根据上面的模板，每次求dp\[i]时，比较 nums \[i] 与 nums \[j] (0 <= j <= i-1)，如果 nums \[i] > nums\[j]，则得到dp\[i] 的一个可能值 dp\[j] +1, dp\[i] = max( dp\[j] + 1 )。而最终结果在所有 dp\[i]上产生，result = max( dp\[i] )。

```javascript
var lengthOfLIS = function(nums) {
    // 初始化
    var dp = Array(nums.length).fill(1);
    var result = 0;
    // 状态转移
    for (let i = 0; i < dp.length; i++) {
        for (let j = 0; j < i; j++) {
            if (nums[i] > nums[j]) {
                dp[i] = Math.max(dp[i], dp[j] + 1);
            }
        }
        result = Math.max(result, dp[i]);
    }
    return result;
};
```

第二种思路模板是一个二维的dp数组，**通常输入为两个字符串（少数情况下一个字符串）：**

```javascript
let m = arr1.length, n = arr2.length;
let dp = new Array(m).fill().map(item => new Array(n).fill(0));;

for (let i = 0; i < m; i++) {
    for (let j = 0; j < n; j++) {
        if (arr1[i] == arr2[j]) 
            dp[i][j] = dp[i+a][j+b] + c
        else
            dp[i][j] = 最值(...)
    }
}
```

这种思路的做法是：每次求dp\[i] \[j]，都是求规模更小的子问题，输入为 arr1\[0~~i] 的子串，arr2\[0~~j]的子串。而dp\[i] \[j]的结果分情况进行讨论：当 arr1\[i] == arr2 \[j]时，**dp\[i] \[j] = dp\[i+a] \[j+b] + c** （比如：dp\[i-1] \[j-1] + 1，即上对角位置 + 1）；当 arr1\[i] != arr2\[j] 时，则转移之前求得的子问题的最值，**最值（...）**, 通常 **...** 表示的是 dp\[i-1] \[j], dp\[i] \[j-1]。

### [1143. 最长公共子序列](https://leetcode.cn/problems/longest-common-subsequence/description/)

题目：

​		给定两个字符串 `text1` 和 `text2`，返回这两个字符串的最长 公共子序列 的长度。如果不存在公共子序列，返回 `0` 。

​        text1 = “”abcde“，text2 = "ace" ，最长公共子序列是 "ace"， result = 3。

解法：

1. dp\[i] \[j],表示的是当输入为 text1 \[ 0\~ i ]，text2 \[ 0\~j ]的子串的最长公共子序列的长度。例如 dp\[2] \[1],表示的是 text1 = "abc", text2 = "ac" 的最长公共子序列长度。
2. 转移方程：根据上面的模板进行分类讨论：
   当 text1\[i] == text2 \[j] 时，dp \[i] \[j] = dp\[i-1] \[j-1] +1 。即当前字符相等，则当前结果为text1和text2都减一个字符的结果（dp\[i-1] \[j-1] ）加1。例如 abc 和 ac (dp\[2] \[1])，则它的结果是 ab，a 的结果 (dp\[1] \[0]) +1。
   当 text1\[i] != text2 \[j] 时，dp \[i] \[j] = max ( dp\[i-1] \[j], dp\[i] \[j-1] )。即当前字符不等，则当前结果为之前已有结果的最值。
3. dp数组初始化：通常二维dp数组初始化第一行和第一列
   行和列的初始化逻辑相同，即碰见第一个相同的字符，前面的初始化为0，后面的初始化为1。例如第一行：

​		text1 \[0] = b, text2 \[0\~n] =  acbde。b!=a， dp\[0] \[0] = 0, b!=c, dp\[0] \[1] = 0, b == b, dp\[0] \[2] = 1；所以初始化后结果为：00111。

1. 遍历顺序：从 dp\[1] \[1] 顺序遍历至 dp\[m-1] \[n-1]。

```javascript
var longestCommonSubsequence = function (text1, text2) {
    let n = text1.length,
        m = text2.length;
    let dp = new Array(m).fill().map(item => new Array(n).fill(0)); // m x n
    // 初始化
    dp[0][0] = text2[0] == text1[0] ? 1 : 0;
    // 第一行
    for (let j = 1; j < n; j++) {
        dp[0][j] = text2[0] == text1[j] ? 1 : dp[0][j - 1];
    }
    // 第一列
    for (let i = 1; i < m; i++) {
        dp[i][0] = text2[i] == text1[0] ? 1 : dp[i - 1][0];
    }

    // 状态转移
    for (let i = 1; i < m; i++) {
        for (let j = 1; j < n; j++) {
            dp[i][j] = text2[i] == text1[j] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i][j - 1], dp[i - 1][j]);
        }
    }

    return dp[m - 1][n - 1];
};
```
