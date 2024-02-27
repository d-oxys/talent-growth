from collections import deque

def breadthFirstSearch(graph, startNode):
    queue = deque([startNode])
    result = []

    while queue:
        currentNode = queue.popleft()

        if currentNode not in result:
            result.append(currentNode)
            neighbors = graph[currentNode]

            for neighbor in neighbors:
                if neighbor not in result:
                    queue.append(neighbor)

    return result

graph = {
    0: [1, 2],
    1: [0, 3, 4],
    2: [0, 5],
    3: [1],
    4: [1],
    5: [2]
}

startNode = 0

print(breadthFirstSearch(graph, startNode))  # Output: [0, 1, 3, 4, 2, 5]
