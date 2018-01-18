var store = [{
        "title": "Program Structures and Algorithms",
        "excerpt":"What I Learned  fundamentals of programming data structures and basic algorithms  common data structures          arrays, linked list, stacks and queues, hash tables and hash maps      trees, graphs, suffix trees      other specialized data structures        order of complexities for each one of these data structures  searching and sorting  backtracking  dynamic programming  bit manipulation  pattern searching…Course Links  Repository  Code Lab GPA: 4.0/4.0 💯","categories": [],
        "tags": [],
        "url": "http://localhost:4000/portfolio/algorithm/",
        "teaser":"http://localhost:4000/assets/images/teasers/info6205.png"},{
        "title": "Application Development and Engineering",
        "excerpt":"What I Learned  Procedural and object-oriented paradigms (in Java)  Standard data types, primitive classes, wrapper classes  OO: encapsulation, inheritance, polymorphism, and abstraction  Abstract classes, interfaces and inner classes  Exceptions and multi-threaded programming  Collection framework, Array, Collections, List, Set, and Map  File IO and exceptions handling  Building user interfaces using Java Swing                                                                                                                                                                                            Screenshots of course projects.  Course Links  Homepage  Repository  Projects          Hang Man      Game of Hearts      Inventory Management      GPA: 4.0/4.0 💯","categories": [],
        "tags": [],
        "url": "http://localhost:4000/portfolio/programming/",
        "teaser":"http://localhost:4000/assets/images/application-development/inventory/inventory-ist.png"},{
        "title": "About me and this website",
        "excerpt":"My ProfessionI am studying Information Management at Northeastern University in Seattle from 2017 to 2019. Before, I was a software engineer in Oracle, and then a tech lead in Sony for 9+ years in total.My prospective profession is to be a data engineer/scientist after graduation in May 2019. So I will show some of my school/side projects on this website, including some technical articles related to java, python, web-design, database, cloud computing, big data and data science.If you would like to know more about my profession, please check my cv.My InterestsMindfulness and productivity are my most interesting subject, and I am still on my way to practice, and then build my own methodology.My other hobbies are reading, travel, and photography. I will keep writing notes and articles (mostly in Chinese) on my life blog.","categories": [],
        "tags": [],
        "url": "http://localhost:4000/mindfulness-site-launched/",
        "teaser":"http://localhost:4000/assets/images/default-teaser.png"},{
        "title": "Start small, achieve BIG!",
        "excerpt":"Many people already know this, but why I mention it again, simply because it is very important and easy to forget.Nowadays, people just want to accomplish big and fancy things and tend to ignore the small ones. However, the universal law cannot be ignored that big achievements start from small.  Finishing a marathon starts with a step of running and then the next step.Writing a blog (and do not stop) is a big thing but it starts with a simple post. As to me, maybe it starts a feature of a programming language or a simple linear regression model. By keeping learning and practicing days after days, eventually, I will achieve big.2018-01-17, Seattle","categories": [],
        "tags": [],
        "url": "http://localhost:4000/start-small-achieve-big/",
        "teaser":"http://localhost:4000/assets/images/default-teaser.png"},{
        "title": "Use `intertools` to solve combination and permutation problems in leetcode",
        "excerpt":"In python, package itertools  is a very powerful and efficient looping tool. Here are some examples of how to solve some leetcode algorithm problems using this tool.Quick Look at Combinatoric Iterators            Iterator      Arguments      Results                  product()      p, q, … [repeat=1]      cartesian product, equivalent to a nested for-loop              permutations()      p[, r]      r-length tuples, all possible orderings, no repeated elements              combinations()      p, r      r-length tuples, in sorted order, no repeated elements              combinations_with_replacement()      p, r      r-length tuples, in sorted order, with repeated elements              product('ABCD', repeat=2)             AA AB AC AD BA BB BC BD CA CB CC CD DA DB DC DD              permutations('ABCD', 2)             AB AC AD BA BC BD CA CB CD DA DB DC              combinations('ABCD', 2)             AB AC AD BC BD CD              combinations_with_replacement('ABCD', 2)             AA AB AC AD BB BC BD CC CD DD      LeetCode Problems and SolutionsCombinationsDescriptionGiven two integers n and k, return all possible combinations of k numbers out of 1 … n.For example,If n = 4 and k = 2, a solution is:[  [2,4],  [3,4],  [2,3],  [1,2],  [1,3],  [1,4],]SolutionIt likes talored for the itertools.combinations() function. :laughing:import itertoolsclass Solution:    def combine(self, n, k):        \"\"\"        :type n: int        :type k: int        :rtype: List[List[int]]        \"\"\"        nums = [x for x in range(1, n+1)]        return list(itertools.combinations(nums, k))Combination Sum IIIDescriptionFind all possible combinations of *k* numbers that add up to a number *n*, given that only numbers from 1 to 9 can be used and each combination should be a unique set of numbers.*Example 1:*Input:  k = 3,  n = 7Output:[[1,2,4]]*Example 2:*Input:  k = 3,  n = 9Output:[[1,2,6], [1,3,5], [2,3,4]]Solutionimport itertoolsclass Solution:    def combinationSum3(self, k, n):        \"\"\"        :type k: int        :type n: int        :rtype: List[List[int]]        \"\"\"        if n &lt; 1 or n &gt; (1 + 9) * 9 / 2: return [] # n is too small or big        nums = [x for x in range(1, 10)] # form a list of numbers from 1 to 10 (exclusive)        return [e for e in itertools.combinations(nums, k) if sum(e) == n] # comprehensionNotereturn list(e for e in itertools.combinations(nums, k) if sum(e) == n) will also work but it is a little bit slow that the list comprehension which is used in the provided solution.PermutationsDescriptionGiven a collection of distinct numbers, return all possible permutations.For example,[1,2,3] have the following permutations:[  [1,2,3],  [1,3,2],  [2,1,3],  [2,3,1],  [3,1,2],  [3,2,1]]Solutionimport itertoolsclass Solution:    def permute(self, nums):        \"\"\"        :type nums: List[int]        :rtype: List[List[int]]        \"\"\"        return list(itertools.permutations(nums))Permutations IIDescriptionGiven a collection of numbers that might contain duplicates, return all possible unique permutations.For example,[1,1,2] have the following unique permutations:[  [1,1,2],  [1,2,1],  [2,1,1]]Solutionimport itertoolsclass Solution:    def permuteUnique(self, nums):        \"\"\"        :type nums: List[int]        :rtype: List[List[int]]        \"\"\"        return list(set(itertools.permutations(nums))) # get rid of duplicatesLimitationThe built-in function is very handy and cool. However, it is always slow to search all the combinations/permutations in a list of numbers. That’s where other algorithms like backtracking come in because it can prune the unnecessary branches when searching. Later, I will introduce the solution to these questions as well.Combination SumCombination Sum IICombination Sum IV2018-01-18, Seattle","categories": [],
        "tags": [],
        "url": "http://localhost:4000/itertools-in-leetcode/",
        "teaser":"http://localhost:4000/assets/images/default-teaser.png"}]
