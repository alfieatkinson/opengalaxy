# core/views.py

from django.http import JsonResponse

def health_check(request):
    """
    Health check endpoint to verify that the server is running.
    """
    return JsonResponse({"status": "ok"})
