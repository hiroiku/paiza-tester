import sys

print(' '.join(map(str, [int(number) * 2 for number in sys.stdin.read().split()])))
