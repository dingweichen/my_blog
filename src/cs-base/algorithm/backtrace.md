# 回溯

## 1. 算法模板

```javascript
let path = [],
    result = [];

function backTrace(args) {
    // 出口
    if (...) return; // 结果在叶子节点 result.push([...path])

        for (let i = 0; i < args.length; i++) {
        // 确定当前选项
        let curItem = '';
        // 根据当前选项剪枝
        if (...) continue;

        // 选择：当前选项加入path
        path.push(curItem);
        // 递归
        backTrace(args.slice(i or i + 1)); // 结果在所有节点 result.push([...path])
        // 取消选择(回溯)：当前选项弹出path
        path.pop();
    }
}
```

## 2. 基础问题

### [78. 子集](https://leetcode.cn/problems/subsets/description/)

&#x20;       对于集合{1,2,3}, 其求子集 `traceBack([1,2,3])`  的方式为：

​	维护一个 `path` 表示当前被选择的元素，对于 \[1,2,3] 有三种选择：path=\[1], path=\[2], path=\[3]。当 path=\[1]时，选项只剩下 \[2,3]，继续做出选择并更新path，path = \[1,2]，选项=\[3]。直到，path = \[1,2,3], 选项=\[]。递归出口即 传入的选项为空。

​	注意 path = \[2] 时，2已经被选了，其剩下选项为 \[3] , 并不是 \[1,3]。已经包含1的子集已经在 1 那个子树上产生，这样做不会产生重复元素。

​	可以画一颗行为树，表示每次做出的选项，每当有新的节点产生，就多一种子集，将子集加入结果中。

```javascript
var subsets = function(nums) {
    let path = [],
        result = [
            []
        ];
    traceBack(nums);
    return result;

    function traceBack(arr) {
        // 出口
        if (arr.length == 0) return;
        
        for (let i = 0; i < arr.length; i++) {
            // 选择：将元素放入路径
            path.push(arr[i]);
            // 递归
            result.push([...path]); // 每选择一个元素，就会产生一个子集
            traceBack(arr.slice(i + 1)); // 不能选择已经选过的元素
            // 取消选择：将元素从路径中取出
            path.pop();
        }
    }
};
```

### [77. 组合](https://leetcode.cn/problems/combinations/description/)

​	对于集合 {1,2,3,...,n}, 求其所有长度为k的子集。方式为:

​	思路与**78. 子集** 相同，所不同的是程序的出口为 `path.length == k`, 即行为树的第k层就中止选择，且子集都是第k层节点产生的。

```javascript
var combine = function (n, k) {
    let arr = new Array(n).fill(0).map((item, i) => i + 1);
    let path = [],
        result = [];
    traceBack(arr);
    return result;

    function traceBack(arr) {
        // 出口
        if (path.length == k) return result.push([...path]);

        for (let i = 0; i < arr.length; i++) {
            // 选择：将元素放入路径
            path.push(arr[i]);
            // 递归
            traceBack(arr.slice(i + 1)); // 不能选择已经选过的元素
            // 取消选择：将元素从路径中取出
            path.pop();
        }
    }
};
```

### [39. 组合总和](https://leetcode.cn/problems/combination-sum/description/)

​	将数组 \[2,3,6,7] 中的数任意组合成目的数target。**条件：数组中不存在重复元素，且元素可以无限取** 方式为：

​	思路与 **78.子集** 相同，所不同的是必须记录住选择的路径总和 `sum`，出口为 `sum > k` 或者 `sum == k`, 递归的时候由于元素可无数次选取，所以选项可以从`arr.slice(i)`开始。不从`arr.slice(0)`开始是因为包含0\~i-1的子集，已经选择 0\~i-1 过程中产生。

```javascript
var combinationSum = function(candidates, target) {
    let sum = 0,
        path = [];
    let result = [];
    traceBack(candidates, target);
    return result;

    function traceBack(arr, k) {
        // 出口
        if (sum > k) return;
        if (sum == k) return result.push([...path]);
        
        for (let i = 0; i < arr.length; i++) {
            // 选取当前元素
            sum += arr[i];
            path.push(arr[i]);
            // 递归：考虑元素可无限制读取
            traceBack(arr.slice(i), k);
            // 退出当前元素
            sum -= arr[i];
            path.pop();
        }
    }
};
```

### [40. 组合总和Ⅱ](https://leetcode.cn/problems/combination-sum-ii/description/)

​	将数组 \[2,3,6,7] 中的数任意组合成目的数target。**条件：数组中存在重复元素，且每个元素只能取一次** 。这道题目和上一道题目思路相同，但是得考虑去重的问题。

​	去重的常见手法：

1. 在求解过程中不去重，求出结果后用set去重数组。但是这里如果在求解过程中不去重，最后三个测试用例会超时。
2. 在求解过程中去重，回溯过程中根据题目特性进行剪枝。例如用例 \[2,5,2,1,2] => \[1,2,2,2,5]。如果第一个2被选择，则选项剩下\[1,2,2,5]; 第二个2被选择，选项还是 \[1,2,2,5], 相同结果已经在选择第一2时产生。所以减枝操作分为两步：1.  递归前将参数变为有序 2. 相同元素选择第一个即可，其他的逐次跳过。

```javascript
var combinationSum2 = function(candidates, target) {
    candidates.sort((a, b) => a - b); // 排序candidates用于回溯中剪枝
    let sum = 0,
        path = [];
    let result = [];
    traceBack(candidates, target);
    return result;

    function traceBack(arr, k) {
        // 出口
        if (sum > k) return;
        if (sum == k) return result.push([...path]);

        for (let i = 0; i < arr.length; i++) {
            if (i > 0 && arr[i] == arr[i - 1]) continue; // 剪枝
            // 选择当前元素
            path.push(arr[i]);
            sum += arr[i];
            // 递归:由于每个元素只能被选一次，所以i+1
            traceBack(arr.slice(i + 1), k);
            // 取消选择当前元素
            path.pop();
            sum -= arr[i];
        }
    }
};
```

### [46. 全排列](https://leetcode.cn/problems/permutations/description/)

​	给一个数组 nums=\[1,2,3]，返回其所有可能的全排列。**条件：数组不含重复数字**。
​	解法和**39. 组合总和** 一致，每一次选择一个数，由于不能重复选取，所以从选项数组中删除被选择元素后进行下一次选择。

```javascript
var permute = function (nums) {
    let path = [],
        result = [];
    traceback(nums);
    return result;

    function traceback(arr) {
        // 出口
        if (arr.length == 0) return result.push([...path]);

        for (let i = 0; i < arr.length; i++) {
            // 选择：元素加入路径
            path.push(arr[i]);
            // 递归
            let copArr = [...arr];
            copArr.splice(i, 1);
            traceback(copArr);
            // 取消选择：元素弹出路径
            path.pop();
        }
    }
};
```

### [47. 全排列Ⅱ](https://leetcode.cn/problems/permutations-ii/description/)

​	给一个数组 nums=\[1,2,3]，返回其所有可能的全排列。**条件：数组包含重复数字**。
​	思路与 \[40. 组合总和Ⅱ]\(#40. 组合总和Ⅱ) 一致，由于存在重复元素，所以必须去重。在回溯过程中去重，对数组排序后进行剪枝操作。

```javascript
var permuteUnique = function (nums) {
    nums.sort((a, b) => a - b); // 排序，方便去重
    let path = [],
        result = [];
    traceback(nums);
    return result;

    function traceback(arr) {
        // 出口
        if (arr.length == 0) return result.push([...path]);

        for (let i = 0; i < arr.length; i++) {
            if (i > 0 && arr[i] == arr[i - 1]) continue; // 剪枝
            // 选择：元素加入路径
            path.push(arr[i]);
            // 递归
            let copArr = [...arr];
            copArr.splice(i, 1);
            traceback(copArr);
            // 取消选择：元素弹出路径
            path.pop();
        }
    }
};
```

### [131. 分割回文串](https://leetcode.cn/problems/palindrome-partitioning/description/)

​	将字符串 `s` 进行分割，使得每个子串都是回文串。s = "aab", result = \[ \[a,a,b], \[aa,b]]。

​	思路与上述回溯算法逻辑一致，for循环中每次操作是对str的一个切割，如 aab, 有三次选择（切割）：

`a|ab`,  `aa|b` ,`aab|`。出口是当前字符串切割完毕，即切割线 `|` 走到最后 `a,a,b| `。注意行为树过程中的剪枝操作，例如对于 ababa, 有一种切割方式是 `ab|aba`, 因为 `ab` 不是回文子串，这颗子树就不需要走，即不必对 `aba`进行切割，而是走下一颗子树 `aba|ba`。

![](image/image-20220331172227957_yKYjtpjSbg.png)

```javascript
var partition = function(s) {
    let path = [],
        result = [];
    backTrace(s);
    return result;

    function backTrace(str) {
        // 出口
        if (str.length == 0) return result.push([...path]);

        for (let i = 0; i < str.length; i++) {
            let subStr = str.substring(0, i + 1);
            if (!isPalin(subStr)) continue; // 剪枝
            // 选择：将当前回文子串放入path
            path.push(subStr);
            // 递归
            backTrace(str.substring(i + 1));
            // 取消选择：将当前回文子串弹出path
            path.pop();
        }
    }

    // 工具函数：判断是否回文
    function isPalin(str) {
        return str == str.split('').reverse().join('');
    }
};
```

## 3. 衍生

### [22. 括号生成](https://leetcode.cn/problems/generate-parentheses/description/)

​	数字`n`代表生成括号的对数，设计函数生成所有可能并且有效的括号组合。比如 n=3, 输出 `["((()))","(()())","(())()","()(())","()()()"]`。

​	思路符合普通的回溯算法，主要确定回溯函数的输入参数，以及剪枝条件。行为树如下：

![](image/image-20220401125732668_zlJQsh5CN6.png)

​	回溯函数的参数为一个二维数组：\[剩余左括号数量，剩余右括号数量]。每次可做两种选择：选择左括号或选择右括号。剪枝条件为两个：`1. left > right 说明path中右括号插入数量过多 `、`2. left == 0 && i==0 说明没有剩余左括号了，且依然想向path中插入左括号`。

```javascript
var generateParenthesis = function(n) {
    let path = [],
        result = [];
    traceBack([n, n]);
    return result;

    function traceBack(arr) {
        // 出口
        if (arr[0] == 0 && arr[1] == 0) return result.push(path.join(""));

        for (let i = 0; i < 2; i++) {
            if ((arr[0] == 0 && i == 0) || arr[0] > arr[1]) continue; // 剪枝
            let curItem = i == 0 ? '(' : ')';
            // 选择
            path.push(curItem);
            curItem == '(' ? arr[0]-- : arr[1]--;
            // 递归
            traceBack(arr);
            // 取消选择
            path.pop();
            curItem == '(' ? arr[0]++ : arr[1]++;
        }
    }
};
```

### [93. 复原IP](https://leetcode.cn/problems/restore-ip-addresses/description/)

​	给一个由数字组成的字符串，返回所有可能的有效IP地址。

​	思路符合回溯算法，每次截取字符串的最多前3位作为一段，在加入path之前，得判断当前子串对应数字是否符合IP规范，剪枝条件为两个：

- 当前段数字大于255
- 当前段数字以0开头且长度大于2

注意剪枝用的是 `break` 而非`continue`，`break`意味者从当前 i=2开始，后面的3，4，5，...到s.length都不参与回溯；而`continue`只是跳过当前回溯，i=2，后面的3，4，5，...到 s.length 还是会继续处理。
最后在出口处注意判断path是否为4段，因为有可能产生小于4段或者大于4段的结果。

![](image/image-20220403213007111_Qh3vUi9MuF.png)

```javascript
var restoreIpAddresses = function(s) {
    // 特判
    if (s.length > 12 || s.length < 4) return [];
    let path = [],
    result = [];
    traceBack(0);
    return result;

    function traceBack(startIndex) {
        // 出口
        if (startIndex == s.length && path.length == 4) return result.push(path.join('.'));

        for (let i = startIndex; i < s.length && i < startIndex + 3; i++) {
            let curStr = s.substring(startIndex, i + 1);
            // 减枝 
            if (path.length > 3) break; // 用于优化：当前分段超过4段
            if (parseInt(curStr) > 255) break; // 当前分段的数字超过255
            if (curStr[0] == '0' && curStr.length > 1) break; // 当前分段的数字以0开头且长度大于1

            // 选择
            path.push(curStr);
            // 递归
            traceBack(i + 1);
            // 取消选择
            path.pop();
        }
    }
};
```

### [494. 目标和](https://leetcode.cn/problems/target-sum/description/)

题目：

​			给你一个整数数组 `nums` 和一个整数 `target` 。向数组中的每个整数前添加 `'+'` 或 `'-'` ，然后串联起所有整数，可以构造一个 **表达式** ，例如，`nums = [2, 1]` ，可以在 `2` 之前添加 `'+'` ，在 `1` 之前添加 `'-'` ，然后串联起来得到表达式 `"+2-1"` 。返回可以通过上述方法构造的、运算结果等于 `target` 的不同 **表达式** 的数目。

​			nums = \[1,1,1,1,1], target = 3。 result = 5。

思路：

​			根据回溯算法的思想，对于每个nums \[i] 都有两次选择 **+** or **-**，path 记录当前选择后的 sum。每次递归传入下一个被选择元素的索引 startIndex，出口为操作完所有的元素，即 startIndex == nums.length。

```javascript
var findTargetSumWays = function (nums, target) {
    let path = 0,
        result = 0;
    traceBack(0);
    return result;

    function traceBack(startIndex) {
        // 出口
        if (startIndex == nums.length) {
            if (path == target) result++;
            return;
        }
        for (let i = 0; i < 2; i++) {
            // 选择
            i == 0 ? path += nums[startIndex] : path -= nums[startIndex];
            // 递归
            traceBack(startIndex + 1);
            // 取消选择
            i == 0 ? path -= nums[startIndex] : path += nums[startIndex];
        }
    }
};
```
