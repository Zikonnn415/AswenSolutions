class TokenToBearerMiddleware:
    """
    Allows the frontend to send 'Token <jwt>' and transparently
    converts it to 'Bearer <jwt>' so SimpleJWT can authenticate it.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        auth = request.META.get('HTTP_AUTHORIZATION', '')
        if auth.startswith('Token '):
            request.META['HTTP_AUTHORIZATION'] = 'Bearer ' + auth[6:]
        return self.get_response(request)
