---
description: From https://www.quantamagazine.org/a-short-guide-to-hard-problems-20180716/
---

# A short guide to hard problems

What's easy for a computer to do, and what's almost impossible? These questions are at the core of computational complexity. Here's a landscape.



How fundamentally difficult is a problem? Computer scientists hope to sort problems into what are called complexity classes. These are the groups that contains all the computational problems that require less than some fixed amount of a computational resource - something like time or memory.



For example:&#x20;

Is a large number 123,456,789,001 is a prime number: This can be solved by using a fast algorithm. Essentially an algorithm that doesn't bog down as the number gets arbitrarily large.

What are the prime factors of 123,456,789,001: There is no fast algorithm here - unless you use a quantum computer.



Many different complexity classes exist, though in most cases reserarchers haven't been able to prove one class is categorically distinct from the others. Proving those types of categorical distinctions is among the hardest and most important open problems in the field. The differences between complexity classe can be subtle or stark, and keeping the classes straight is a challenge. Here's the seven most common complexity classes.



**P: Polynomial Time**

Short: All the problems that are easy for classical (non-quantum) computer to solve

Precise: Algorithms in P must stop and give the right answer in at most n^c time where n is the length of the input and c is some constant.

Typical Problems:

* Is the number prime?
* What's the shortest distance between two points?

What researchers want to know: Is P the same thing as NP? If so, it would upend computer science and rent most cryptography ineffective overnight. (Almost no one thinks this is the case)



**NP: Nondeterministic Polynomial time**

Short: All problems that can be quickly verified by a classical computer once a solution is given.

Precise: A problem is in NP if, given a "yes" answer, there is short proof that establishes the answer is correct. If the input is a string, X, and you need to decide if the answer is "yes", then a short proof is another string, Y, that can be used to verify in polynomial time that the answer is indeed "yes". Y is sometimes referred to as a "short witness" - all problems in NP have "short witness" that allows them to be verified quickly.

Typical problems

* The clique problem: Imagine a graph with edges and notes - for example, a graph where nodes are individuals on Facebook and two nodes are connected by an edge if they're "friends". A clique is a subset of this graph where all the people are friends with all the others. One might ask of such a graph: Is there a clique of 20 people? 50 people? 100? Finding such a clique is a "NP-complete" problem, meaning that it has the highest complexity of any problem in NP. But if given a potential answer - a subset of 50 nodes that may or may not form a clique - it's easy to check.
* The traveling salesman problem: Given a list of cities with distances between each pair of cities, is there a way to travel through all the cities in less than a certain number of miles? For example, can a traveling salesman pass through every U.S. state capital in less than 11,000 miles?

What researchers want to know: Does P = NP? Computer scientists are nowhere near a solution to this problem.



**PH: Polynomial Hierarchy**

Short: PH is a generalization of NP - it contains all the problems you get if you start with a problem in NP and add additional layers of complexity.

Precise: PH contains problems with some number of alternating "quantifiers" that make the problems more complex. An example: Given X, does there exists Y such that for every Z there exists W such that R happens? The more quantifiers a problem contains, the more complex it is and the higher up it is in the polynomial hierarchy.

Typical problem: Determine if there exists a clique of size 50 but no clique of size 51.

What researchers want to know: Computer scientists have not been able to prove that PH is different from P. This problem is equivalent to the P versus NP problem because if (unexpectedly) P = NP, then all of PH collapses to P (that is, P = PH)



**PSPACE: Polynomial Space**

Short: PSPACE contains all the problems that can be solves with a reasonable amount of memory

Precise: In PSPACE you don't care about time, you care only about the amount of memory required to run the algorithm. Computer scientists have proven that PSPACE contains PH, which contains NP, which contains P.

Typical problem: Every problem in P, NP and PH is in PSPACE

What researchers want to know: Is PSPACE different from P?



**BQP: Bounded-error Quantum Polynomial time**

Short: All problems that are easy for a quantum computer to solve

Precise: All problems that can be solved in polynomial time for a quantum computer.

Typical problems: Identify all the prime factors of an integer.

What researchers want to know: Computer scientists have proven that BQP is contained in PSPACE and that BQP contains P. They don't know whether BQP is in NP, but they believe that the two classes are incomparable. There are problems that are in NP and not BQP and vice versa.



**EXPTIME: Exponential time**

Short: All the problems that can be solved in an exponential amount of time by a classical computer.

Precise: EXP contains all the previous classes - P, NP, PH, PSPACE and BQP. Researchers have proven that it's different from P - They have found problems in EXP that are not in P.

Typical problem: Generalization of games like chess and checkers are in EXP. If a chess board can be of any size, it becomes a problem in EXP to determine which player has the advantaage in a given board position.

What researchers want to know: Computer scientists would like to be able to prove that PSPACE does not contain EXP. They believe there are problems in EXP that are not in PSPACE, because sometimes in EXP you need a lot of memory to solve the problems. Computer scientists know how to separate EXP and P.



**BPP: Bounded-error Probabilistic Polynomial time**

Short: Problems that can be quickly solved by algorithms that include an element of randomness.

Precise: BPP is exactly the same as P, but with the difference that the algorithm is allowed to include steps where it's decision-making is randomized. Algorithms in BPP are required only to give the right answer with a probability close to 1.

Typical problem: You're handed two different formulas that each product a polynomial that has many variables. Do the formulas compute the exact same polynomial? This is called the polynomial identity testing problem.

What researchers want to know: Computer scientists would like to know whether BPP = P. If that's true, it would mean that every randomized algorithm can be de-randomized. They believe this is the case - that there is an efficient deterministic algorithm for every problem for which there exists an efficient randomized algorithm - but they have not been able to prove it.
