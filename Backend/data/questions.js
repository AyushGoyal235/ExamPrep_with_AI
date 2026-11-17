window.EXAMPREPAI_QUESTIONS = [
  {
    id: "a1",
    topic: "Arrays",
    difficulty: "Easy",
    title: "Find the largest element",
    prompt:
      "Which approach finds the largest value in an unsorted array in O(n) time?",
    options: [
      "Sort the array and take the last element",
      "Scan once while tracking the maximum",
      "Use binary search",
      "Compare only the first and last elements",
    ],
    answer: 1,
    explanation:
      "A single traversal compares each element with the current maximum, taking O(n) time and O(1) extra space.",
  },
  {
    id: "a2",
    topic: "Arrays",
    difficulty: "Medium",
    title: "Two Sum with a hash map",
    prompt:
      "For an unsorted array, which approach usually solves Two Sum in expected O(n) time?",
    options: [
      "Nested loops only",
      "Sort, then always use O(1) lookup",
      "Store seen values in a hash map",
      "Use binary search without sorting",
    ],
    answer: 2,
    explanation:
      "A hash map lets you check whether the complement has already been seen in expected O(1) time per element.",
  },
  {
    id: "s1",
    topic: "Strings",
    difficulty: "Easy",
    title: "Check a palindrome",
    prompt: "Which two-pointer condition is useful when checking a palindrome?",
    options: [
      "Compare characters from both ends moving inward",
      "Compare only adjacent characters",
      "Sort the characters first",
      "Reverse the string and compare lengths",
    ],
    answer: 0,
    explanation:
      "Compare the left and right characters, moving both pointers inward until they meet or a mismatch is found.",
  },
  {
    id: "s2",
    topic: "Strings",
    difficulty: "Medium",
    title: "Longest substring without repeats",
    prompt:
      "Which data helps a sliding-window solution track repeated characters efficiently?",
    options: [
      "A stack containing every substring",
      "A set or map of characters in the window",
      "A min-heap",
      "A graph adjacency matrix",
    ],
    answer: 1,
    explanation:
      "A set or map tracks characters in the current window; move the left pointer when a duplicate appears.",
  },
  {
    id: "b1",
    topic: "Binary Search",
    difficulty: "Easy",
    title: "Binary search condition",
    prompt: "Binary search is directly applicable when the search space is:",
    options: [
      "Completely random with no structure",
      "Sorted or has a suitable monotonic property",
      "Always a linked list",
      "Guaranteed to contain duplicates",
    ],
    answer: 1,
    explanation:
      "Classic binary search relies on sorted order; answer-space binary search relies on a monotonic feasibility condition.",
  },
  {
    id: "b2",
    topic: "Binary Search",
    difficulty: "Medium",
    title: "First occurrence",
    prompt:
      "To find the first occurrence of a target in a sorted array with duplicates, after finding a match you should:",
    options: [
      "Immediately return it",
      "Move right to find a larger index",
      "Save the index and continue searching left",
      "Restart with linear search only",
    ],
    answer: 2,
    explanation:
      "Save the matching index and keep searching the left half to see whether an earlier match exists.",
  },
  {
    id: "l1",
    topic: "Linked List",
    difficulty: "Easy",
    title: "Detect a cycle",
    prompt:
      "Which classic technique detects a cycle in a linked list using O(1) extra space?",
    options: [
      "Two nested loops over all nodes",
      "Floyd's slow and fast pointers",
      "Sorting the nodes",
      "Binary search",
    ],
    answer: 1,
    explanation:
      "Floyd's algorithm moves slow by one step and fast by two; if a cycle exists, they eventually meet.",
  },
  {
    id: "d1",
    topic: "Dynamic Programming",
    difficulty: "Medium",
    title: "Memoization",
    prompt: "What is memoization in dynamic programming?",
    options: [
      "Recomputing every state from scratch",
      "Caching results of solved subproblems",
      "Sorting all states by value",
      "Replacing recursion with a queue in every case",
    ],
    answer: 1,
    explanation:
      "Memoization stores the result of a subproblem so repeated calls can reuse it rather than recompute it.",
  },
  {
    id: "g1",
    topic: "Graphs",
    difficulty: "Medium",
    title: "Unweighted shortest path",
    prompt:
      "Which traversal finds shortest paths by number of edges in an unweighted graph?",
    options: [
      "Depth-first search in any order",
      "Breadth-first search",
      "Kruskal's algorithm",
      "Topological sort for every graph",
    ],
    answer: 1,
    explanation:
      "BFS explores vertices in increasing distance layers, so the first visit gives the shortest edge-count path.",
  },
  {
    id: "g2",
    topic: "Graphs",
    difficulty: "Hard",
    title: "Minimum spanning tree",
    prompt:
      "Kruskal's algorithm commonly uses which data structure to avoid adding cycle-forming edges efficiently?",
    options: [
      "Trie",
      "Disjoint Set Union (Union-Find)",
      "Monotonic stack",
      "Prefix sum array",
    ],
    answer: 1,
    explanation:
      "DSU checks whether endpoints are already connected and merges their components when an edge is accepted.",
  },
];
