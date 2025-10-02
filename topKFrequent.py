import heapq
from collections import Counter

def topKFrequent(nums, k):
    counts = Counter(nums)
    heap = []
    for num, freq in counts.items():
        heapq.heappush(heap, (freq, num))
        if len(heap) > k:
            heapq.heappop(heap)
    return [num for freq, num in heap]
