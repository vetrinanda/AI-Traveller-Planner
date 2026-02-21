from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

'''
For the rate limiting to work, we need to set the it
'''